import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { Category } from '../../types'
import { jobAPI, adminAPI } from '../../lib/api'
import Navigation from '../../components/Navigation'
import Button from '../../components/Button'
import Input from '../../components/Input'

interface JobForm {
  title: string
  description: string
  requirements: string
  skills: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  category: string
  salaryMin: number
  salaryMax: number
  deadline: string
}

const PostJob: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobForm>()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await adminAPI.getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: JobForm) => {
    try {
      setSubmitLoading(true)

      const jobData = {
        title: data.title,
        description: data.description,
        requirements: data.requirements.split('\n').filter((req) => req.trim()),
        skills: data.skills.split(',').map((skill) => skill.trim()),
        location: data.location,
        type: data.type,
        category: data.category,
        salary: {
          min: Number(data.salaryMin),
          max: Number(data.salaryMax),
          currency: 'USD',
        },
        deadline: data.deadline,
      }

      await jobAPI.createJob(jobData)
      navigate('/employer/dashboard')
    } catch (error: any) {
      console.error('Failed to create job:', error)
      alert(error.response?.data?.message || 'Failed to create job')
    } finally {
      setSubmitLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details to create a new job posting
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <Input
                  {...register('title', { required: 'Job title is required' })}
                  placeholder="e.g., Senior React Developer"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('type', { required: 'Job type is required' })}
                >
                  <option value="">Select Job Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('category', {
                    required: 'Category is required',
                  })}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <Input
                  {...register('location', {
                    required: 'Location is required',
                  })}
                  placeholder="e.g., New York, NY or Remote"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary (USD) *
                </label>
                <Input
                  type="number"
                  {...register('salaryMin', {
                    required: 'Minimum salary is required',
                    min: { value: 0, message: 'Salary must be positive' },
                  })}
                  placeholder="e.g., 50000"
                />
                {errors.salaryMin && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.salaryMin.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary (USD) *
                </label>
                <Input
                  type="number"
                  {...register('salaryMax', {
                    required: 'Maximum salary is required',
                    min: { value: 0, message: 'Salary must be positive' },
                  })}
                  placeholder="e.g., 100000"
                />
                {errors.salaryMax && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.salaryMax.message}
                  </p>
                )}
              </div>

              {/* Deadline */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline *
                </label>
                <Input
                  type="date"
                  {...register('deadline', {
                    required: 'Deadline is required',
                    validate: (value) => {
                      const selectedDate = new Date(value)
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return (
                        selectedDate > today || 'Deadline must be in the future'
                      )
                    },
                  })}
                />
                {errors.deadline && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deadline.message}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills (comma separated) *
                </label>
                <Input
                  {...register('skills', { required: 'Skills are required' })}
                  placeholder="e.g., React, TypeScript, Node.js, MongoDB"
                />
                {errors.skills && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.skills.message}
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements (one per line) *
                </label>
                <textarea
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('requirements', {
                    required: 'Requirements are required',
                  })}
                  placeholder="e.g., 3+ years of React experience&#10;Bachelor's degree in Computer Science&#10;Experience with TypeScript"
                />
                {errors.requirements && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.requirements.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('description', {
                    required: 'Description is required',
                  })}
                  placeholder="Describe the job responsibilities, company culture, and what you're looking for in a candidate..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/employer/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? 'Posting Job...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostJob
