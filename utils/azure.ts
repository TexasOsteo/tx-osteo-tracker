import { BlobServiceClient } from '@azure/storage-blob'
import { EmailClient } from '@azure/communication-email'

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

/**
 * @returns The Azure email communication client
 */
export function getEmailClient() {
  return new EmailClient(
    useRuntimeConfig().AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING,
  )
}
