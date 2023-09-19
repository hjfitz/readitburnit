import { build_write_handler } from "./handlers.mjs"
import { get_config } from "./config.mjs"
import { build_client, build_save_item } from "./db.mjs"

const config = get_config()

const client = build_client()
const save_item = build_save_item(client, config.table_name)

export const write_handler = build_write_handler(config, save_item)
