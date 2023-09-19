import crypto from 'node:crypto'

/**
 * @param {any} payload
 * @param {string} key
 * @returns {Promise<string>}
 */
export const enc = async (payload, key, iv) => {
				const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
				const encrypted = cipher.update(payload, 'utf8', 'base64')
				return (encrypted + cipher.final('base64'))
}

/**
 * @param {string} payload_enc
 * @param {string} key
 * @returns {Promise<any>}
 */
export const dec = async (payload_enc, key, iv) => {
				const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
				const decrypted = decipher.update(payload_enc, 'base64', 'utf8')
				return (decrypted + decipher.final('utf8'))
}
