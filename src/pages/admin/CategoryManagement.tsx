import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { Category } from '../../types'
import { adminAPI } from '../../lib/api'
import Navigation from '../../components/Navigation'
import Button from '../../components/Button'
import Input from '../../components/Input'

interface CategoryForm {
  name: string
  description: string
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>()

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

  const onSubmit = async (data: CategoryForm) => {
    try {
      await adminAPI.createCategory(data)
      reset()
      setShowForm(false)
      loadCategories() // Reload categories
    } catch (error: any) {
      console.error('Failed to create category:', error)
      alert(error.response?.data?.message || 'Failed to create category')
    }
  }

  const updateCategoryStatus = async (
    categoryId: string,
    status: 'active' | 'inactive'
  ) => {
    try {
      await adminAPI.updateCategory(categoryId, status)
      loadCategories() // Reload categories
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}
      >
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Category Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage job categories for the platform
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Category'}
          </Button>
        </div>

        {/* Add Category Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <Input
                    {...register('name', {
                      required: 'Category name is required',
                    })}
                    placeholder="e.g., Software Development"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Input
                    {...register('description')}
                    placeholder="e.g., Jobs related to software development"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Category</Button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg">Loading categories...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-md">
                          {category.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(category.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {category.status === 'active' ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              updateCategoryStatus(category._id, 'inactive')
                            }
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() =>
                              updateCategoryStatus(category._id, 'active')
                            }
                          >
                            Activate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {categories.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📂</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-500 mb-4">
                Start by creating your first job category
              </p>
              <Button onClick={() => setShowForm(true)}>Create Category</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryManagement
