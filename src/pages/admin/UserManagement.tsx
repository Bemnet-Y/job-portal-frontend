import React, { useState, useEffect } from 'react'
import type { User } from '../../types'
import { adminAPI } from '../../lib/api'
import Navigation from '../../components/Navigation'
import Button from '../../components/Button'

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    loadUsers()
  }, [filters])

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers(filters)
      setUsers(response.data.users)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      await adminAPI.updateUserStatus(userId, status)
      loadUsers() // Reload users
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}
      >
        {status}
      </span>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleConfig: any = {
      admin: 'bg-purple-100 text-purple-800',
      employer: 'bg-blue-100 text-blue-800',
      jobseeker: 'bg-green-100 text-green-800',
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${roleConfig[role]}`}
      >
        {role}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all users on the platform</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.role}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="employer">Employer</option>
                <option value="jobseeker">Job Seeker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={loadUsers} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg">Loading users...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.company?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {user.status === 'pending' &&
                          user.role === 'employer' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateUserStatus(user._id, 'active')
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  updateUserStatus(user._id, 'suspended')
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        {user.status === 'active' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              updateUserStatus(user._id, 'suspended')
                            }
                          >
                            Suspend
                          </Button>
                        )}
                        {user.status === 'suspended' && (
                          <Button
                            size="sm"
                            onClick={() => updateUserStatus(user._id, 'active')}
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
        </div>
      </div>
    </div>
  )
}

export default UserManagement
