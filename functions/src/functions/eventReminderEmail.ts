import { app, InvocationContext, Timer } from '@azure/functions'
import { postToApi } from '../util'

export async function eventReminderEmail(
  myTimer: Timer,
  context: InvocationContext,
): Promise<void> {
  const data = await postToApi('/api/email/event-reminder', context)
  if (data !== null) {
    context.log(
      `Success! Emailed ${data.recipients} people about upcoming events.`,
    )
  }
}

app.timer('eventReminderEmail', {
  schedule: '0 6 * * *', // Every day at 6am
  handler: eventReminderEmail,
})
