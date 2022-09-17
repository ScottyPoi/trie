"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trie_1 = require("@ethereumjs/trie");
const keccak_1 = require("ethereum-cryptography/keccak");
const proof_1 = __importDefault(require("./proof"));
const trie = new trie_1.Trie({});
const emptyTrieRoot = trie.root();
// console.log(" -- Start with an empty Trie:  new Trie({})");
// console.log({ emptyTrieRoot: "0x" + emptyTrieRoot.toString("hex") });
// console.log(
//   ' -- Update the trie (using "trie.put()") with the key-value pair "testKeyX": "testValueX"'
// );
const results = [];
async function test(key, val) {
    await trie.put(Buffer.from((0, keccak_1.keccak256)(Buffer.from(key))), Buffer.from(val));
    const value = await trie.get(Buffer.from((0, keccak_1.keccak256)(Buffer.from(key))));
    console.log({
        Update_Trie: `trie.put(key: ${key}, value: ${value})`,
    });
    console.log({
        updated_trie_root: "0x" + trie.root().toString("hex").slice(0, 16) + "...",
    });
    results.push({
        Trie_get: `await trie.get(key: ${key})`,
        result: {
            value_bytes: value,
            value_string: value?.toString(),
        },
    });
}
const testData = [
    ["testKey1", "testValue1"],
    ["testKey2", "testValue2"],
];
const fillData = [];
for (let i = 2; i < 32; i++) {
    fillData.push([
        Buffer.from((0, keccak_1.keccak256)(Buffer.from(`testKey${i}`))),
        Buffer.from(`testValue${i}`),
    ]);
}
const main = async () => {
    for (const t of testData) {
        await test(...t);
    }
    console.log(' -- Retrieve (using trie.get) the value at key "testKeyX"');
    for (const result of results) {
        console.log(result);
    }
};
// main();
(0, proof_1.default)();
