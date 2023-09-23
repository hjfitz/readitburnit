import { dec, enc } from "../crypto.mjs"

const TEST_KEY = 'hunter2'.padEnd(32)
const TEST_IV = 'dQw4w9WgXcQ'.padEnd(16)
const SECRET_PHRASE = 'bob has a crush on alice'

describe('crypto', () => {
				it('should decode its encoded phrase', async () => {
								const encrypted = await enc(SECRET_PHRASE, TEST_KEY, TEST_IV)
								const decrypted = await dec(encrypted, TEST_KEY, TEST_IV)
								expect(decrypted).toBe(SECRET_PHRASE)
				})
})
