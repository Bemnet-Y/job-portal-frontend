import React, { useState, useEffect } from 'react'
import type { User, Job, Application } from '../../types'
import { adminAPI } from '../../lib/api'
import Navigation from '../../components/Navigation'
import Button from '../../components/Button'

interface ReportData {
  reportType: string
  period: { startDate?: string; endDate?: string }
  total: number
  data: any[]
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    reportType: 'users',
    startDate: '',
    endDate: '',
    role: '',
  })

  const generateReport = async () => {
    try {
      setLoading(true)
      const params: any = { reportType: filters.reportType }

      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate) params.endDate = filters.endDate
      if (filters.role) params.role = filters.role

      const response = await adminAPI.getReports(params)
      setReportData(response.data)
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!reportData?.data.length) return

    const headers = Object.keys(reportData.data[0]).join(',')
    const rows = reportData.data
      .map((item) =>
        Object.values(item)
          .map((value) =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
          )
          .join(',')
      )
      .join('\n')

    const csvContent = `${headers}\n${rows}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filters.reportType}_report_${
      new Date().toISOString().split('T')[0]
    }.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getReportTitle = () => {
    const typeMap: any = {
      users: 'Users',
      jobs: 'Jobs',
      applications: 'Applications',
    }
    return `${typeMap[filters.reportType]} Report`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Generate detailed reports and analytics
          </p>
        </div>

        {/* Report Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Report Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.reportType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    reportType: e.target.value,
                  }))
                }
              >
                <option value="users">Users</option>
                <option value="jobs">Jobs</option>
                <option value="applications">Applications</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>

            {filters.reportType === 'users' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role
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
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  reportType: 'users',
                  startDate: '',
                  endDate: '',
                  role: '',
                })
              }
            >
              Clear Filters
            </Button>
            <Button onClick={generateReport} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>

        {/* Report Results */}
        {reportData && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{getReportTitle()}</h2>
                <p className="text-gray-600 text-sm">
                  Period: {reportData.period.startDate || 'All time'} to{' '}
                  {reportData.period.endDate || 'Present'}• Total:{' '}
                  {reportData.total} records
                </p>
              </div>
              <Button onClick={exportToCSV}>Export CSV</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {reportData.data.length > 0 &&
                      Object.keys(reportData.data[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.data.slice(0, 50).map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, valueIndex) => (
                        <td
                          key={valueIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {typeof value === 'string' && value.length > 100
                            ? `${value.substring(0, 100)}...`
                            : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reportData.data.length > 50 && (
              <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
                Showing first 50 of {reportData.total} records. Export to CSV to
                see all data.
              </div>
            )}
          </div>
        )}

        {!reportData && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No report generated yet
            </h3>
            <p className="text-gray-500">
              Configure your filters and generate a report to see the data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
