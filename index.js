import * as sha256 from './sha256.js';


document.addEventListener('DOMContentLoaded', () => {
	for (let e of document.getElementsByTagName('input')) {
		e.addEventListener('input', onInputChange);
		onInputChange({ target: e });
	}
});


function onInputChange(event) {
	for (let e of document.getElementsByClassName(event.target.dataset.target)) {
		e.replaceChildren(...generateBlockElements(event.target.value, e.classList.contains('padded')));
	}
}


function el(tag, cls, id, text) {
	const node = document.createElement(tag);
	if (cls) node.className = cls;
	if (id) node.id = cls;
	if (text !== undefined) node.textContent = text;
	return node;
}


function generateBlockElements(text, padded) {
	let bytes = sha256.strToBytes(text);
	if (padded) bytes = sha256.padBytes(bytes);
	const blocks = sha256.splitBytes(bytes);

	const blockElements = [];

	for (const block of blocks) {
		const blockElement = el('div', 'block');
		for (const byte of block) {
			if (byte >= 32 && byte <= 126) blockElement.append(el('span', 'byte data', null, String.fromCharCode(byte)));
			else blockElement.append(el('span', 'byte data hex', null, byte.toString(16).padStart(2, '0').toUpperCase()));
		}
		blockElements.push(blockElement);
	}

	return blockElements;
}
