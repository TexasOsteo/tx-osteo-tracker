import { format } from 'date-fns'
import { object, string } from 'yup'
import { UserEmailCategories } from '~/utils/constants'
import { renderEmail, sendEmail, usersToRecipients } from '~/utils/email'
import { validateJWT } from '~/utils/jwt'

/**
 * --- API INFO
 * POST /api/email/event-reminder
 * Send a reminder email to all users that have events coming up.
 * Authentication requires bearer token.
 * This endpoint is meant for Azure function use.
 */
export default defineEventHandler(async (event) => {
  const authHeader = event.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Bad Authorization Bearer Token Header',
    })
  }

  const rawToken = authHeader.split('Bearer ')[1]
  const token = validateJWT(rawToken, object({ sub: string() }))
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid JWT',
    })
  }

  const recipients = await event.context.prisma.user.findMany({
    where: {
      subscribedEmailCategories: {
        has: UserEmailCategories.EVENT_REMINDER,
      },
      signedUpEvents: {
        some: {
          dateAndTime: {
            gte: new Date(),
            lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  })

  const returnObj = {
    recipients: recipients.length,
  }
  if (recipients.length === 0) return returnObj

  // Generates HTML based on the new-event template with the information from the request body
  const emailHTML = await renderEmail('event-reminder', event, {
    emailCategory: UserEmailCategories.EVENT_REMINDER,
  })

  await sendEmail({
    content: {
      subject: `Texas Osteo Event Reminder - ${format(new Date(), 'MMM d, y')}`,
      html: emailHTML,
    },
    recipients: {
      bcc: usersToRecipients(recipients),
    },
  })

  return returnObj
})
