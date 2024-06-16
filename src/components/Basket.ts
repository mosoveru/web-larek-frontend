import { Product } from './Product';
import { IEvents } from './base/events';

export class Basket implements IBasketData {
	basket: IProduct[] = [];
	total: number = 0;

	constructor(protected events: IEvents) {}

	set basketItem(item: IProduct) {
		this.basket.push(item);
		if (item.price !== null) {
			this.total += item.price;
		}
		this.events.emit('basket:changed', {
			basket: this.basket,
			total: this.total,
		});
	}

	get basketInfo(): IBasketData {
		return {
			basket: this.basket,
			total: this.total,
		};
	}

	removeItem(index: number): void {
		this.total -= this.basket[index].price;
		this.basket.splice(index, 1);
		this.events.emit('basket:changed', {
			basket: this.basket,
			total: this.total,
		});
	}

	removeAll(): void {
		this.total = 0;
		this.basket = [];
		this.events.emit('basket:changed', {
			basket: this.basket,
			total: this.total,
		});
	}
}
