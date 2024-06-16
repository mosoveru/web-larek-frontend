import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class BasketModal extends Component {
	protected content: HTMLElement;
	protected basketbutton: HTMLButtonElement;
	protected basketPrice: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.basketbutton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this.basketPrice = ensureElement(
			'.basket__price',
			this.container
		);
		this.basketbutton.addEventListener('click', () => {
			this.events.emit('order:make');
		});
	}

	set totalPrice(total: number) {
		this.basketPrice.textContent = `${total} синапсов`;
	}

	set contentList(element: HTMLElement) {
		this.content = element;
	}

	setActiveBasketButton() {
		this.basketbutton.disabled = false;
	}

	setDisabledBasketButton() {
		this.basketbutton.disabled = true;
	}
}

export class BasketList extends Component {
	constructor(
		container: HTMLElement,
		protected template: HTMLTemplateElement,
		protected events: IEvents
	) {
		super(container);
	}

	makeList(items: IProduct[]) {
		this.container.replaceChildren();
		items.forEach((value, index) => {
			const listItem = cloneTemplate(this.template);
			ensureElement('.basket__item-index', listItem).textContent = (
				index + 1
			).toString();
			ensureElement('.card__title', listItem).textContent = value.title;
			ensureElement('.card__price', listItem).textContent = value.price
				? value.price.toString()
				: 'Бесценно';
			ensureElement('.basket__item-delete', listItem).addEventListener(
				'click',
				() => {
					this.events.emit('basket:remove-item', { index: index });
				}
			);
			this.container.append(listItem);
		});
	}
}
