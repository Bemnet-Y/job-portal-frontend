import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { DashboardStats } from "../../types";
import { adminAPI } from "../../lib/api";
import Navigation from "../../components/Navigation";
import Button from "../../components/Button";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getUsers({ limit: 5 }),
      ]);

      setStats(statsResponse.data);
      setRecentActivities(usersResponse.data.users);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}
      >
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: any = {
      admin: "bg-purple-100 text-purple-800",
      employer: "bg-blue-100 text-blue-800",
      jobseeker: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${roleConfig[role]}`}
      >
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your job portal platform</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">🏢</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalEmployers}
                  </p>
                  {stats.pendingEmployers > 0 && (
                    <p className="text-sm text-orange-600">
                      {stats.pendingEmployers} pending approval
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">💼</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Job Seekers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalJobSeekers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Jobs
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalJobs}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Applications
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalApplications}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Employers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingEmployers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/admin/users">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    View, activate, suspend, and manage all users
                  </p>
                  <Button>Manage Users</Button>
                </div>
              </Link>

              <Link to="/admin/categories">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold mb-2">Job Categories</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Add, edit, and manage job categories
                  </p>
                  <Button>Manage Categories</Button>
                </div>
              </Link>

              <Link to="/admin/reports">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold mb-2">
                    Reports & Analytics
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Generate reports and platform analytics
                  </p>
                  <Button>View Reports</Button>
                </div>
              </Link>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold mb-2">
                  Platform Settings
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Configure platform settings and preferences
                </p>
                <Button variant="outline">Coming Soon</Button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  Recent User Registrations
                </h3>
              </div>
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
                        Registered
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentActivities.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {recentActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No recent user registrations
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/admin/users?status=pending&role=employer">
                  <button className="w-full text-left p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                    <div className="font-medium text-orange-800">
                      Review Pending Employers
                    </div>
                    <div className="text-sm text-orange-600">
                      {stats?.pendingEmployers || 0} waiting approval
                    </div>
                  </button>
                </Link>

                <Link to="/jobs">
                  <button className="w-full text-left p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="font-medium text-blue-800">
                      Browse Active Jobs
                    </div>
                    <div className="text-sm text-blue-600">
                      {stats?.totalJobs || 0} jobs posted
                    </div>
                  </button>
                </Link>

                <Link to="/admin/reports">
                  <button className="w-full text-left p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="font-medium text-purple-800">
                      Generate Reports
                    </div>
                    <div className="text-sm text-purple-600">
                      Platform analytics & insights
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Server</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm text-gray-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
