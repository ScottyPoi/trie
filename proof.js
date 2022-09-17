"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trie_1 = require("@ethereumjs/trie");
const keccak_1 = require("ethereum-cryptography/keccak");
const trie = new trie_1.Trie({});
const emptyTrieRoot = trie.root();
console.log(" -- Start with an empty Trie:  const trie = new Trie({})");
console.log({ trie_root: "0x" + emptyTrieRoot.toString("hex") });
console.log('UPDATE the trie (using "trie.put()") with the key-value pair "testKeyX": "testValueX"');
const results = [];
async function test(key, val) {
    await trie.put(Buffer.from((0, keccak_1.keccak256)(Buffer.from(key))), Buffer.from(val));
    const value = await trie.get(Buffer.from((0, keccak_1.keccak256)(Buffer.from(key))));
    console.log({
        Update_Trie: `trie.put(key: ${key}, value: ${value})`,
        updated_trie_root: "0x" + trie.root().toString("hex").slice(0, 16) + "...",
    });
    results.push({
        Trie_get: `await trie.get(key: ${key})`,
        value_to_String: value?.toString(),
    });
}
const testData = [
    ["testKey1", "testValue1"],
    ["testKey2", "testValue2"],
];
const fillData = [];
for (let i = 3; i <= 32; i++) {
    fillData.push([
        Buffer.from((0, keccak_1.keccak256)(Buffer.from(`testKey${i}`))),
        Buffer.from(`testValue${i}`),
    ]);
}
const proof = async () => {
    console.log("CREATE a proof for testValue12: trie.createProof(testKey12) ");
    const proof = await trie.createProof(fillData[9][0]);
    console.log({ proof });
    console.log("VERIFY inclusion using the proof and root With zero knowledge of the rest of the Trie");
    console.log("-- A valid proof will return the value");
    const newTrie = new trie_1.Trie({});
    const validate = await newTrie.verifyProof(trie.root(), fillData[9][0], proof);
    console.log({
        emptyTrie: "new Trie({})",
        verify: "emptyTrie.verifyProof(trie.root(), testKey12, proof12)",
        validated: validate?.toString(),
    });
    try {
        await newTrie.verifyProof(trie.root(), fillData[10][0], proof);
    }
    catch (err) {
        console.log(" -- An invalid proof will throw");
        console.log({
            emptyTrie: "new Trie({})",
            verify: "emptyTrie.verifyProof(trie.root(), testKey13, proof12)",
            validated: err.message,
        });
    }
    const nonKey = Buffer.from((0, keccak_1.keccak256)(Buffer.from("Testkey111")));
    const nonProof = await trie.createProof(nonKey);
    console.log(" -- Proof of non-inclusion will return null");
    console.log({
        emptyTrie: "new Trie({})",
        nonProof: "trie.createProof(BOGUS_KEY)",
        verify: "emptyTrie.verifyProof(trie.root(), BOGUS_KEY, nonProof)",
        validated: await newTrie.verifyProof(trie.root(), nonKey, nonProof),
    });
};
const proofExample = async () => {
    for (const t of testData) {
        await test(...t);
    }
    console.log("BATCH_UPDATE multiple keys at once");
    console.log({
        trie_batch: [
            { type: "put", key: "testKey3", value: "testValue3" },
            { type: "put", key: "testKey4", value: "testValue4" },
            { type: "put", key: "...", value: "..." },
            { type: "put", key: "testKey32", value: "testValue32" },
        ],
    });
    const batch = fillData.map(([k, v]) => {
        return {
            type: "put",
            key: k,
            value: v,
        };
    });
    await trie.batch(batch);
    const val21 = await trie.get(fillData[20][0]);
    results.push({
        Trie_get: `await trie.get(key: testKey23)`,
        value_to_String: val21?.toString(),
    });
    console.log('RETRIEVE the value at key "testKeyX"');
    console.log(" -- trie.get(testKeyX)");
    for (const result of results) {
        console.log(result);
    }
    await proof();
};
exports.default = proofExample;
