import webpack from 'webpack'

/**
 * @type {webpack.Configuration}
 */
const config = {
				target: 'node',
				mode: 'development',
				entry: {
								read:	'./src/read_handler.mjs',
								write: './src/write_handler.mjs'
				},
				output: {
								clean: true,
								library: [
												'read_handler',
												'write_handler',
								],
				},
				plugins: [
								new webpack.IgnorePlugin({
												checkResource(resource) {
																//return resource.startsWith('@aws-sdk')
																return null
												}
								})
				]
}

export default config
