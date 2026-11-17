import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const aquí = path.dirname(fileURLToPath(import.meta.url))
const carpeta = process.env.DB_DIR ?? path.join(aquí, '..', 'data')

fs.mkdirSync(carpeta, { recursive: true })

const db = new Database(path.join(carpeta, 'buildtech.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre          TEXT    NOT NULL,
    telefono        TEXT    NOT NULL,
    ciudad          TEXT,
    total           INTEGER NOT NULL,
    cantidad_items  INTEGER NOT NULL,
    mensaje         TEXT    NOT NULL,
    estado          TEXT    NOT NULL DEFAULT 'nueva',
    creada_en       TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`)

export default db