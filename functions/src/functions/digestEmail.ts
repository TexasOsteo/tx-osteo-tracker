import { app, InvocationContext, Timer } from '@azure/functions'
import { postToApi } from '../util'

export async function digestEmail(
  myTimer: Timer,
  context: InvocationContext,
): Promise<void> {
  const data = await postToApi('/api/email/digest', context)
  if (data !== null) {
    context.log(
      `Success! Emailed ${data.recipients} people about ${data.events} events.`,
    )
  }
}

app.timer('digestEmail', {
  schedule: '0 6 * * 1', // Every monday at 6am
  handler: digestEmail,
})
