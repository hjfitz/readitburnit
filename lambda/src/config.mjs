/**
 * @returns {import('./types').Config}
 */
export const get_config = () => {
				return {
								table_name: process.env.TABLE_NAME,
								secret: process.env.CRYPTO_SECRET,
								iv: process.env.CRYPTO_IV,
				}
}
