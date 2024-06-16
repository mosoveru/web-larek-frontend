import { ensureAllElements, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Order extends Component {
	protected cashButton: HTMLButtonElement;
	protected cardButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement;
	protected emailInput: HTMLInputElement;
	protected telephoneInput: HTMLInputElement;
  protected buttonNext: HTMLButtonElement;
  protected submitOrderButton: HTMLButtonElement;

	constructor(
		container: HTMLFormElement,
		protected contacts: HTMLFormElement,
		protected events: IEvents
	) {
		super(container);
		Element;
		this.cashButton = container.elements.namedItem('cash') as HTMLButtonElement;
		this.cardButton = container.elements.namedItem('card') as HTMLButtonElement;
		this.addressInput = container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		this.emailInput = contacts.elements.namedItem('email') as HTMLInputElement;
		this.telephoneInput = contacts.elements.namedItem(
			'phone'
		) as HTMLInputElement;
    this.buttonNext = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
    this.submitOrderButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.contacts
		)
		this.cashButton.addEventListener('click', (e) => {
			const target = e.target as HTMLButtonElement;
			this.activePaymentButton = target;
			this.events.emit('order-button:choose-method', {
				name: this.cashButton.name,
			});
		});
		this.cardButton.addEventListener('click', (e) => {
			const target = e.target as HTMLButtonElement;
			this.activePaymentButton = target;
			this.events.emit('order-button:choose-method', {
				name: this.cardButton.name,
			});
		});
		this.addressInput.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			this.events.emit('address-input:changed', {
				field: target.name,
				value: target.value,
			});
		});
		ensureElement('.order__button', this.container).addEventListener(
			'click',
			(e) => {
				e.preventDefault();
				this.events.emit('order-button:next');
			}
		);
		this.emailInput.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			this.events.emit('contacts-input:changed', {
				field: target.name,
				value: target.value,
			});
		});
		this.telephoneInput.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			this.events.emit('contacts-input:changed', {
				field: target.name,
				value: target.value,
			});
		});
		this.contacts.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('complete:order');
		});
	}

	clearFields() {
		this.addressInput.value = '';
		this.emailInput.value = '';
		this.telephoneInput.value = '';
		this.cashButton.classList.remove('button_alt-active');
		this.cardButton.classList.remove('button_alt-active');
	}

	set activePaymentButton(button: HTMLButtonElement) {
		if (button === this.cardButton) {
			this.cardButton.classList.add('button_alt-active');
			this.cashButton.classList.remove('button_alt-active');
		} else {
			this.cardButton.classList.remove('button_alt-active');
			this.cashButton.classList.add('button_alt-active');
		}
	}

	setActiveNextButton() {
		this.buttonNext.disabled = false;
	}

	setDisableNextButton() {
		this.buttonNext.disabled = true;
	}

  setActiveSubmitOrderButton() {
    this.submitOrderButton.disabled = false;
  }

  setDisableSubmitOrderButton() {
    this.submitOrderButton.disabled = true;
  }

	get renderOrder(): HTMLElement {
		return this.container;
	}

	get renderContacts(): HTMLElement {
		return this.contacts;
	}
}
