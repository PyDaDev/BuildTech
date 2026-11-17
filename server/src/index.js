import 'dotenv/config' // debe ir primero para que .env esté cargado antes que db.js
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import quotesRouter from './routes/quotes.js'

const app = express()
const PORT = Number(process.env.PORT) || 3001

const origenes = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.disable('x-powered-by')
app.set('trust proxy', 1) // necesario detrás del proxy de Render, Railway, etc.
app.use(cors({ origin: origenes }))
app.use(express.json({ limit: '50kb' }))

// Máximo 20 cotizaciones cada 15 minutos por IP
const limitador = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.' },
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.post('/api/quotes', limitador)
app.use('/api/quotes', quotesRouter)

app.use((_req, res) => res.status(404).json({ error: 'No encontrado.' }))

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la solicitud no es JSON válido.' })
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'La solicitud es demasiado grande.' })
  }
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor.' })
})

app.listen(PORT, () => {
  console.log(`API de BuildTech escuchando en http://localhost:${PORT}`)
})