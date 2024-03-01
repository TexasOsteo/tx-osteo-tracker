import { createHash } from 'node:crypto'
import {
  BlobServiceClient,
  type BlockBlobParallelUploadOptions,
} from '@azure/storage-blob'
import { EmailClient } from '@azure/communication-email'
import type { BlobInfo } from './types'

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

/**
 * Uploads a file (blob) to the Azure storage account
 * @param info
 * @returns
 */
export async function uploadBlob({
  blob,
  container,
  name,
  options = {},
}: {
  blob: Blob
  container: string
  name?: string
  options: BlockBlobParallelUploadOptions
}): Promise<BlobInfo> {
  // Convert Web File object to NodeJS Buffer
  const buffer = Buffer.from(await blob.arrayBuffer())

  if (!name) {
    name = createHash('md5').update(buffer).digest('hex')
  }

  const blobServiceClient = getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient(container)
  const blobBlockClient = containerClient.getBlockBlobClient(name)

  await blobBlockClient.uploadData(buffer, {
    ...options,
    blobHTTPHeaders: {
      blobContentType: blob.type, // Insert content type header
      ...(options.blobHTTPHeaders ?? {}),
    },
  })

  return {
    url: getCDNUrl(`/${container}/${name}`).href,
    name,
    tags: options.tags ?? {},
  }
}

/**
 * Returns a list of all blobs in a container
 * @param container Container name
 * @returns
 */
export async function getAllBlobs(container: string): Promise<BlobInfo[]> {
  const blobServiceClient = getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient(container)

  const blobsInfo: BlobInfo[] = []

  for await (const blob of containerClient.listBlobsFlat({
    includeDeleted: false,
    includeTags: true,
  })) {
    blobsInfo.push({
      name: blob.name,
      tags: blob.tags ?? {},
      url: getCDNUrl(`/${containerClient.containerName}/${blob.name}`).href,
    })
  }

  return blobsInfo
}

/**
 * Gets a single blob from a container by name
 * @param container Container name
 * @param name File name
 * @returns
 */
export async function getBlob(
  container: string,
  name: string,
): Promise<BlobInfo> {
  const blobServiceClient = getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient(container)
  const blobClient = containerClient.getBlobClient(name)

  const { tags } = await blobClient.getTags()

  return {
    name,
    tags,
    url: getCDNUrl(`/${container}/${name}`).href,
  } as BlobInfo
}

/**
 * Deletes a blob from a container
 * @param container Container name
 * @param name File name
 * @returns
 */
export async function deleteBlob(container: string, name: string) {
  const blobServiceClient = getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient(container)
  const blobClient = await containerClient.getBlobClient(name)

  const { tags } = await blobClient.getTags()

  await containerClient.deleteBlob(name)

  return {
    name,
    tags,
    url: getCDNUrl(`/${container}/${name}`).href,
  } as BlobInfo
}

/**
 * Sets the tag for an existing blob
 * @param container
 * @param name
 * @param tags
 * @returns
 */
export async function setBlobTags(
  container: string,
  name: string,
  tags: Record<string, string>,
) {
  const blobServiceClient = getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient(container)
  const blobClient = containerClient.getBlobClient(name)

  await blobClient.setTags(tags)

  return {
    name,
    tags,
    url: getCDNUrl(`/${container}/${name}`).href,
  } as BlobInfo
}
