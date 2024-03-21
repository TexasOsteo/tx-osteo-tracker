import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * GET /api/qualifications/[id]
 * Returns a qualification
 * ---
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Admin-only endpoint

  const id = ensureRouteParam(event, 'id')

  const quals = await event.context.prisma.qualifications.findFirst({
    where: { id },
  })
  return quals
})
