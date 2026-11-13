import { sha256 } from './noble/sha2.js';


export const strToBytes = (str) => new TextEncoder().encode(str);


export function padBytes(bytes) {
	const totalBytes = Math.ceil((bytes.length + 9) / 64) * 64;
	const padded = new Uint8Array(totalBytes);

	// original bytes
	padded.set(bytes);

	// 0x80 byte at end of original bytes
	padded[bytes.length] = 0x80;

	// data bit length as a 64-bit big-endian integer in last 8 bytes
	new DataView(padded.buffer).setBigUint64(totalBytes - 8, BigInt(bytes.length * 8), false);

	return padded;
}


export function splitBytes(bytes) {
	const blocks = [];
	for (let i = 0; i < bytes.length; i += 64) blocks.push(bytes.subarray(i, i + 64));
	return blocks;
}


export const DEFAULT_IV = [
	0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
	0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
];

export function compressBlock(block, state = DEFAULT_IV) {
	const h = sha256.create();
	[h.h0, h.h1, h.h2, h.h3, h.h4, h.h5, h.h6, h.h7] = state;
	h.update(block);
	return [h.h0, h.h1, h.h2, h.h3, h.h4, h.h5, h.h6, h.h7];
}


export const stateToHex = (state) => state.map(n => (n >>> 0).toString(16).padStart(8, '0')).join('');
