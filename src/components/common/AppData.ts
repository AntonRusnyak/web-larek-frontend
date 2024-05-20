import _ from 'lodash'
import { ICard, IOrder, IAddressForm, IContactsForm } from "../../types";
import { Model } from "../base/Model";

type IMessageErore = Partial<Record<keyof IOrder, string>>;

export interface IValid{
    address:string;
    payment:string;
    phone:string;
    email:string
}

export interface IAppData {
    catalog:ICard[];
    order:IOrder|null;
    basket:ICard[];
    setCatalog(items: ICard[]): void;
	addToBasket(product:ICard): void;
	removeBasket(product: ICard): void;
	getResultBasket(): number;
}

export class AppData extends Model<IAppData> {
	catalog: ICard[] = [];

	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};

	messageErore: IMessageErore = {};

	toggleOrderedItem(id: string, isIncluded: boolean): void {
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}

		this.order.total = this.getTotal();
	}

	isIncludedCard(cardId: string): boolean {
		return this.order.items.some((itemId) => itemId === cardId);
	}

	getTotal(): number {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,0);
	}

	setCatalog(items: ICard[]): void {
		this.catalog = items;
		this.emitChanges('cards:changed', { catalog: this.catalog });
	}

	getAddProductInBasket(): ICard[] {
		return this.catalog.filter((item) => this.order.items.includes(item.id));
	}

	setOrderField(field: keyof IAddressForm, value: string): void {
		this.order[field] = value;
		this.validateOrderForm();
	}

	validateOrderForm(): boolean {
		const errors: typeof this.messageErore = {};

		if (!this.order.payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}

		this.messageErore = errors;
		this.events.emit('addressFormErrors:change', this.messageErore);

		return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof IContactsForm, value: string): void {
		this.order[field] = value;
		this.validateContactsForm();
	}

	validateContactsForm(): boolean {
		const errors: typeof this.messageErore = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.messageErore = errors;
		this.events.emit('contactsFormErrors:change', this.messageErore);

		return Object.keys(errors).length === 0;
	}

	getCountItems(): number {
		return this.order.items.length;
	}

	clearBasket(): void {
		this.order.items.forEach((id) => {
			this.toggleOrderedItem(id, false);
		});
	}

	resetForm(): void {
		this.order.payment = '';
		this.order.address = '';
		this.order.email = '';
		this.order.phone = '';
	}
}