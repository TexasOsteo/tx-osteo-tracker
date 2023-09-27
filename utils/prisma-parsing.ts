export function parseIDsToPrismaConnectObject(ids: string[]) {
  return {
    connect: ids.map((id) => ({ id })),
  }
}
