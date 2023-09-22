import crypto from 'node:crypto'
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { Err, Ok } from "./result.mjs"
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'


/**
 * @return {string}
 */
export const gen_key = () => {
				const rand = crypto.randomUUID()
				return rand.replace('-', '')
}

/**
 * @type {import('./types').BuildGetItem}
 */
export const build_get_item = (client, table_name) => async (id) => {
				const command = new GetCommand({
								TableName: table_name,
								Key: {
												id,
								}
				})

				try {
								const response = await client.send(command)
								if (response.Item) {
												return Ok(response.Item.payload)
								} else {
												return Err(null)
								}
				} catch (err) {
								return Err(err.toString())
				}
}

/**
 * @type {import('./types').BuildSaveItem}
 */
export const build_save_item = (client, table_name) => async (id, enc_payload) => {
				const command = new PutCommand({
								TableName: table_name,
								Item: {
												id,
												payload: enc_payload,
								},
				})

				try {
								await client.send(command)
								return Ok(null)
				} catch (err) {
								return Err(err.toString())
				}
}


/**
 * @type {import('./types').BuildDeleteItem}
 */
export const build_delete_item = (client, table_name) => async (id) => {
				 const command = new DeleteCommand({
								 TableName: table_name,
								 Key: {
												 id,
								 },
				 })

				 try {
								 await client.send(command)
								 return Ok(null)
				 } catch (err) {
								 return Err(err.toString())
				 }
 }

/**
 * @return {DynamoDBDocumentClient}
 */
export const build_client = () => {
				const client = new DynamoDBClient({
								// temporary until we do some env hackery around localstack
								endpoint: 'http://host.docker.internal:4566',
				})
				return DynamoDBDocumentClient.from(client)
}
