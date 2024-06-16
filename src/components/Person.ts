import { IEvents } from './base/events';

export class Person implements IPerson {
	email: string;
	phone: string;
	address: string;
	payment: string;
	fieldsErrors: FormError;

	constructor(protected events: IEvents) {}

	validateAddressFields() {
		const errors: typeof this.fieldsErrors = {};
		if (!this.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this.address) {
			errors.address = 'Введите адрес';
		}
		this.fieldsErrors = errors;
		this.events.emit('form-error:changed', this.fieldsErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactsFields() {
		const errors: typeof this.fieldsErrors = {};
		const regEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
		const regTel = new RegExp(
			/(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))/
		);
		if (!this.email) {
			errors.email = 'Введите EMail';
		} else if (!regEmail.test(this.email)) {
			errors.email = 'Введите корректный EMail';
		}
		if (!this.phone) {
			errors.phone = 'Введите номер телефона';
		} else if (!regTel.test(this.phone)) {
			errors.phone = 'Введите корректный номер телефона';
		}
		this.fieldsErrors = errors;
		this.events.emit('form-error:changed', this.fieldsErrors);
		return Object.keys(errors).length === 0;
	}

	clearAllFields(): void {
		this.email = '';
		this.address = '';
		this.payment = '';
		this.phone = '';
		this.fieldsErrors = {};
	}

	set emailAddress(email: string) {
		this.email = email;
	}

	set telephoneNumber(telephone: string) {
		this.phone = telephone;
	}

	set addressDelivery(address: string) {
		this.address = address;
	}

	set billing(billing: string) {
		this.payment = billing;
	}

	get buyerInfo(): IPerson {
		return {
			email: this.email,
			phone: this.phone,
			address: this.address,
			payment: this.payment,
		};
	}
}
