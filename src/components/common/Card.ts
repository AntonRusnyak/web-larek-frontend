import { ICard } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IActions } from "../../types";
import { ProductCategory } from "../../types";

export type ICardModify = ICard & {
    disabled: boolean;
	index: number;
}

export class Card extends Component<ICardModify> {
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, protected action: IActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set id(value: string) {
		this.container.dataset.id = value;
	}

    set description(value: string) {
        this.setText(this._description, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, String(this._title));
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set category(value: ProductCategory) {
        this.setText(this._category, value);
    }

    set price(value: number | null) {
		if (value) {
			this.setText(this._price, `${Number(value)} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}
    }

    setColorCategory(
		value: ProductCategory,
		settings: Record<ProductCategory, string>
	): void {
		this.toggleClass(this._category, settings[value]);
	}

}

export class CardCatalog extends Card {
	constructor(container: HTMLElement, action?: IActions) {
		super(container, action);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);

		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			} else {
				container.addEventListener('click', action.onClick);
			}
		}
	}
}

export class CardForBasket extends Card {
    protected _index: HTMLElement;

	constructor(container: HTMLElement, action?: IActions) {
		super(container, action);

		this._button = container.querySelector('.card__button');
		this._index = container.querySelector('.basket__item-index');

		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			}
		}
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}
}

export class CardPreview extends Card {
    constructor(container: HTMLElement, action?: IActions) {
		super(container, action);

        this._description = ensureElement<HTMLElement>('.card__text', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			}
		}
	}

    set description(value: string) {
		this.setText(this._description, value);
	}

	set buttonText(value: string) {
		this.setText(this._button, value);
	}

	set buttonStatus(value: number) {
		if (!value) {
			this.setDisabled(this._button, true);
		}
	}
}