import React, { useState, useEffect } from 'react'
import type { Application } from '../../types'
import { applicationAPI } from '../../lib/api'
import Navigation from '../../components/Navigation'
import Button from '../../components/Button'
import { formatDate } from '../../lib/utils'

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications()
      setApplications(response.data)
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const downloadResume = (resume: string, jobTitle: string) => {
    const link = document.createElement('a')
    link.href = resume
    link.download = `Resume_${jobTitle.replace(/\s+/g, '_')}.pdf`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">
            Track your job applications and their status
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-lg">Loading applications...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => {
              const job = application.job as any
              return (
                <div
                  key={application._id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        {getStatusBadge(application.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <strong>Company:</strong> {job.company.name}
                        </div>
                        <div>
                          <strong>Location:</strong> {job.location}
                        </div>
                        <div>
                          <strong>Type:</strong> {job.type}
                        </div>
                        <div>
                          <strong>Applied:</strong>{' '}
                          {formatDate(application.appliedAt)}
                        </div>
                      </div>

                      <div className="mb-4">
                        <strong className="text-gray-700">Cover Letter:</strong>
                        <p className="text-gray-600 mt-1 line-clamp-3">
                          {application.coverLetter}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.skills
                          .slice(0, 5)
                          .map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="ml-6 space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          downloadResume(application.resume, job.title)
                        }
                      >
                        Download Resume
                      </Button>

                      {application.status === 'accepted' && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                          <p className="text-sm text-green-700 font-medium">
                            🎉 Congratulations!
                          </p>
                          <p className="text-sm text-green-600">
                            Your application has been accepted!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {applications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start applying to jobs to see your applications here.
                </p>
                <Button onClick={() => (window.location.href = '/jobs')}>
                  Browse Jobs
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyApplications
