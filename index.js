import * as sha256 from './sha256.js';


const shaDemoInput = document.getElementById('sha-demo-input');
const shaDemoExtensionInput = document.getElementById('sha-demo-extension-input');
shaDemoInput.addEventListener('input', shaDemoUpdate);
shaDemoExtensionInput.addEventListener('input', shaDemoUpdate);
shaDemoUpdate();

function shaDemoUpdate() {
	const bytes = sha256.strToBytes(shaDemoInput.value);

	document.getElementById('sha-demo-split').replaceChildren(...createBlockEls(sha256.splitBytes(bytes), bytes.length));

	const blocks = sha256.splitBytes(sha256.padBytes(bytes));

	document.getElementById('sha-demo-padded').replaceChildren(...createBlockEls(blocks, bytes.length));

	document.getElementById('sha-demo-full').replaceChildren(...createShaFullDemoEls(blocks, bytes.length));

	document.getElementById('sha-demo-result').textContent = `"${new TextDecoder().decode(bytes)}" => ${sha256.stateToHex(sha256.compressBlock(sha256.joinBytes(blocks)))}`;

	const extendedBytes = sha256.joinBytes(blocks, sha256.strToBytes(shaDemoExtensionInput.value));
	const extendedBlocks = sha256.splitBytes(sha256.padBytes(extendedBytes));

	document.getElementById('sha-demo-extension').replaceChildren(...createShaFullDemoEls(extendedBlocks, extendedBytes.length));

	document.getElementById('sha-demo-extension-result').textContent = `"${new TextDecoder().decode(extendedBytes)}" => ${sha256.stateToHex(sha256.compressBlock(sha256.joinBytes(extendedBlocks)))}`;
}


const extensionDemoInput = document.getElementById('extension-demo-input');
extensionDemoInput.addEventListener('input', extensionDemoUpdate);
extensionDemoUpdate();

function extensionDemoUpdate() {
	const bytes = sha256.strToBytes(extensionDemoInput.value);
	const blocks = sha256.splitBytes(sha256.padBytes(bytes, 145));
	document.getElementById('extension-demo').replaceChildren(...createShaFullDemoEls(blocks, bytes.length, sha256.hexToState('f292d76ba39099213d5d0736801f784b0f797a4e7044489b71b8d9f3d78c1342')));
}


function createShaFullDemoEls(blocks, dataLen, startingState = sha256.DEFAULT_IV) {
	let state = startingState;
	const nodes = [el('div'), el('span', 'hash-state', sha256.stateToHex(state))];

	blocks.forEach((block, idx) => {
		state = sha256.compressBlock(block, state);
		nodes.push(
			createBlockEl(block, idx * 64, dataLen),
			el('img', null, null, { src: 'images/compression.svg' }),
			el('div'),
			el('span', 'hash-state', sha256.stateToHex(state))
		);
	});

	return nodes;
}

function createBlockEls(blocks, dataLen) {
	return blocks.map((block, idx) => createBlockEl(block, idx * 64, dataLen));
}

function createBlockEl(block, offset, dataLen) {
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
