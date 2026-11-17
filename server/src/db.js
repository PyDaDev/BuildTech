import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('Falta la variable DATABASE_URL (cadena de conexión de PostgreSQL).')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
})

// Evita que el servidor se caiga si Neon cierra una conexión inactiva
pool.on('error', (err) => {
  console.error('Error en una conexión inactiva de la base de datos:', err.message)
})

// Crea la tabla si todavía no existe
export async function iniciarDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id              SERIAL PRIMARY KEY,
      nombre          TEXT        NOT NULL,
      telefono        TEXT        NOT NULL,
      ciudad          TEXT,
      total           INTEGER     NOT NULL,
      cantidad_items  INTEGER     NOT NULL,
      mensaje         TEXT        NOT NULL,
      estado          TEXT        NOT NULL DEFAULT 'nueva',
      creada_en       TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
}

export default pool