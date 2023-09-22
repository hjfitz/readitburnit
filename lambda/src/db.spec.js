import jest from 'jest-mock'
import { build_get_item, gen_key } from "./db.mjs"

const mock_send = jest.fn() 

const MOCK_ID = 'mock id'
const MOCK_TABLE = 'mock table'

const EXPECTED_PAYLOAD = 'harry potter'
const EXPECTED_ERROR = 'draco malfoy'

const mock_client_factory  = () => {
				return {
								send: mock_send,
				}
}

describe('gen_key', () => {
				it('should return a random string', () => {
								// we could chain, but completeness 
								expect(gen_key()).not.toBe(gen_key())
				})
})

describe('get_item', () => {
				describe('builder', () => {
								it('should build a function', () => {
												expect(build_get_item(mock_client_factory(), MOCK_TABLE)).toBeTruthy()
								})
				})
				 
				describe('functionality', () => {
								describe('when an item is found', () => {
												/**
												 * @type {import('./types').GetItem}
												 */
												let get_item

												let mock_client
												beforeEach(() => {
																mock_client = mock_client_factory()
																get_item = build_get_item(mock_client, MOCK_TABLE)

																mock_client.send.mockReturnValue({
																				Item: {
																								payload: EXPECTED_PAYLOAD,
																				}
																})
												})

												it('should return a result<T> with the payload', async () => {
																const res = await get_item(MOCK_ID)
																expect(res).toStrictEqual({
																				success: true,
																				data: EXPECTED_PAYLOAD,
																})
												})
								})

								describe('when an item is not found', () => {
												/**
												 * @type {import('./types').GetItem}
												 */
												let get_item

												let mock_client
												beforeEach(() => {
																mock_client = mock_client_factory()
																get_item = build_get_item(mock_client, MOCK_TABLE)

																mock_client.send.mockReturnValue({})
												})

												it('should return an result<U> with null', async () => {
																const res = await get_item(MOCK_ID)
																expect(res).toStrictEqual({
																				success: false,
																				err: null,
																})
												})

								})

								describe('when the client throws', () => {
												/**
												 * @type {import('./types').GetItem}
												 */
												let get_item

												let mock_client
												beforeEach(() => {
																mock_client = mock_client_factory()
																get_item = build_get_item(mock_client, MOCK_TABLE)

																mock_client.send.mockRejectedValue(EXPECTED_ERROR)
												})

												it('should return an result<U> with null', async () => {
																const res = await get_item(MOCK_ID)
																expect(res).toStrictEqual({
																				success: false,
																				err: EXPECTED_ERROR,
																})
												})
								})
				})
})
