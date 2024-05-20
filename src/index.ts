import './scss/styles.scss';

import { ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { Basket } from './components/common/Basket';

import { Contact } from './components/common/Order/Contact';
import { DeliveryForm } from './components/common/Order/Payment';
import { Success } from './components/common/Order/Success';

import { AppData } from './components/common/AppData';
import { Card, CardCatalog, CardForBasket, CardPreview } from './components/common/Card';
import { Form } from './components/common/Form';
import { Modal } from './components/common/Modal';
import { Page } from './components/common/Page';
import { WebApi } from './components/WebApi';

import { ICard, IAddressForm, IContactsForm } from './types';
import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL, CDN_URL, settings } from './utils/constants';


const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');


const api = new WebApi(CDN_URL, API_URL);
const eventEmitter = new EventEmitter();
const basket = new Basket(cloneTemplate(basketTemplate), eventEmitter);
const contact = new Contact(cloneTemplate(contactsTemplate), eventEmitter);
const deliveryForm = new DeliveryForm(cloneTemplate(orderTemplate), eventEmitter);
const succes = new Success(cloneTemplate(successTemplate), {onClick:()=> modal.close()});
const appData = new AppData({}, eventEmitter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), eventEmitter);
const page = new Page(document.body, eventEmitter);

function clearOrder() {
	appData.clearBasket();
	page.counter = appData.getCountItems();
	eventEmitter.off('order:clear', clearOrder);
}

eventEmitter.on('cards:changed', (cards: { catalog: ICard[] }) => {
	page.catalog = cards.catalog.map((item) => {
		const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
			onClick: () => eventEmitter.emit('card:select', item),
		});

		card.setColorCategory(item.category, settings);
		return card.render({
			price: item.price,
			title: item.title,
			image: item.image,
			category: item.category,
		});
	});
});

// Обработчик события выбора карточки товара
eventEmitter.on('card:select', (item: ICard) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.isIncludedCard(item.id)) {
				appData.toggleOrderedItem(item.id, true);
				page.counter = appData.getCountItems();
				card.buttonText = 'Удалить из корзины'; // Устанавливаем текст кнопки "Удалить из корзины"
			} else {
				appData.toggleOrderedItem(item.id, false);
				page.counter = appData.getCountItems();
				card.buttonText = 'В корзину'; // Устанавливаем текст кнопки "В корзину"
			}
		},
	});

	// Устанавливаем текст кнопки в зависимости от состояния товара в корзине
	card.buttonText = appData.isIncludedCard(item.id)
		? 'Удалить из корзины'
		: 'В корзину';

	card.setColorCategory(item.category, settings);
	card.buttonStatus = item.price;
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description
		}),
	});
});

// Обработчик события открытия корзины
eventEmitter.on('basket:open', () => {
	basket.items = appData.getAddProductInBasket().map((item, index) => {
		const card = new CardForBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.toggleOrderedItem(item.id, false);
				page.counter = appData.getCountItems();
				eventEmitter.emit('basket:open');
			},
		});

		return card.render({
			price: item.price,
			title: item.title,
			index: index + 1,
		});
	});

	// Рендеринг корзины в модальном окне
	modal.render({
		content: basket.render({
			total: appData.getTotal(),
			selected: appData.order.items,
		}),
	});
});

// Обработчик события открытия формы заказа
eventEmitter.on('order:open', () => {
	// Рендеринг формы адреса в модальном окне
    modal.render({
		content: deliveryForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик события выбора способа оплаты
eventEmitter.on('buttonPayments:select', (event: { button: HTMLButtonElement }) => {
	event.button.classList.add('button_alt-active');
	appData.setOrderField('payment', event.button.getAttribute('name'));
});

// Обработчик изменения полей формы адреса
eventEmitter.on(
	'order:change',
	(data: { field: keyof IAddressForm; value: string }) => {
 		appData.setOrderField(data.field, data.value);
	}
);

//Обработчик изменения ошибок формы адреса
eventEmitter.on('addressFormErrors:change', (errors: Partial<IAddressForm>) => {
	const { address, payment } = errors;
	deliveryForm.valid = !address && !payment;
	deliveryForm.errors = Object.values({ address, payment }).filter((i) => !!i).join('; ');
});

// Обработчик события отправки заказа
eventEmitter.on('order:submit', () => {
	// Рендеринг формы контактов в модальном окне
	modal.render({
		content: contact.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

eventEmitter.on(
	'contacts:change',
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

eventEmitter.on('contactsFormErrors:change', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contact.valid = !phone && !email;
	contact.errors = [phone, email].filter((i) => !!i).join('; ');
});

// Обработчик события отправки данных формы контакт
eventEmitter.on('contacts:submit', () => {
	// Отправка данных формы контактов на сервер
	api
		.createOrder(appData.order)
		.then((result) => {
			// Отображение сообщения об успешном заказе
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					// Очистка корзины после успешного заказа
					clearOrder();
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
			eventEmitter.on('order:clear', clearOrder);
		})
		.catch((err) => {
			console.error(err);
		});
});

// Обработчик события открытия модального окна
eventEmitter.on('modal:open', () => {
	page.locked = true; // Блокировка страницы при открытии модального окна
});

// Обработчик события закрытия модального окна
eventEmitter.on('modal:close', () => {
	page.locked = false; // Разблокировка страницы при закрытии модального окна
});

// Очистка данных полей для активации валидации после закрытия модального окна
eventEmitter.on('form:reset', () => {
	appData.resetForm();
});

api
	.getCardsList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
