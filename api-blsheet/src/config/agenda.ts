import Agenda from 'agenda'

import ENV from './env'
import { NotificationService } from '../services'

const notificationService = new NotificationService()
const agenda = new Agenda({ db: { address: ENV.DB_URL as string } })

agenda.define('sendEmail', async (job: any) => {
  const message = job.attrs.data
  await notificationService.send(message)
})

export default agenda
