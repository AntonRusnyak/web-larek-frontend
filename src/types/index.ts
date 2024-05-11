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
}

// Интерфейс описывает заказ
export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

// Главная страница
export interface IMainPage {
    counter: number; // Счетчик товаров в корзине
    cards: ICard[]; //Каталог товаров
}

// Интерфейс описывает способ оплаты и адрес пользователя для заказа
export interface IFormPayment {
    payment: string;
    address: string;
}

// Интерфейс описывает email и телефон пользователя для заказа
export interface IFormContact {
    email: string;
    phone: string;
}

// Интерфейс описывает выполненную покупку
export interface ICompletedPurchase {
    id: string;
    total: number;
}

// Интерфейс описывает форму выполненной покупки
export interface IFormCompletedPurchase {
    total: number; // Списанные деньги
}