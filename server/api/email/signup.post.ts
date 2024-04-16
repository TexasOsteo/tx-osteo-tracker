import { string, object } from 'yup'
import { format } from 'date-fns'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { UserEmailCategories } from '~/utils/constants'
import {
  renderEmail,
  sendEmail,
  throwErrorIfRateLimited,
  updateUserRateLimit,
  usersToRecipients,
} from '~/utils/email'
import { validateBody } from '~/utils/validation'

const schema = object({
  eventId: string().required(),
  userId: string().required(),
})

/**
 * --- API INFO
 * POST /api/email/signup
 * Send an email using Azure
 */
export default defineEventHandler(async (event) => {
  const { eventId, userId } = await validateBody(event, schema)

  if (event.context.txOsteoClaims?.sub === userId) {
    await throwErrorIfRateLimited(event)
  } else {
    throwErrorIfNotAdmin(event)
  }

  const recipient = await event.context.prisma.user.findUnique({
    where: {
      id: userId,
      subscribedEmailCategories: {
        has: UserEmailCategories.EVENT_SIGNUP,
      },
    },
  })

  if (!recipient) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'User does not exist, or is not subscribed to this category',
    })
  }

  const eventInfo = await event.context.prisma.event.findFirst({
    where: { id: eventId },
  })
  if (!eventInfo) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Event not found',
    })
  }

  // Generates HTML based on the event_signup template with the information from the request body
  const emailHTML = await renderEmail('sign-up', event, {
    emailCategory: UserEmailCategories.EVENT_SIGNUP,
    ...eventInfo,
  })

  await sendEmail({
    // TODO: Change address to use a verified domain, and to not be set manually
    senderAddress:
      'DoNotReply@a47fc2ce-80d8-41bc-bf85-dd31d4ff6b81.azurecomm.net',
    content: {
      subject: `Texas Osteo Sign Up Confirmation - ${format(
        new Date(),
        'MMM d, y',
      )}`,
      html: emailHTML,
    },
    recipients: {
      bcc: usersToRecipients([recipient]),
    },
  })

  await updateUserRateLimit(event)

  return recipient
})
