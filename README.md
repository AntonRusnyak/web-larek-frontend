# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Типы данных

### interface ICard - Интерфейс описывает товар
`id: string` - товар
`description: string` - описание товара
`image: string` - изображение товара
`title: string` - название товара
`category: ProductCategory` - категория товара
`price: number | null` - цена товара

### interface IOrder - Интерфейс описывает заказ
`payment: string` - способ оплаты
`email: string` - почта пользователя
`phone: string` - телефон пользователя
`address: string` - адрес пользователя
`total: number` - общая стоимость
`items: string[]` - товары

### interface IMainPage - Главная страница
`counter: number` - счетчик товаров в корзине
`cards: ICard[]` - католог товаров

### interface IFormPayment - Интерфейс описывает способ оплаты и адрес пользователя для заказа
`payment: string` - способ оплаты
 `address: string` - адрес доставки

### interface IFormContact - Интерфейс описывает email и телефон пользователя для заказа
`email: string` - почта пользователя
`phone: string` - телефон пользователя

### interface ICompletedPurchase - Интерфейс описывает выполненную покупку
`id: string` - id заказа
`total: number` - общая стоимость заказа

### interface IFormCompletedPurchase - Интерфейс описывает форму выполненной покупки
`total: number` - списанные деньги


## Базовый код

### class Api - логика отправки запроса на сервер. В конструкторе передается адрес сервера и опциональный объект с запросами
#### конструктор класса 
constructor(baseUrl: string, options: RequestInit = {}) {}
#### методы класса
`handleResponse` - обрабатывает ответ с сервера 
`get` - получение данных 
`post` - отправка данных

### class Component - Инструментарий для работы с DOM в дочерних компонентах
#### методы класса
`toggleClass` - Переключить класс 
`setText` - Установить текстовое содержимое 
`setDisabled` - Сменить статус блокировки 
`setHidden` - Скрыть 
`setVisible` - Показать 
`setImage` - Установить изображение с алтернативным текстом 
`render` - Вернуть корневой DOM-элемент

### class EventEmitter - Брокер событий, классическая реализация
#### конструктор класса 
constructor() {this._events = new Map<EventName, Set<Subscriber>>();} 
#### методы класса
`on` - Установить обработчик на событие
`off` - Снять обработчик с события
`emit` - Инициировать событие с данными
`onAll` - Слушать все события 
`offAll` - Сбросить все обработчики 
`trigger` - Сделать коллбек триггер, генерирующий событие при вызове 

### class Model - для создания моделей данных
#### конструктор класса 
constructor(data: Partial<T>, protected events: IEvents) {Object.assign(this, data);}
#### методы класса
`emitChanges` - Сообщить всем что модель поменялась

## Компоненты
### class Page - добавляет товары и добавляет слушатель на корзину
### class Basket - добавляет корзину
### class Form - общая форма
### class Modal - добавляет модальное окно
### class FormPayment - добавляет форму способа оплаты и адреса пользователя
### class FormContact - добавляет форму email и телефона пользователя
### class FormCompletedPurchase - добавляет форму выполненной покупки