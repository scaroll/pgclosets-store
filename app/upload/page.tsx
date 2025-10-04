"use client"

import Image from "next/image"
import { SecureImageUploader } from "../../components/SecureImageUploader"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface UploadedFile {
  url: string
  filename: string
  size: number
  type: string
}

export default function UploadPage() {
  const [allUploadedFiles, setAllUploadedFiles] = useState<UploadedFile[]>([])

  const handleUploadComplete = (newFiles: UploadedFile[]) => {
    setAllUploadedFiles((prev) => [...prev, ...newFiles])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-pg-sky/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pg-navy/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/admin/products">
            <Button variant="ghost" className="mb-6 hover:bg-pg-navy/5 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-pg-navy to-pg-sky rounded-xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                Upload Product Images
              </h1>
            </div>
          </div>

          <p className="text-lg text-gray-600 max-w-2xl">
            Securely upload high-quality images to Blob storage for use throughout your store
          </p>
        </motion.div>

        <div className="grid gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SecureImageUploader
              onUploadComplete={handleUploadComplete}
              maxFiles={20}
              maxFileSize={10 * 1024 * 1024}
            />
          </motion.div>

          <AnimatePresence>
            {allUploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-green-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">Upload Session Summary</div>
                        <div className="text-sm text-gray-600 font-normal">
                          {allUploadedFiles.length} {allUploadedFiles.length === 1 ? 'file' : 'files'} successfully uploaded
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                      {allUploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="space-y-2 group"
                        >
                          <div className="relative w-full h-28 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-pg-sky transition-all duration-300 shadow-sm group-hover:shadow-lg">
                            <Image
                              src={file.url || "/placeholder.svg"}
                              alt={file.filename}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 50vw, 200px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <p className="text-xs text-gray-600 truncate font-medium" title={file.filename}>
                            {file.filename}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-900">
                            All files uploaded successfully!
                          </p>
                          <p className="text-xs text-green-700">
                            {allUploadedFiles.length} {allUploadedFiles.length === 1 ? 'image is' : 'images are'} now ready to use in your store
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
