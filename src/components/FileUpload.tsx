import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string
  maxSize?: number // in MB
  className?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSize = 5,
  className,
}) => {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    onFileSelect(file)
  }

  return (
    <div
      className={cn(
        'relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center',
        dragActive && 'border-blue-400 bg-blue-50',
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={acceptedTypes}
        onChange={handleChange}
      />
      <div className="space-y-2">
        <div className="text-gray-400 text-4xl">📎</div>
        <div>
          <span className="text-blue-600 font-medium">Click to upload</span>
          <span className="text-gray-500"> or drag and drop</span>
        </div>
        <p className="text-sm text-gray-500">Max file size: {maxSize}MB</p>
      </div>
    </div>
  )
}

export default FileUpload
