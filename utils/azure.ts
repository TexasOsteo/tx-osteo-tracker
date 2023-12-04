import { BlobServiceClient } from '@azure/storage-blob'

/**
 * @returns A new blob service client for the default Azure storage account
 */
export function getBlobServiceClient() {
  return BlobServiceClient.fromConnectionString(
    useRuntimeConfig().AZURE_STORAGE_CONNECTION_STRING,
  )
}

/**
 * @param path Optional path
 * @returns The full url for a path to the default Azure CDN
 */
export function getCDNUrl(path = '/') {
  const origin = useRuntimeConfig().AZURE_CDN_ORIGIN
  return new URL(path, origin.startsWith('http') ? origin : `https://${origin}`)
}
