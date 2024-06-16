import { Basket } from './components/Basket';
import { Form } from './components/Form';
import { Card, Preview } from './components/Card';
import { Page } from './components/Page';
import { Product, ProductList } from './components/Product';
import { Modal } from './components/base/Modal';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketList, BasketModal } from './components/BasketModal';
import { Order } from './components/Order';
import { Person } from './components/Person';
import { Success } from './components/Success';

const events = new EventEmitter();
let productList;
events.on('product-list:ready', (data: IProduct[]) => {
	productList = new ProductList(data, events, Product);
	productList.listItems.forEach((value) => {
		const clone = cloneTemplate(cardTemplate);
		const card = new Card(clone, events, {
			onClick: () => events.emit('preview:open', value),
		});
		card.fillCardFields(value);
		card.setCategory(value.category);
		page.contentData = card.render();
	});
	page.catalogData.forEach((value) => {
		galleryContainer.append(value);
	});
});

events.on('preview:open', (data: IProduct) => {
	const previewClone = cloneTemplate(previewTemplate);
	const preview = new Preview(previewClone, events, {
		onClick: () => events.emit('preview:add-to-cart', data)
	})
	preview.fillPreview(data);
	modal.contentData = preview.render();
	page.installLock = true;
	modal.open();
});

events.on('modal:close', () => {
	page.installLock = false;
});

events.on('preview:add-to-cart', (data: IProduct) => {
	basket.basketItem = data;
	modal.close();
});

events.on('basket:changed', (data: IBasketData) => {
	page.itemsCount = data.basket.length;
	basketModal.totalPrice = data.total;
	if (data.basket.length !== 0) {
		basketModal.setActiveBasketButton();
	} else {
		basketModal.setDisabledBasketButton();
	}
	basketList.makeList(data.basket);
});

events.on('basket:open', (data: IBasketData) => {
	page.installLock = true;
	basketList.makeList(data.basket);
	if (data.basket.length !== 0) {
		basketModal.setActiveBasketButton();
	} else {
		basketModal.setDisabledBasketButton();
	}
	basketModal.totalPrice = data.total;
	basketModal.contentList = basketList.render();
	modal.contentData = basketModal.render();
	modal.open();
});

events.on('basket:remove-item', (data: { index: number }) => {
	basket.removeItem(data.index);
	events.emit('basket:changed', basket.basketInfo);
});

events.on('order:make', () => {
	modal.contentData = order.renderOrder;
});

events.on('order-button:choose-method', (data: { name: string }) => {
	person.billing = data.name;
	if (person.validateAddressFields()) {
		order.setActiveNextButton();
	} else {
		order.setDisableNextButton();
	}
});

events.on('address-input:changed', (data: { field: string; value: string }) => {
	person.addressDelivery = data.value;
	if (person.validateAddressFields()) {
		order.setActiveNextButton();
	} else {
		order.setDisableNextButton();
	}
});

events.on(
	'contacts-input:changed',
	(data: { field: string; value: string }) => {
		if (data.field === 'email') {
			person.emailAddress = data.value;
		}
		if (data.field === 'phone') {
			person.telephoneNumber = data.value;
		}
		if (person.validateContactsFields()) {
			order.setActiveSubmitOrderButton();
		} else {
			order.setDisableSubmitOrderButton();
		}
	}
);

events.on('form-error:changed', (data: FormError) => {
	if (data.address) {
		form.textErrorAddress = data.address;
	} else if (data.payment) {
		form.textErrorAddress = data.payment;
	} else if (data.email) {
		form.textErrorContacts = data.email;
	} else if (data.phone) {
		form.textErrorContacts = data.phone;
	} else {
		form.clearErrors();
	}
});

events.on('order-button:next', () => {
	modal.contentData = order.renderContacts;
});

events.on('complete:order', () => {
	const itemsId = basket.basket.map((value) => {
		return value.id;
	});
	const newOrder = {
		...person.buyerInfo,
		total: basket.total,
		items: itemsId,
	};
	console.log(newOrder);
	api
		.post('/order/', newOrder)
		.then((result: OrderResponse) => {
			success.spentTotal = result.total;
			modal.contentData = success.render();
			basket.removeAll();
			person.clearAllFields();
			order.clearFields();
			order.setDisableNextButton();
      order.setDisableSubmitOrderButton();
		})
		.catch((res) => {
			console.log(res);
		});
});

const basketTemplate = cloneTemplate('#basket');
const basketListItem = ensureElement('.basket__list', basketTemplate);
const basketListItemTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalTemplate = ensureElement('#modal-container');
const galleryContainer = ensureElement('.gallery');
const pageContainer = ensureElement('.page__wrapper');
const counter = ensureElement('.header__basket-counter', pageContainer);
const orderTemplate = cloneTemplate<HTMLFormElement>('#order');
const contactsTemplate = cloneTemplate<HTMLFormElement>('#contacts');
const successTemplate = cloneTemplate('#success');
ensureElement('.header__basket').addEventListener('click', () => {
	events.emit('basket:open', basket.basketInfo);
});
ensureElement('.order-success__close', successTemplate).addEventListener(
	'click',
	() => {
		modal.close();
	}
);

const api = new Api(API_URL);
const page = new Page(pageContainer, counter);
const modal = new Modal(modalTemplate, events);
const basket = new Basket(events);
const basketList = new BasketList(
	basketListItem,
	basketListItemTemplate,
	events
);
const basketModal = new BasketModal(basketTemplate, events);
const order = new Order(orderTemplate, contactsTemplate, events);
const form = new Form(orderTemplate, contactsTemplate);
const person = new Person(events);
const success = new Success(successTemplate);

api
	.get('/product/')
	.then((result: IApiResponse) => {
		events.emit('product-list:ready', result.items);
	})
	.catch((reason) => {
		console.log(reason);
	});
