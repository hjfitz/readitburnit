import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { APIGatewayProxyEvent, Handler } from "aws-lambda"

export interface Config {
				secret: string
				iv: string
				table_name: string
}

export interface Ok<T> {
				success: true
				data: T
}

export interface Err<T> {
				success: false
				err: T
}

export type Result<T, U> = OK<T> | Result<U>



export type GetItem = (i: string) => Promise<Result<any, string | null>>
export type BuildGetItem = (c: DynamoDBDocumentClient, t: string) => GetItem

export type SaveItem = (i: string, e: any) => Promise<Result<null, string>>
export type BuildSaveItem = (c: DynamoDBDocumentClient, t: string) => SaveItem

export type DeleteItem = (i: string) => Promise<Result<null, string>>
export type BuildDeleteItem = (c: DynamoDBDocumentClient, t: string) => DeleteItem


export type LambdaHandler = Handler<APIGatewayProxyEvent> 

export type BuildWriteHandler = (c: Config, s: SaveItem) => LambdaHandler

export type BuildReadHandler = (c: Config, g: GetItem, d: DeleteItem) => LambdaHandler
