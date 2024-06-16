import { CleanPlugin } from 'webpack';
import { CDN_URL } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IActions {
	onClick: () => void;
}

export class Card extends Component {
	protected category: HTMLElement;
	protected title: HTMLElement;
	protected image: HTMLImageElement;
	protected price: HTMLElement;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		actions?: IActions
	) {
		super(container);
		if (actions?.onClick) {
			this.container.addEventListener('click', () => {
				actions.onClick();
			});
		}
	}

	fillCardFields(data: IProduct) {
		this.category = ensureElement('.card__category', this.container);
		this.title = ensureElement('.card__title', this.container);
		this.image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this.price = ensureElement('.card__price', this.container);
		this.title.textContent = data.title;
		this.image.src = `${CDN_URL}${data.image}`;
		if (data.price) {
			this.price.textContent = `${data.price.toString()} синапсов`;
		} else {
			this.price.textContent = 'Бесценно';
		}
	}

	setCategory(data: string) {
		switch (data) {
			case 'софт-скил': {
				this.category.classList.add('card__category_soft');
				this.category.textContent = data;
				break;
			}
			case 'другое': {
				this.category.classList.add('card__category_other');
				this.category.textContent = data;
				break;
			}
			case 'хард-скил': {
				this.category.classList.add('card__category_hard');
				this.category.textContent = data;
				break;
			}

			case 'дополнительное': {
				this.category.classList.add('card__category_additional');
				this.category.textContent = data;
				break;
			}
			case 'кнопка': {
				this.category.classList.add('card__category_button');
				this.category.textContent = data;
				break;
			}
		}
	}
}

export class Preview extends Card {
	description: HTMLElement;
	cardButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents, actions: IActions) {
		super(container, events);
		this.description = ensureElement('.card__text', this.container);
		this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
		this.cardButton.addEventListener(
			'click',
			() => {
				actions.onClick();
			}
		);
	}
	
	protected fillDescription(text: string) {
		this.description.textContent = text;
	}

	fillPreview(data: IProduct) {
		if (data.price === null) {
			this.cardButton.disabled = true;
			this.cardButton.textContent = 'Не продаётся';
		} else {
			this.cardButton.disabled = false;
			this.cardButton.textContent = 'В корзину';
		}
		this.fillCardFields(data);
		this.setCategory(data.category);
		this.fillDescription(data.description);
	}
}
