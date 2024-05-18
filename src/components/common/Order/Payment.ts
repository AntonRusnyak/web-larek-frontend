import { IEvents } from "../../base/events";
import { Form } from "../Form";

export interface IPayment {
    payment: string;
    address: string;
}

export class DeliveryForm extends Form<IPayment>{
    protected _button: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._button = Array.from(
			container.querySelectorAll('.button_alt')
		);

		this._button.forEach((button) => {
			button.addEventListener('click', (e: Event) => {
				this._button.forEach((button) => {
					if (button === e.target) {
                        return;
                    };
                    
					button.classList.remove('button_alt-active');
				});

				events.emit('buttonPayments:select', {
					button: e.target as HTMLButtonElement,
				});
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}