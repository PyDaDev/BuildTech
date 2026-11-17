import pg from 'pg'

const url = process.env.DATABASE_URL

if (!url) {
  console.error('Falta la variable DATABASE_URL (cadena de conexión de PostgreSQL).')
  process.exit(1)
}

// Para el diagnóstico mostramos solo el host, nunca la contraseña
let host = ''
try {
  host = new URL(url).hostname
} catch {
  console.error(
    'DATABASE_URL no tiene un formato válido. Debe empezar por postgresql:// ' +
      'y no llevar comillas ni espacios. Si la contraseña tiene caracteres ' +
      'especiales (@ / # : ?), codifícalos o cambia la contraseña.',
  )
  process.exit(1)
}

if (!host.includes('.')) {
  console.error(
    `DATABASE_URL apunta al host "${host}", que no parece una dirección real ` +
      '(debería terminar en neon.tech). Revisa la variable.',
  )
  process.exit(1)
}

console.log(`Conectando a la base de datos en ${host}`)

const pool = new pg.Pool({
  connectionString: url,
  max: 5,
})

// Evita que el servidor se caiga si Neon cierra una conexión inactiva
pool.on('error', (err) => {
  console.error('Error en una conexión inactiva de la base de datos:', err.message)
})

// Crea la tabla si no existe y agrega las columnas de entrega, pago y consentimiento
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

  // Las cotizaciones antiguas quedan con estos campos vacíos
  await pool.query(`
    ALTER TABLE quotes
      ADD COLUMN IF NOT EXISTS direccion             TEXT,
      ADD COLUMN IF NOT EXISTS departamento          TEXT,
      ADD COLUMN IF NOT EXISTS descripcion_domicilio TEXT,
      ADD COLUMN IF NOT EXISTS metodo_pago           TEXT,
      ADD COLUMN IF NOT EXISTS consentimiento_en     TIMESTAMPTZ
  `)
}

export default pool