import * as sha256 from './sha256.js';


const shaDemoInput = document.getElementById('sha-demo-input');
shaDemoInput.addEventListener('input', shaDemoUpdate);
shaDemoUpdate();

function shaDemoUpdate() {
	const bytes = sha256.strToBytes(shaDemoInput.value);

	document.getElementById('sha-demo-split').replaceChildren(...sha256.splitBytes(bytes).map((block, idx) => createBlock(block, idx * 64, bytes.length)));

	const blocks = sha256.splitBytes(sha256.padBytes(bytes));

	document.getElementById('sha-demo-padded').replaceChildren(...blocks.map((block, idx) => createBlock(block, idx * 64, bytes.length)));

	let state = sha256.DEFAULT_IV;
	const nodes = [el('div'), el('span', 'hash-state', sha256.stateToHex(state))];

	blocks.forEach((block, idx) => {
		state = sha256.compressBlock(block, state);
		nodes.push(
			createBlock(block, idx * 64, bytes.length),
			el('img', null, null, { src: 'images/compression.svg' }),
			el('div'),
			el('span', 'hash-state', sha256.stateToHex(state))
		);
	});

	document.getElementById('sha-demo-full').replaceChildren(...nodes);
}


function createBlock(block, offset, dataLen) {
	const blockEl = el('div', 'hash-block');

	block.forEach((byte, i) => {
		const isData = offset + i < dataLen;
		const isPrintable = isData && byte >= 32 && byte <= 126;
		const text = isPrintable ? String.fromCharCode(byte) : byte.toString(16).padStart(2, '0').toUpperCase();
		const cls = `byte ${isData ? 'hash-data' : 'hash-padding'}${isPrintable ? '' : ' hex'}`;

		blockEl.append(el('span', cls, text));
	});

	return blockEl;
}

function el(tag, cls, text, attrs = {}) {
	const node = Object.assign(document.createElement(tag), attrs);
	if (cls) node.className = cls;
	if (text !== undefined) node.textContent = text;
	return node;
}
