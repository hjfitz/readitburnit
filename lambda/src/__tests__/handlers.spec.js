import jest from 'jest-mock'
import { build_read_handler, build_write_handler } from "../handlers.mjs"

const MOCK_ID = 'mock-id'
const MOCK_BODY = 'mock-body'
const MOCK_CONFIG = Object.freeze({
				secret: 'mock-secret'.padEnd(32),
				iv: 'mock-iv'.padEnd(16),
				table_name: 'mock-table_name',
})

const EXPECTED_ERROR = 'expected-error'
const ENC_PAYLOAD = 'i54ZuZZn4/YauL23ZLNnBg=='
const EXPECTED_RESPONSE = 'some_crypto'

describe('write_handler', () => {
				describe('builder', () => {
								it('should return a function', () => {
												expect(build_write_handler(MOCK_CONFIG, jest.fn())).toBeTruthy()
								})
				})

				describe('when the payload is missing', () => {
								let write_handler
								let response
								beforeEach(async () => {
												write_handler = build_write_handler(MOCK_CONFIG, jest.fn())
												response = await write_handler({body: null})
								})

								it('should return a 400', () => {
												expect(response.statusCode).toBe(400)
								})

								it('should return the right error message', () => {
												expect(response.body).toBe('Missing payload from request')
								})
				})

				describe('when the write was a success', () => {
								let write_handler
								let response
								beforeEach(async () => {
												const mock_save_item = jest.fn().mockResolvedValue({
																success: true
												})
												write_handler = build_write_handler(MOCK_CONFIG, mock_save_item)
												response = await write_handler({body: MOCK_BODY})
								})

								it('should return a 201', () => {
												expect(response.statusCode).toBe(201)
								})

								it('should return a secure key', () => {
												expect(typeof response.body).toBe('string')
								})
				})

				describe('when the write was not a success', () => {
								let write_handler
								let response
								beforeEach(async () => {
												const mock_save_item = jest.fn().mockResolvedValue({
																success: false 
												})
												write_handler = build_write_handler(MOCK_CONFIG, mock_save_item)
												response = await write_handler({body: MOCK_BODY})
								})

								it('should return a 201', () => {
												expect(response.statusCode).toBe(500)
								})

								it('should return a secure key', () => {
												expect(response.body).toBe('Unable to save secret')
								})
				})

				describe('on the error layer', () => {
								let write_handler
								let response
								beforeEach(async () => {
												const mock_save_item = jest.fn().mockRejectedValue(EXPECTED_ERROR)
												write_handler = build_write_handler(MOCK_CONFIG, mock_save_item)
												response = await write_handler({body: MOCK_BODY})
								})

								it('should return a 201', () => {
												expect(response.statusCode).toBe(500)
								})

								it('should return a secure key', () => {
												expect(response.body).toBe(JSON.stringify({
																message: 'Unable to save to DB',
																reason: EXPECTED_ERROR,
												}))
								})
				})
})

describe('read_handler', () => {
				describe('builder', () => {
								it('should return a handler', () => {
												expect(build_read_handler(MOCK_CONFIG, jest.fn(), jest.fn())).toBeTruthy()
								})
				})

				describe('when there is a missing query parameter', () => {
								let read_handler
								let response
								beforeEach(async () => {
												read_handler = build_read_handler(MOCK_CONFIG, jest.fn(), jest.fn())
												response = await read_handler({
																queryStringParameters: {}
												})
								})
								
								it('should return a 400', () => {
												expect(response.statusCode).toBe(400)
								})

								it('should return an appropriate error message', () => {
												expect(response.body).toBe('Missing ID')
								})

				})

				describe('when the item cannot be fetched due to an error', () => {
								let read_handler
								let response
								beforeEach(async () => {
												const mock_get_item = jest.fn()
												mock_get_item.mockResolvedValue({
																success: false,
																err: EXPECTED_ERROR,
												})
												read_handler = build_read_handler(MOCK_CONFIG, mock_get_item, jest.fn())
												response = await read_handler({
																queryStringParameters: {
																				id: MOCK_ID,
																}
												})
								})

								it('should return 500', () => {
												expect(response.statusCode).toBe(500)
								})

								it('should return the appropriate error', () => {
												expect(response.body).toBe(JSON.stringify({
																message: 'Unable to read item',
																reason: EXPECTED_ERROR,
												}))
								})
				})

				describe('when the item cannot be found', () => {
								let read_handler
								let response
								beforeEach(async () => {
												const mock_get_item = jest.fn()
												mock_get_item.mockResolvedValue({
																success: false,
																err: null,
												})
												read_handler = build_read_handler(MOCK_CONFIG, mock_get_item, jest.fn())
												response = await read_handler({
																queryStringParameters: {
																				id: MOCK_ID,
																}
												})
								})

								it('should return 404', () => {
												expect(response.statusCode).toBe(404)
								})

								it('should return the appropriate error', () => {
												expect(response.body).toBe('Unable to find item')
								})
				})

				describe('when the item is found and deleted', () => {
								// encrypted using the key and iv in mock_config
								// might be a bit too sticky because of algo

								let read_handler
								let response
								beforeEach(async () => {
												const mock_get_item = jest.fn()
												mock_get_item.mockResolvedValue({
																success: true,
																data: ENC_PAYLOAD
												})
												read_handler = build_read_handler(MOCK_CONFIG, mock_get_item, jest.fn())
												response = await read_handler({
																queryStringParameters: {
																				id: MOCK_ID,
																}
												})
								})

								it('should return a 200', () => {
												expect(response.statusCode).toBe(200)
								})

								it('should return the decrypted payload', () => {
												expect(response.body).toBe(EXPECTED_RESPONSE)
								})
				})

				describe('error layer', () => {

								let read_handler
								let response
								beforeEach(async () => {
												const mock_delete_item = jest.fn()
												const mock_get_item = jest.fn()
												mock_delete_item.mockRejectedValue(EXPECTED_ERROR)
												mock_get_item.mockResolvedValue({success: true, data: ENC_PAYLOAD})
												read_handler = build_read_handler(MOCK_CONFIG, mock_get_item, mock_delete_item)
												response = await read_handler({
																queryStringParameters: {
																				id: MOCK_ID,
																}
												})
								})

								it('should return a 500', () => {
												expect(response.statusCode).toBe(500)
								})

								it('should return an appropriate error', () => {
												expect(response.body).toBe(JSON.stringify({
																message: 'Unable to find secret',
																reason: EXPECTED_ERROR,
												}))
								})
				})
})
