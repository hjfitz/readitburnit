/**
 * @param {T} data
 * @return {import('./types').Ok<T>}
 */
export const Ok = (data) => ({
				success: true,
				data,
})

/**
 * @param {T} err
 * @return {import('./types').Err<T>}
 */
export const Err = (err) => ({
				success: false,
				err,
})
