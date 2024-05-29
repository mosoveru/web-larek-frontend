# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
---  
## Архитектура  
![](WEB-larek.png)  
## Базовый код  
Все цепочки действий в проекте подчиняются принципу построения приложения MVP.  
В терминах MVP каждую цепочку действий в проекте можно описать следующей цепочкой:  
V --> P --> M --> P --> V  
То есть, цепочка начинается, когда происходит событие, привязанное к какому-то визуальному элементу на экране.  
### 1. Класс ``Api``  
Базовый класс для работы с API проекта WEB-ларёк. Конструктор класса принимает такие аргументы:  
1. Базовый URL ``baseUrl: string``.  
2. Объект настроек типа ``RequestInit``.  
Класс имеет такие методы:  
+ ``get`` и ``post`` для работы с получением и отправкой запроса соответственно. 
+ ``handleResponse`` для обработки пришедшего ответа и обработки ошибок запроса.  
### 2. Класс ``EventEmitter``  
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.  
Класс имеет методы ``on`` , ``off`` , ``emit`` — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.  
Дополнительно реализованы методы ``onAll`` и ``offAll`` — для подписки на все события и сброса всех подписчиков.  
Интересным дополнением является метод ``trigger`` , генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса ``EventEmitter``.  
На какие события реагирует класс ``EventEmitter`` описаны в разделе [`Ключевые типы данных``](#ключевые-типы-данных)  
## Компоненты модели данных (бизнес-логика)  
### 1. Класс ``Product``  
Класс ``Product`` хранит данные товара карточки. Реализует интерфейс ``IProduct``, который содержит в себе основные поля с информацией, приходящие с Api. Данный класс является основным хранилищем данных товара. При клике на карточку товара вызывается событие ``'user:add-to-cart'``, где слушатель события извлекает информацию из объекта ``Product`` с помощью метода ``returnProperties(): IProduct`` и отправляет товар в корзину с помощью метода ``fillList(product: IProduct | IProduct[]): void`` в классе ``Cart``, и вызывает метод рендера у объекта ``CommonUI<IProduct>`` для отображения числа товаров к корзине. Также, брокер событий читает информацию из объектов ``Product`` в списке ``ProductList`` при наступлении события ``'ui:fill'`` и вызывает метод рендера у соответствующего объекта класса ``CommonUI<IProduct>`` для отображения каталога товаров на главной странице. Модальное окно с превью товара появляется в результате события ``'ui:preview'``, информацию брокер считывает из экземпляра объекта ``Product`` и перенаправляет в метод рендера в соответствующий объект класса ``CommonUI<IProduct>``.  
Конструктор класса ``Product`` принимает на вход данные, которые соответствуют интерфейсу ``IProduct``, каждое поле есть параметр конструктора, который инициализирует соответствующее ему поле:  
+ ``category: string`` - категория товара
+ ``title: string`` - наименование товара
+ ``image: string`` - ресурс с изображением карточки товара
+ ``cost: number`` - стоимость товара
+ ``description: string`` - описание товара
+ ``id: string`` - уникальный идентификатор товара  
Класс имеет метод ``returnProperties(): IProduct``, который возвращает объект с данными, реализующий интерфейс ``IProduct``.
### 2. Класс ``ProductList``  
Класс ``ProductList`` хранит объекты типа ``IProduct`` в коллекции ``Map``. Класс реализует интерфейс ``IList``, который описывает базовое поле и методы для работы с коллекцией.  
Конструктор класса принимает на вход массив объектов класса ``Product``, с помощью которых заполняет коллекцию ``Map``. Также, конструктор инициализирует событие ``'user:list-ready'``, при котором брокер событий инициализирует событие ``'ui:fill'`` и вызывает метод рендера для отображения карточек из коллекции ``Map`` на главной странице.
Поле класса ``List: Map<string, IProduct>`` хранит в себе коллекцию ``Map``, где ключом является поле ``id`` класса ``Product``, а само значение - экземпляр класса ``Product``.
Методы класса:  
+ ``returnList(): IProduct[]`` - возвращает массив объектов типа ``IProduct``.
+ ``fillList(product: IProduct | IProduct[]): void`` - метод для заполнения коллекции ``Map``. На вход принимает массив объектов или сам объект класса ``Product``.  
### 3. Класс ``Cart``  
Класс ``Cart`` по аналогии с классом ``ProductList`` хранит объекты типа ``IProduct``, но только те, которые пользователь добавил в корзину с товарами. Класс реализует интерфейс ``IList``, но имеет дополнительные методы для работы с корзиной:  
+ ``removeFromCart(productId: string): void`` - метод, который удаляет конкретный товар из корзины.
+ ``resetCart(): void`` - метод, который полностью очищает корзину с товарами.  
Модальное окно с корзиной открывается после клика по ней при вызове события ``'ui:show-cart'``, при котором брокер вызывает метод рендера у компонента отображения. Брокер событий добавляет в класс ``Cart`` объекты ``Product`` по событию ``'user:add-to-cart'``, которое инициализируется при нажатии кнопки "В корзину" на превью товара. Товары из корзины удаляются по событию ``'user:clear-cart'`` или ``'user:clear-cart-item'``, брокер по этим событиям вызывает соответствующий метод рендера у объектов ``CommonUI<T>`` для отображения товаров в модальном окне корзины и их удалении из корзины.
### 4. Класс ``Person``  
Класс ``Person`` хранит в себе данные пользователя. Реализует интерфейсы ``IPerson``, который описывает все поля с данными пользователя. Объект класса ``Person`` заполняется на основании данных, которые пользователь вводит в модальных окнах оформления заказа. Причем по нажатию на кнопку "Далее" инициализируются события ``'ui:show-address-page'`` и ``'user:address'``, а для кнопки "Оплатить" ``'ui:show-contacts-page'`` и ``'user:contacts'`` соответственно, при которых брокер вызывает соответствующие сеттеры у объекта ``Person`` для заполнения данных из полей ввода в модальном окне в поля объекта. Брокер при наступлении событий ``'ui:show-address-page'`` и ``'user:address'`` вызывает соответствующие методы рендера у объектов ``CommonUI<T>`` для отображения нужных модальных окон на этапе оформления заказа. После нажатия кнопки "Оплатить" создаётся событие ``'ui:show-success-page'`` и ``'user:data-ready'``, при первом событии брокер вызывает метод рендера для отображения успешного выполнения заказа, а при втором событии объект класса ``Person`` обрабатывается и отправляется на сервер.  
Класс не имеет конструктора, все значения инициализируются при помощи сеттеров.
Поля класса:  
+ ``email: string`` - E-Mail пользователя.
+ ``telephone: string`` - телефон пользователя.
+ ``billingMethod: string`` - способ оплаты
+ ``address: string`` - адрес доставки пользователя.  
Сеттеры для установки значения полей:  
+ ``saveAddress(address: string): void`` - для установки адреса
+ ``chooseBillingMethod(billingMethod: string): void`` - для установки способа оплаты
+ ``saveTelephone(telephone: string): void`` - для установки номера телефона
+ ``saveEmail(email: string): void`` - для установки электронного адреса  

## Компоненты представления  
### Класс ``CommonUI<T>``  
Класс является компонентом отображения, отвечает за вывод информации на экран, поступающей из модели данных. Конструктор класса принимает на вход три параметра: контейнер, в котором должен осуществляться вывод, и шаблон, по которому идёт заполнение данными, а также функцию-рендер, которая обрабатывает, заполняет шаблон информацией из моделей данных, и выводит в контейнер.  
Каждый экземпляр класса ``CommonUI<T>`` отвечает за свою область отображения, благодаря разным функциям-рендерам и шаблонам. Примеры событий, на которые реагирует класс, описан ниже, механизм работы отображения при разных событиях описан в разделе [``Компоненты модели данных (бизнес-логика)``](#компоненты-модели-данных-бизнес-логика)    
Поля класса:  
+ ``container: HTMLElement`` - контейнер для вывода данных
+ ``template: HTMLElement`` - шаблон для заполнения данными  
Метод класса ``render(data?: T): void`` принимает на вход объект с данными, с помощью которых заполняется шаблон для вывода в контейнер.  
## Ключевые типы данных  
```
enum Events {
  LIST_READY = 'user:list-ready', //Список с товарами готов
  ADD_CART = 'user:add-to-cart', //Пользователь добавил товар в корзину
  DELETE_CART = 'user:clear-cart', //Пользователь полностью очистил корзину
  DELETE_ITEM = 'user:clear-cart-item', //Пользователь удалил предмет из корзины
  CONTACTS_DATA = 'user:contacts', //Сохранены контактные данные пользователя
  ADDRESS_DATA = 'user:address', //Сохранен адрес пользователя
  USER_DATA_READY = 'user:data-ready', //Объект с данными пользователя готов
  FILL_PAGE = 'ui:fill', //Отображение карточек товара на странице
  SHOW_PREVIEW = 'ui:preview', //Открытие меню предпросмотра карточки товара
  CART_PAGE = 'ui:show-cart', //Открытие модального окна с корзиной товаров
  CONTACTS_PAGE = 'ui:show-contacts-page', //Открытие модального окна для оформления заказа
  ADDRESS_PAGE = 'ui:show-address-page', //Открытие модального окна для оформления заказа
  SUCCESS_PAGE = 'ui:show-success-page' //Модальное окно о завершении оформления заказа
};
```

