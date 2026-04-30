import asyncHandler from 'express-async-handler'
import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

// -------------------- MIDDLEWARE --------------------
const corsOption: cors.CorsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOption))
app.options('*', cors(corsOption))
app.use(express.json())
app.use(express.static('public'))

// -------------------- HEALTH CHECK --------------------
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK')
})

// -------------------- ROUTES --------------------
app.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    return res.status(200).json({
      msg: 'Hello from server!',
    })
  })
)

// -------------------- SERVER START --------------------
const PORT = process.env.PORT || 5555

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
