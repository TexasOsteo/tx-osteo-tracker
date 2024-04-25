import type { DefaultEvent } from './types'

export function parseIDsToPrismaConnectObject(ids: string[]) {
  return {
    connect: ids.map((id) => ({ id })),
  }
}

export function parseIDsToPrismaSetObject(ids?: string[]) {
  if (!ids) return undefined
  return {
    set: ids.map((id) => ({ id })),
  }
}

/**
 * This extends the prisma client and hides all event codes if the user is not an admin
 */
export function extendWithHiddenEventCodes(event: DefaultEvent) {
  return event.context.prisma.$extends({
    name: 'tx-osteo-hide-event-codes',
    result: {
      event: {
        code: {
          needs: { code: true },
          compute({ code }) {
            if (event.context.txOsteoClaims?.admin) return code
            return ''
          },
        },
      },
    },
  })
}
