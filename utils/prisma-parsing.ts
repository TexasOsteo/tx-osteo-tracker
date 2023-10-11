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
