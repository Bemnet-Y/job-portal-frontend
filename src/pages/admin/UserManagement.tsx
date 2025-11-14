import React, { useState, useEffect } from "react";
import type { User } from "../../types";
import { adminAPI } from "../../lib/api";
import Navigation from "../../components/Navigation";
import Button from "../../components/Button";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers(filters);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      setActionLoading(userId);
      await adminAPI.updateUserStatus(userId, status);
      await loadUsers(); // Reload users
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const downloadBusinessLicense = (
    businessLicense: string,
    companyName: string
  ) => {
    const link = document.createElement("a");
    link.href = businessLicense;
    link.download = `${companyName.replace(/\s+/g, "_")}_business_license.pdf`;
    link.click();
  };

  // Add the missing getRoleBadge function
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

  // Add the missing getStatusBadge function
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

  const getActionButtons = (user: User) => {
    if (user.role === "admin") {
      return <span className="text-gray-400 text-sm">System Admin</span>;
    }

    return (
      <div className="space-x-2">
        {user.status === "pending" && user.role === "employer" && (
          <>
            <Button
              size="sm"
              onClick={() => updateUserStatus(user._id, "active")}
              disabled={actionLoading === user._id}
            >
              {actionLoading === user._id ? "Approving..." : "Approve"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => updateUserStatus(user._id, "suspended")}
              disabled={actionLoading === user._id}
            >
              Reject
            </Button>
          </>
        )}
        {user.status === "active" && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => updateUserStatus(user._id, "suspended")}
            disabled={actionLoading === user._id}
          >
            {actionLoading === user._id ? "Suspending..." : "Suspend"}
          </Button>
        )}
        {user.status === "suspended" && (
          <Button
            size="sm"
            onClick={() => updateUserStatus(user._id, "active")}
            disabled={actionLoading === user._id}
          >
            {actionLoading === user._id ? "Activating..." : "Activate"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all users on the platform</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-gray-900">
              {users.length}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">
              {
                users.filter(
                  (u) => u.role === "employer" && u.status === "pending"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Pending Employers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === "active").length}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-600">
              {users.filter((u) => u.status === "suspended").length}
            </div>
            <div className="text-sm text-gray-600">Suspended Users</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.role}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    role: e.target.value,
                    page: 1,
                  }))
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
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                    page: 1,
                  }))
                }
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Users per page
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.limit}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    limit: Number(e.target.value),
                    page: 1,
                  }))
                }
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
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
                      Business License
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
                        {user.company?.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.company?.businessLicense ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewUserDetails(user)}
                          >
                            View Details
                          </Button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {getActionButtons(user)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {users.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showDetailsModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  Employer Verification Details
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* User Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    User Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Role:</span>
                      <p className="font-medium">{selectedUser.role}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="font-medium">{selectedUser.status}</p>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                {selectedUser.company && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Company Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Company Name:</span>
                        <p className="font-medium">
                          {selectedUser.company.name}
                        </p>
                      </div>
                      {selectedUser.company.description && (
                        <div>
                          <span className="text-gray-600">Description:</span>
                          <p className="font-medium">
                            {selectedUser.company.description}
                          </p>
                        </div>
                      )}
                      {selectedUser.company.website && (
                        <div>
                          <span className="text-gray-600">Website:</span>
                          <p className="font-medium">
                            {selectedUser.company.website}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Business License */}
                {selectedUser.company?.businessLicense && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Business License
                    </h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Business License Document
                      </p>
                      <Button
                        onClick={() =>
                          downloadBusinessLicense(
                            selectedUser.company!.businessLicense!,
                            selectedUser.company!.name
                          )
                        }
                      >
                        Download Business License
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedUser.status === "pending" && (
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        updateUserStatus(selectedUser._id, "suspended");
                        setShowDetailsModal(false);
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        updateUserStatus(selectedUser._id, "active");
                        setShowDetailsModal(false);
                      }}
                    >
                      Approve & Activate
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
