import { ApiListResponse, Api } from './base/api';
import {ICard, IOrderInvoice, IOrderResult } from '../types/index';

export interface IWebApi {
    getCardId: (id: string) => Promise<ICard>;
    getCardsList: () => Promise<ICard[]>;
    createOrder: (invoice: IOrderInvoice) => Promise<IOrderResult>;
}

export interface TOrderResult {
	id: string;
	total: number;
}

export class WebApi extends Api implements IWebApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardId(id:string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item:ICard)=>({...item,image:this.cdn + item.image,}));
	}

    getCardsList(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image
			}))
		);
	}

    createOrder(invoice: IOrderInvoice) {
		return this.post('/order', invoice).then((data: TOrderResult) => data);
	}
}