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
    logo: new URL('/logo.png', origin).href,
    ...context,
  })
}

type CustomEmailMessage = Omit<EmailMessage, 'senderAddress'>

/**
 * Sends an email using the default email client
 * @param message
 * @returns
 */
export function sendEmail(message: CustomEmailMessage) {
  return new Promise<void>((resolve, reject) => {
    const client = getEmailClient()
    client
      .beginSend({
        senderAddress: useRuntimeConfig().AZURE_EMAIL_ADDRESS,
        ...message,
      })
      .then((poller) => {
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
  const userId = event.context.txOsteoClaims?.sub
  const auth0Id = event.context.auth0Claims?.sub
  if (!userId && !auth0Id) {
    throw createError({
      statusCode: 400,
      message: 'User is not authenticated',
    })
  }

  const user = await event.context.prisma.user.findFirst({
    where: { OR: [{ id: userId }, { auth0Id }] },
  })
  if (!user) {
    throw createError({
      statusCode: 400,
      message: `User does not exist with ID ${userId} or auth0 ID ${auth0Id}`,
    })
  }

  if (user.isAdmin) return
  if (Date.now() - user.lastEmailTriggered.getTime() < 1000 * 60 * 15) {
    throw createError({
      statusCode: 429,
      message: 'Rate limited',
    })
  }
}
