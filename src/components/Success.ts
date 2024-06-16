import { ensureAllElements, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Success extends Component {
	totalSpentDescription: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
		this.totalSpentDescription = ensureElement(
			'.order-success__description',
			this.container
		);
	}
	set spentTotal(total: number) {
		this.totalSpentDescription.textContent = `Списано ${String(
			total
		)} синапсов`;
	}
}
