import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import type { Job } from '../../types'
import { jobAPI, applicationAPI } from '../../lib/api'
import Navigation from '../../components/Navigation'
import Button from '../../components/Button'
import Input from '../../components/Input'

interface ApplicationForm {
  coverLetter: string
  resume: FileList
}

const JobApplication: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationForm>()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (jobId) {
      loadJob()
    }
  }, [jobId])

  const loadJob = async () => {
    try {
      const response = await jobAPI.getJob(jobId!)
      setJob(response.data)
    } catch (error) {
      console.error('Failed to load job:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ApplicationForm) => {
    if (!jobId) return

    try {
      setSubmitLoading(true)

      // Convert resume file to base64 (simplified approach)
      const resumeFile = data.resume[0]
      const resumeBase64 = await readFileAsBase64(resumeFile)

      const applicationData = {
        coverLetter: data.coverLetter,
        resume: resumeBase64,
      }

      await applicationAPI.applyForJob(jobId, applicationData)
      navigate('/jobseeker/applications')
    } catch (error: any) {
      console.error('Failed to apply:', error)
      alert(error.response?.data?.message || 'Failed to submit application')
    } finally {
      setSubmitLoading(false)
    }
  }

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Job not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply for Job</h1>
          <p className="text-gray-600 mt-2">
            Submit your application for this position
          </p>
        </div>

        {/* Job Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {job.title}
          </h2>
          <p className="text-gray-600 mb-2">{job.company.name}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Location:</strong> {job.location}
            </div>
            <div>
              <strong>Type:</strong> {job.type}
            </div>
            <div>
              <strong>Category:</strong> {job.category}
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF) *
              </label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register('resume', {
                  required: 'Resume is required',
                  validate: {
                    fileType: (files) => {
                      if (!files || files.length === 0) return true
                      const file = files[0]
                      const allowedTypes = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      ]
                      return (
                        allowedTypes.includes(file.type) ||
                        'Please upload a PDF or Word document'
                      )
                    },
                    fileSize: (files) => {
                      if (!files || files.length === 0) return true
                      const file = files[0]
                      return (
                        file.size <= 5 * 1024 * 1024 ||
                        'File size must be less than 5MB'
                      )
                    },
                  },
                })}
              />
              {errors.resume && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.resume.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                rows={8}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                {...register('coverLetter', {
                  required: 'Cover letter is required',
                  minLength: {
                    value: 50,
                    message: 'Cover letter should be at least 50 characters',
                  },
                })}
                placeholder="Write your cover letter here. Explain why you're a good fit for this position..."
              />
              {errors.coverLetter && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coverLetter.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default JobApplication
