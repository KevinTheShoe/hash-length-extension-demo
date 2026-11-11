document.addEventListener('DOMContentLoaded', () => {
	for (let e of document.getElementsByClassName('input-blocks')) {
		e.replaceChildren(...generateBlocks(document.getElementById(e.dataset.input).value));
	}
});


function el(tag, cls, id, text) {
	const node = document.createElement(tag);
	if (cls) node.className = cls;
	if (id) node.id = cls;
	if (text !== undefined) node.textContent = text;
	return node;
}


function generateBlocks(data, blockSize = 64) {
	if (typeof data === 'string') data = new TextEncoder().encode(data); // turn to bytearray if string
	const blocks = [];
	for (let i = 0; i < data.length; i += blockSize) {
		const block = el('div', 'block');
		for (const byte of data.subarray(i, i + blockSize)) {
			if (byte >= 32 && byte <= 126) block.append(el('span', 'byte letter', null, String.fromCharCode(byte)));
			else block.append(el('span', 'byte hex', null, byte.toString(16).padStart(2, '0')));
		}
		blocks.push(block);
	}
	return blocks;
}
