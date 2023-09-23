import { enc } from "./crypto.mjs";

console.log(await enc('some-crypto', 'mock-secret'.padEnd(32), 'mock_iv'.padEnd(16)))
