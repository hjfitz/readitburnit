/**
 * @returns {import('./types').Config}
 */
export const get_config = () => {
				const config = {
								table_name: process.env.TABLE_NAME,
								secret: process.env.CRYPTO_SECRET,
								iv: process.env.CRYPTO_IV,
				}

				validate_config(config)

				return config
}

/**
 * @param {Partial<import('./types').Config>} config
 */
export const validate_config = (config) => {
				const missing = Object.entries(config).map(([key, val]) => {
								if (!val) return key
				}).filter(Boolean)

				if (missing.length) {
								throw new Error(`Missing values from .env: ${missing.join(', ')}`)
				}
}
								

