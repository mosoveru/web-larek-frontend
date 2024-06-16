import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class Form extends Component {
	addressErrors: HTMLElement;
	contactsErrors: HTMLElement;

	constructor(container: HTMLElement, contacts: HTMLElement) {
		super(container);
		this.addressErrors = ensureElement('.form__errors', container);
		this.contactsErrors = ensureElement('.form__errors', contacts);
	}

	set textErrorAddress(errors: string) {
		this.addressErrors.textContent = errors;
	}

	set textErrorContacts(errors: string) {
		this.contactsErrors.textContent = errors;
	}

	clearErrors() {
		this.addressErrors.textContent = '';
		this.contactsErrors.textContent = '';
	}
}
