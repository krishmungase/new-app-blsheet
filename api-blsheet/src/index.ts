import asyncHandler from 'express-async-handler'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'

// your existing imports
// import logger, routes, db, etc...

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
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK')
})

// -------------------- ROUTES --------------------
app.get(
  '/',
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, { msg: 'Hello from server!' }))
  })
)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/ai', aiRoutes)
app.use('/api/v1/secret-key', secretKeyRoutes)
app.use('/api/v1/llm', llmRoutes)

app.use('/api/v1/project', projectRoutes)
app.use('/api/v1/project/task', taskRoutes)
app.use('/api/v1/project/issue', issueRoutes)
app.use('/api/v1/project/member', memberRoutes)
app.use('/api/v1/project/budget', budgetRoutes)
app.use('/api/v1/project/document', documentRoutes)
app.use('/api/v1/project/team', teamRoutes)
app.use('/api/v1/project/chat', chatRoutes)
app.use('/api/v1/project/label', lableRoutes)
app.use('/api/v1/project/timeFrame', objectiveRoutes)
app.use('/api/v1/project/assessment', assessmentRoutes)

// -------------------- SERVER START --------------------
const startServer = async () => {
  const PORT = ENV.PORT || 5555

  try {
    connectDB()
    await agenda.start()

    logger.info({ msg: MSG.DB_CONNECTED })

    // ✅ VERY IMPORTANT FIX
    server.listen(PORT, '0.0.0.0', () => {
      logger.info({
        msg: `Server listening on http://0.0.0.0:${PORT}`,
      })
    })

  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error: error.message })
      process.exit(1)
    }
  }
}

// -------------------- START --------------------
void startServer()

// -------------------- ERROR HANDLER --------------------
//@ts-ignore
app.use(errorHandler)

export default app
