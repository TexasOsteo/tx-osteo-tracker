import { format } from 'date-fns'
import { boolean, object, string } from 'yup'
import { AdminEmailCategories } from '~/utils/constants'
import { renderEmail, sendEmail, usersToRecipients } from '~/utils/email'
import { validateJWT } from '~/utils/jwt'
import { validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/email/new-event
 * Send an digest email to all admins.
 * This endpoint is meant for Azure function use, so it takes the JWT token in the body.
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
      isAdmin: true,
      subscribedEmailCategories: {
        has: AdminEmailCategories.DIGEST,
      },
    },
  })

  const returnObj = {
    recipients: recipients.length,
    events: 0,
  }
  if (recipients.length === 0) return returnObj

  const events = await event.context.prisma.event.findMany({
    where: {
      dateAndTime: {
        gte: new Date(),
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      dateAndTime: 'asc',
    },
    include: {
      signedUpUsers: true,
      positions: true,
    },
  })

  returnObj.events = events.length
  if (!events || events.length === 0) return returnObj

  const eventsInfo = events
    .map((e) => {
      const posInfo = e.positions
        .map(
          (p) =>
            `<li>${p.name}: ${p.currentCapacity} of ${p.maxCapacity} signed up volunteers</li>`,
        )
        .join('')
      return `<h2>${e.name} - ${e.signedUpUsers.length} Volunteers</h2><ul>${posInfo}</ul><br>`
    })
    .join('')
  const content = `<h1>This week has ${events.length} events coming up!</h1><br>${eventsInfo}`

  // Generates HTML based on the new-event template with the information from the request body
  const emailHTML = await renderEmail('digest', event, {
    emailCategory: AdminEmailCategories.DIGEST,
    content,
  })

  await sendEmail({
    content: {
      subject: `Texas Osteo Weekly Digest - ${format(new Date(), 'MMM d, y')}`,
      html: emailHTML,
    },
    recipients: {
      bcc: usersToRecipients(recipients),
    },
  })

  return returnObj
})
