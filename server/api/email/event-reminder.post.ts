import { format } from 'date-fns'
import { boolean, object, string } from 'yup'
import { UserEmailCategories } from '~/utils/constants'
import { renderEmail, sendEmail, usersToRecipients } from '~/utils/email'
import { validateJWT } from '~/utils/jwt'
import { validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/email/event-reminder
 * Send a reminder email to all users that have events coming up.
 * This endpoint is meant for Azure function use.
 */
export default defineEventHandler(async (event) => {
  const { token: rawToken } = await validateBody(
    event,
    object({ token: string().required() }),
  )

  const token = validateJWT(rawToken, object({ admin: boolean().defined() }))
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid JWT',
    })
  }

  if (!token.admin) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Must have admin permissions',
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
            lte: new Date(Date.now() + 40 * 60 * 60 * 1000),
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
