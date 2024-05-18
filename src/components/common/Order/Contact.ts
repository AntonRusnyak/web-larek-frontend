import { IEvents } from "../../base/events";
import { Form } from "../Form";

export interface IContact {
    email:string;
    phone:string;
}

export class Contact extends Form<IContact> {
    constructor(container: HTMLFormElement, events:IEvents){
        super(container, events);
    }

    set email(value:string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value:string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;

    }
}