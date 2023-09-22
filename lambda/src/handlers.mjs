import { dec, enc } from "./crypto.mjs"
import { gen_key } from "./db.mjs"

/**
 * @type {import('./types').BuildWriteHandler}
 */
export const build_write_handler = (config, save_item) => async (event) => {
				const payload = event.body

				if (!payload) {
								return {
												statusCode: 400,
												body: 'Missing payload from request',
								}
				}

				const key = gen_key()

				try {
								const encrypted = await enc(payload, config.secret, config.iv)

								const result = await save_item(key, encrypted)

								if (result.success) {
												return {
																statusCode: 201,
																body: key,
												}
								} else {
												return {
																statusCode: 500,
																body: 'Unable to save secret'
												}
								}
				} catch (err) {
								return {
												statusCode: 500,
												body: JSON.stringify({
																message: 'Unable to save to DB',
																reason: err.toString()
												})
								}
				}
}

/**
 * @type {import('./types').BuildReadHandler}
 */
export const build_read_handler = (config, get_item, delete_item) => async (event) => {

				const {id} = event.queryStringParameters

				if (!id) {
								return {
												statusCode: 404,
												body: 'Missing ID',
								}
				}

				try {
								const result = await get_item(id)

								if (!result.success) {
												if (result.err) {
																return {
																				statusCode: 500,
																				body: JSON.stringify({
																								message: 'Unable to read item',
																								reason: result.err,
																				})
																}
												}
												return {
																statusCode: 404,
																body: 'Unable to find item',
												}
								}

								const decoded = await dec(result.data, config.secret, config.iv)

								await delete_item(id)

								return {
												statusCode: 200,
												body: decoded,
								}
				} catch (err) {
								return {
												statusCode: 500,
												body: JSON.stringify({
																message: 'Unable to find secret',
																reason: err.toString(),
												})
								}
				}
}

