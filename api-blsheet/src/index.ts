import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import { agenda, ENV } from './config'
import { connectDB } from './db'
import { MSG } from './constants'
import { errorHandler } from './middlewares'
import { logger, morganMiddleware } from './logger'
import { ApiResponse, asyncHandler } from './utils'
import {
  authRoutes,
  budgetRoutes,
  issueRoutes,
  memberRoutes,
  projectRoutes,
  taskRoutes,
  aiRoutes,
  teamRoutes,
  documentRoutes,
  chatRoutes,
  lableRoutes,
  objectiveRoutes,
  assessmentRoutes,
  secretKeyRoutes,
  llmRoutes,
} from './routes'

const app = express()
const server = createServer(app)

app.use(morganMiddleware)

export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
})

io.on('connection', (socket) => {
  logger.info({ msg: 'USER CONNECTED', socketId: socket.id })

  socket.on('join_channel', (data: { channelId: string }) => {
    logger.info({ msg: 'User joined channel', channelId: data.channelId })
    socket.join(data.channelId)
    socket.emit('join_channel', { roomId: data.channelId })
  })

  socket.on('disconnect', () => {
    logger.info({ msg: 'User disconnected', socketId: socket.id })
  })
})

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

// ✅ ADD THIS (VERY IMPORTANT)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK')
})

const startServer = async () => {
  // ✅ FIX PORT (VERY IMPORTANT)
  const PORT = ENV.PORT || 5555

  try {
    connectDB()
    await agenda.start()
    logger.info({ msg: MSG.DB_CONNECTED })

    server.listen(PORT, () =>
      logger.info({ msg: `Server listening on http://localhost:${PORT}` })
    )
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error: error.message })
      process.exit(1)
    }
  }
}

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

void startServer()
//@ts-ignore
app.use(errorHandler)

export default app
