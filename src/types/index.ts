// Категория товара
export type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил' ;

// Интерфейс описывает товар
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: ProductCategory;
    price: number | null;
    selected?: boolean;
}

// Интерфейс описывает заказ
export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    items: string[];
    total: number;
}

export type IOrderInvoice = Omit<IOrder, 'items'> & {
	items: string[];
	total: number;
};

export type TOrderPayment = 'cash' | 'card';

export type TOrderStep = 'shipment' | 'contacts';

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IActions {
        onClick: (evt: MouseEvent) => void;
}

export interface IAddressForm {
    address:string;
    payment:string;
}

export interface IContactsForm {
    phone:string;
    email:string;
}