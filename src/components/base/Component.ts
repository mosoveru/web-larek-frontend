export abstract class Component {
	protected container: HTMLElement;
	constructor(container: HTMLElement) {
		this.container = container;
	}

	render(): HTMLElement {
		return this.container;
	}
}
