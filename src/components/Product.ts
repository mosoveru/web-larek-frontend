import { IEvents } from './base/events';

interface IProductConstructor {
	new (data: IProduct, events: IEvents): Product;
}

export class Product implements IProduct {
	category: string;
	title: string;
	image: string;
	price: number;
	description: string;
	id: string;

	constructor(data: IProduct, protected events: IEvents) {
		this.category = data.category;
		this.title = data.title;
		this.image = data.image;
		this.price = data.price;
		this.description = data.description;
		this.id = data.id;
	}

	get productInfo(): IProduct {
		return {
			category: this.category,
			title: this.title,
			image: this.image,
			price: this.price,
			description: this.description,
			id: this.id,
		};
	}
}

export class ProductList implements IList {
	list: Product[] = [];
	constructor(
		data: IProduct[],
		protected events: IEvents,
		Product: IProductConstructor
	) {
		data.forEach((value) => {
			this.list.push(new Product(value, events));
		});
	}

	set product(data: Product) {
		this.list.push(data);
	}

	get listItems(): Product[] {
		return this.list;
	}
}
