interface IApiResponse {
  "total": number;
  "items": IProduct[];
}

interface IProduct {
 "category": string;
 "title": string;
 "image": string;
 "cost": number;
 "description": string;
 "id": string;
}

interface IList<T> {
  List: Map<string, T>;
  returnList(): T[];
  fillList(product: T | T[]): void;
}

interface IPerson {
  email: string;
  telephone: string;
  billingMethod: string;
  address: string;
}

interface UI<T> {
  container: HTMLElement;
  template: HTMLElement;
  render(data: T | T[]): void;
}

enum Events {
  LIST_READY = 'user:list-ready',
  ADD_CART = 'user:add-to-cart',
  DELETE_CART = 'user:clear-cart',
  DELETE_ITEM = 'user:clear-cart-item',
  CONTACTS_DATA = 'user:contacts',
  ADDRESS_DATA = 'user:address',
  USER_DATA_READY = 'user:data-ready',
  FILL_PAGE = 'ui:fill',
  SHOW_PREVIEW = 'ui:preview',
  CART_PAGE = 'ui:show-cart',
  CONTACTS_PAGE = 'ui:show-contacts-page',
  ADDRESS_PAGE = 'ui:show-address-page',
  SUCCESS_PAGE = 'ui:show-success-page'
};