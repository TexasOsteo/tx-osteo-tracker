import { EmailClient, type EmailMessage } from '@azure/communication-email'
import type { User } from '@prisma/client'
import { format } from 'date-fns'
import handlebars from 'handlebars'
import type { DefaultEvent } from './types'
import { getRealRequestURL } from '~/utils/server'

type EmailContext = {
  [x: string]: any
  emailCategory: string
}

/**
 * @returns The Azure email communication client
 */
export function getEmailClient() {
  return new EmailClient(
    useRuntimeConfig().AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING,
  )
}

/**
 * Renders an email template as define by a .mjml file in server/assets.
 * Information can be provided via the context object.
 * @param file - Name of the mjml/html file in server/assets
 * @param context
 * @returns
 */
export async function renderEmail(
  file: string,
  origin: string | DefaultEvent,
  context: EmailContext,
): Promise<string> {
  if (!file.endsWith('.html')) file += '.html'
  if (typeof origin !== 'string') origin = getRealRequestURL(origin).origin

  const source = await useStorage('assets:server:mjml:rendered').getItem(file)
  if (source === null) {
    throw new Error(`Could not find email template "${file}"`)
  }

  const template = handlebars.compile(source)
  return template({
    date: format(new Date(), 'EEEE MMM d, y'),
    origin,
    // TODO: Update logo to not be a hotlink
    logo: 'https://static.wixstatic.com/media/8c1f13_bd14a68191934239a53edefd6e80f734~mv2.png/v1/fill/w_357,h_357,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo_whitecircle.png',
    ...context,
  })
}

/**
 * Sends an email using the default email client
 * @param message
 * @returns
 */
export function sendEmail(message: EmailMessage) {
  return new Promise<void>((resolve, reject) => {
    const client = getEmailClient()
    client.beginSend(message).then((poller) => {
      const cancelProgress = poller.onProgress((state) => {
        if (state.error) {
          cancelProgress()
          reject(state.error)
        } else if (state.isStarted) {
          cancelProgress()
          resolve()
        }
      })
      poller.pollUntilDone()
    })
  })
}

/**
 * Converts prisma users to email recipients used by Azure
 * @param users
 * @returns
 */
export function usersToRecipients(users: User[]) {
  return users.map((user) => ({
    address: user.email,
    displayName: user.name,
  }))
}

/**
 * Returns true of the user is rate limited (sent an email in the last 15min)
 * @param event
 * @returns
 */
export async function isUserRateLimited(event: DefaultEvent) {
  const userId = event.context.txOsteoClaims?.sub
  if (!userId) return true

  const user = await event.context.prisma.user.findUnique({
    where: { id: userId },
  })
  if (!user) return true

  if (user.isAdmin) return false

  return Date.now() - user.lastEmailTriggered.getTime() < 1000 * 60 * 15 // 15min
}

/**
 * Update the time a user sent an email
 * @param event
 */
export async function updateUserRateLimit(event: DefaultEvent) {
  const userId = event.context.txOsteoClaims?.sub
  if (!userId) throw createError({ statusCode: 400, message: 'No user found' })

  await event.context.prisma.user.update({
    where: { id: userId },
    data: { lastEmailTriggered: new Date() },
  })
}

export async function throwErrorIfRateLimited(event: DefaultEvent) {
  if (await isUserRateLimited(event)) {
    throw createError({
      statusCode: 429,
      message: 'Rate limited',
    })
  }
}
