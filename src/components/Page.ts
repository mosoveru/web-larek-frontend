import { Component } from './base/Component';

export class Page extends Component {
	catalog: HTMLElement[] = [];

	constructor(container: HTMLElement, protected counter: HTMLElement) {
		super(container);
	}

	set contentData(element: HTMLElement) {
		this.catalog.push(element);
	}

	set installLock(value: boolean) {
		if (value) {
			this.container.classList.add('page__wrapper_locked');
		} else {
			this.container.classList.remove('page__wrapper_locked');
		}
	}

	set itemsCount(total: number) {
		this.counter.textContent = total.toString();
	}
	
	get catalogData(): HTMLElement[] {
		return this.catalog;
	}
}
