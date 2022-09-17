import { Trie } from "@ethereumjs/trie";
import { keccak256 } from "ethereum-cryptography/keccak";
import proofTest from "./proof";

const trie = new Trie({});

const emptyTrieRoot = trie.root();
// console.log(" -- Start with an empty Trie:  new Trie({})");
// console.log({ emptyTrieRoot: "0x" + emptyTrieRoot.toString("hex") });
// console.log(
//   ' -- Update the trie (using "trie.put()") with the key-value pair "testKeyX": "testValueX"'
// );

const results: any[] = [];

async function test(key: string, val: string) {
  await trie.put(Buffer.from(keccak256(Buffer.from(key))), Buffer.from(val));
  const value = await trie.get(Buffer.from(keccak256(Buffer.from(key))));

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

const testData: [string, string][] = [
  ["testKey1", "testValue1"],
  ["testKey2", "testValue2"],
];

const fillData: [Buffer, Buffer][] = [];
for (let i = 2; i < 32; i++) {
  fillData.push([
    Buffer.from(keccak256(Buffer.from(`testKey${i}`))),
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
proofTest();
export {};
