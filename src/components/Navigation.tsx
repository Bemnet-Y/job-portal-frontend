import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from './Button'

const Navigation: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              JobPortal
            </Link>
            {user && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/jobs"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/jobs'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Browse Jobs
                </Link>

                {user.role === 'employer' && (
                  <>
                    <Link
                      to="/employer/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/employer/dashboard'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      My Jobs
                    </Link>
                    <Link
                      to="/employer/post-job"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/employer/post-job'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Post Job
                    </Link>
                  </>
                )}

                {user.role === 'jobseeker' && (
                  <Link
                    to="/jobseeker/applications"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/jobseeker/applications'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    My Applications
                  </Link>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname.startsWith('/admin')
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/admin/users'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/categories"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/admin/categories'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Categories
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">
                  {user.name} ({user.role})
                </span>
                <Button variant="outline" onClick={logout} size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
