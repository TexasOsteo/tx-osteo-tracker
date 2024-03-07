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
  image: string().required(),
  title: string().required(),
  content: string().required(),
})

/**
 * --- API INFO
 * POST /api/email/newsletter
 * Send an email using Azure
 */
export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)
  await throwErrorIfRateLimited(event)

  const body = await validateBody(event, schema)

  const recipients = await event.context.prisma.user.findMany({
    where: {
      subscribedEmailCategories: {
        has: UserEmailCategories.NEWSLETTER,
      },
    },
  })

  const returnObj = {
    recipients: recipients.length,
  }
  if (recipients.length === 0) return returnObj

  // Generates HTML based on the newsletter template with the information from the request body
  const emailHTML = await renderEmail('newsletter', event, {
    emailCategory: UserEmailCategories.NEWSLETTER,
    ...body,
  })

  await sendEmail({
    // TODO: Change address to use a verified domain, and to not be set manually
    senderAddress:
      'DoNotReply@a47fc2ce-80d8-41bc-bf85-dd31d4ff6b81.azurecomm.net',
    content: {
      subject: `Texas Osteo Newsletter - ${format(new Date(), 'MMM d, y')}`,
      html: emailHTML,
    },
    recipients: {
      bcc: usersToRecipients(recipients),
    },
  })

  await updateUserRateLimit(event)

  return returnObj
})
