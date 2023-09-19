import { get_config } from "./config.mjs"

const EXPECTED_SECRET = 'secret'
const EXPECTED_IV = 'iv'

describe('config', () => {
				beforeEach(() => {
								process.env.CRYPTO_SECRET = EXPECTED_SECRET
								process.env.CRYPTO_IV = EXPECTED_IV

				})
				afterEach(() => {
								delete process.env.CRYPTO_SECRET
								delete process.env.CRYPTO_IV
				})

				it('should return values from env', () => {
								expect(get_config()).toStrictEqual({
												secret: EXPECTED_SECRET,
												iv: EXPECTED_IV,
								})
				})
})
