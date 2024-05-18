import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IPage {
    counter:number;
    catalog:HTMLElement[];
    locked:boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLButtonElement;
    protected _catalog: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement('.header__basket-counter', container);
        this._wrapper = ensureElement('.page__wrapper', container);
        this._basket = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._catalog = ensureElement('.gallery', container);

        this._basket.addEventListener('click', (evt) => {
            this.events.emit('basket:open')
        })
    }

    set counter(value: number) {
		  this.setText(this._counter, String(value));
	  } 

    set catalog(items: HTMLElement[]) {
		  this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
		  this._wrapper.classList.toggle('page__wrapper_locked', value);
	  }
}