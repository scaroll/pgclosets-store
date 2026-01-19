import { BlobStorageViewer } from "@/components/BlobStorageViewer"

export default function StorageCheckPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Storage Connection Test</h1>
        <p className="text-gray-600">
          Checking connection to Blob storage: jh1a9wkgmuq33bnt.public.blob.vercel-storage.com
        </p>
      </div>

      <BlobStorageViewer />
    </div>
  )
}
