class DomManipulator {
	createElement(elementName, parent) {
		let element = document.createElement(elementName);
		parent.appendChild(element);
		return element;
	}
}