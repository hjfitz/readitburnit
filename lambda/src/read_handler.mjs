import { build_read_handler } from "./handlers.mjs"
import { get_config } from "./config.mjs"
import { build_client, build_delete_item } from "./db.mjs"
import { build_get_item } from "./db.mjs"

const config = get_config()

const client = build_client()
const get_item = build_get_item(client, config.table_name)
const delete_item = build_delete_item(client, config.table_name)

export const read_handler = build_read_handler(config, get_item, delete_item)
