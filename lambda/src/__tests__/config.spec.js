import { get_config, validate_config } from "../config.mjs"

const EXPECTED_SECRET = 'secret'
const EXPECTED_IV = 'iv'
const EXPECTED_TABLE_NAME = 'table name'

describe('config', () => {
				describe('when there is a complete config', () => {
								beforeEach(() => {
												process.env.CRYPTO_SECRET = EXPECTED_SECRET
												process.env.CRYPTO_IV = EXPECTED_IV
												process.env.TABLE_NAME = EXPECTED_TABLE_NAME

								})
								afterEach(() => {
												delete process.env.CRYPTO_SECRET
												delete process.env.CRYPTO_IV
												delete process.env.TABLE_NAME
								})

								it('should return values from env', () => {
												expect(get_config()).toStrictEqual({
																secret: EXPECTED_SECRET,
																iv: EXPECTED_IV,
																table_name: EXPECTED_TABLE_NAME,
												})
								})
				})

				describe('when there is an incomplete config', () => {
								beforeEach(() => {
												process.env.CRYPTO_SECRET = EXPECTED_SECRET
												process.env.CRYPTO_IV = EXPECTED_IV
								})

								afterEach(() => {
												delete process.env.CRYPTO_SECRET
												delete process.env.CRYPTO_IV
								})

								it('should throw an appropriate error', () => {
												expect(get_config).toThrowError('Missing values from .env: table_name')
								})

				})
})

describe('validate_config', () => {
				it('should not throw if a complete config is passed', () => {
								expect(() => validate_config({
												table_name: 'test',
								})).not.toThrow()
				})
				
				it('should throw is an incomplete config is passed', () => {
								expect(() => validate_config({
												table_name: 'test',
												iv: null,
												secret: '',
								})).toThrowError('Missing values from .env: iv, secret')
				})
})
