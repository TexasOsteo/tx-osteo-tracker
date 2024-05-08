import { string, object } from 'yup'
import { format } from 'date-fns'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { UserEmailCategories } from '~/utils/constants'
import {
  renderEmail,
  sendEmail,
  updateUserRateLimit,
  usersToRecipients,
} from '~/utils/email'
import { validateBody } from '~/utils/validation'

const schema = object({
  id: string().required(),
})

/**
 * --- API INFO
 * POST /api/email/new-event
 * Send an email using Azure
 */
export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const { id } = await validateBody(event, schema)

  const recipients = await event.context.prisma.user.findMany({
    where: {
      subscribedEmailCategories: {
        has: UserEmailCategories.NEW_EVENT,
      },
    },
  })

  const returnObj = {
    recipients: recipients.length,
  }
  if (recipients.length === 0) return returnObj

  const eventInfo = await event.context.prisma.event.findFirst({
    where: { id },
  })
  if (!eventInfo) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Event not found',
    })
  }

  // Generates HTML based on the new-event template with the information from the request body
  const emailHTML = await renderEmail('new-event', event, {
    emailCategory: UserEmailCategories.NEW_EVENT,
    ...eventInfo,
  })

  await sendEmail({
    content: {
      subject: `Texas Osteo Event Listing - ${format(new Date(), 'MMM d, y')}`,
      html: emailHTML,
    },
    recipients: {
      bcc: usersToRecipients(recipients),
    },
  })

  return returnObj
})
