"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trie_1 = require("@ethereumjs/trie");
const keccak_1 = require("ethereum-cryptography/keccak");
const trie = new trie_1.Trie({});
const emptyTrieRoot = trie.root();
console.log({ emptyTrieRoot: emptyTrieRoot });
const results = [];
async function test(key, val) {
    const prev_root = trie.root();
    await trie.put(Buffer.from((0, keccak_1.keccak256)(Buffer.from(key))), Buffer.from(val)); // We update (using "put") the trie with the key-value pair "testKeyX": "testValueX"
    const value = await trie.get(Buffer.from((0, keccak_1.keccak256)(Buffer.from(key)))); // We retrieve (using "get") the value at key "testKeyX"
    const rootChange = {
        test: `Trie.put(key: Buffer.from(${key}), value: Buffer.from(${value}))`,
        result: { Previous_Trie_Root: prev_root, Updated_Trie_Root: trie.root() },
    };
    console.log(rootChange);
    results.push({
        test: `await trie.get(key: Buffer.from(${key}))`,
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
const main = async () => {
    for (const t of testData) {
        await test(...t);
    }
    console.log(results);
};
main();
