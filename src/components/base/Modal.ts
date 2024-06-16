import { ensureElement } from '../../utils/utils';
import { Component } from './Component';
import { IEvents } from './events';

export class Modal extends Component {
	protected content: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.content = ensureElement('.modal__content', this.container);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.content.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	}

	set contentData(content: HTMLElement) {
		this.content.replaceChildren('');
		this.content.append(content);
	}

	open(): void {
		this.container.classList.add('modal_active');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}
}
