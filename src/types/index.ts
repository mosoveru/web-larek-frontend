interface IApiResponse {
  "total": number;
  "items": IProduct[];
}

interface IProduct {
 "category": string;
 "title": string;
 "image": string;
 "price": number;
 "description": string;
 "id": string;
}

interface IList {
  list: IProduct[];
}

interface IPerson {
  email: string;
  phone: string;
  payment: string;
  address: string;
}

interface IBasketData {
  basket: IProduct[];
  total: number;
}

type FormError = Partial<Record<keyof IPerson, string>>;

interface OrderResponse {
  "id": string;
  "total": number;
}