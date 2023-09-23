import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import jest from 'jest-mock'
import { build_client, build_delete_item, build_get_item, build_save_item, gen_key } from '../db.mjs'

const mock_send = jest.fn() 

const MOCK_ID = 'mock id'
const MOCK_TABLE = 'mock table'

const EXPECTED_PAYLOAD = 'harry potter'
const EXPECTED_ERROR = 'draco malfoy'

const mock_client_factory = () => {
	return {
		send: mock_send,
	}
}

describe('gen_key', () => {
	it('should return a random string', () => {
		expect(gen_key()).not.toBe(gen_key())
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

				mock_client.send.mockResolvedValue({
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

				mock_client.send.mockResolvedValue({})
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



describe('save_item', () => {
	describe('builder', () => {
		it('should build a function', () => {
			expect(build_save_item(mock_client_factory(), MOCK_TABLE)).toBeTruthy()
		})
	})

	describe('functionality', () => {
		describe('when an item is saved', () => {
			/**
												 * @type {import('./types').SaveItem}
												 */
			let save_item 

			let mock_client
			beforeEach(() => {
				mock_client = mock_client_factory()
				mock_client.send.mockResolvedValue({})
				save_item = build_save_item(mock_client, MOCK_TABLE)
			})

			it('should return a result<T> with null', async () => {
				const res = await save_item(MOCK_ID)
				expect(res).toStrictEqual({
					success: true,
					data: null,
				})
			})
		})

		describe('when an item cannot be saved', () => {
			/**
												 * @type {import('./types').SaveItem}
												 */
			let save_item 

			let mock_client
			beforeEach(() => {
				mock_client = mock_client_factory()
				save_item = build_save_item(mock_client, MOCK_TABLE)

				mock_client.send.mockRejectedValue(EXPECTED_ERROR)
			})

			it('should return an result<U> with null', async () => {
				const res = await save_item(MOCK_ID)
				expect(res).toStrictEqual({
					success: false,
					err: EXPECTED_ERROR,
				})
			})
		})
	})
})


describe('delete_item', () => {
	describe('builder', () => {
		it('should build a function', () => {
			expect(build_delete_item(mock_client_factory(), MOCK_TABLE)).toBeTruthy()
		})
	})

	describe('functionality', () => {
		describe('when an item is saved', () => {
			/**
												 * @type {import('./types').SaveItem}
												 */
			let delete_item 

			let mock_client
			beforeEach(() => {
				mock_client = mock_client_factory()
				mock_client.send.mockResolvedValue({})
				delete_item = build_delete_item(mock_client, MOCK_TABLE)
			})

			it('should return a result<T> with null', async () => {
				const res = await delete_item(MOCK_ID)
				expect(res).toStrictEqual({
					success: true,
					data: null,
				})
			})
		})

		describe('when an item cannot be saved', () => {
			/**
												 * @type {import('./types').SaveItem}
												 */
			let delete_item 

			let mock_client
			beforeEach(() => {
				mock_client = mock_client_factory()
				delete_item = build_delete_item(mock_client, MOCK_TABLE)

				mock_client.send.mockRejectedValue(EXPECTED_ERROR)
			})

			it('should return an result<U> with null', async () => {
				const res = await delete_item(MOCK_ID)
				expect(res).toStrictEqual({
					success: false,
					err: EXPECTED_ERROR,
				})
			})
		})
	})
})

describe('build_client', () => {
	it('should build a DynamoDBDocumentClient', () => {
		expect(build_client()).toBeInstanceOf(DynamoDBDocumentClient)
	})
})
