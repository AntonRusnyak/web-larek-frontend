import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IActions } from "../../../types";

interface ISuccess {
	description: number;
	total: number;
}

export class Success extends Component<ISuccess> {
    protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLFormElement, actions: IActions) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(`.order-success__close`, container);
		this._description = ensureElement<HTMLElement>(`.order-success__description`, container);

		if (actions?.onClick) {
				this._button.addEventListener('click', actions.onClick);
		}
	}

	set description(value: number) {
		this.setText(this._description, 'Списано ' + value + ' синапсов');
	}
}