import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Application, Job } from "../../types";
import { jobAPI } from "../../lib/api";
import Navigation from "../../components/Navigation";
import Button from "../../components/Button";
import { formatDate } from "../../lib/utils";

const JobApplications: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      loadApplications();
      loadJob();
    }
  }, [jobId]);

  const loadApplications = async () => {
    try {
      const response = await jobAPI.getJobApplications(jobId!);
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  };

  const loadJob = async () => {
    try {
      const response = await jobAPI.getJob(jobId!);
      setJob(response.data);
    } catch (error) {
      console.error("Failed to load job:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: string
  ) => {
    try {
      setActionLoading(applicationId);
      await jobAPI.updateApplicationStatus(applicationId, status);
      await loadApplications(); // Reload applications
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert("Failed to update application status");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}
      >
        {status}
      </span>
    );
  };

  const downloadResume = (resume: string, candidateName: string) => {
    const link = document.createElement("a");
    link.href = resume;
    link.download = `${candidateName.replace(/\s+/g, "_")}_resume.pdf`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Job Header */}
        {job && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Applications for {job.title}
            </h1>
            <p className="text-gray-600 mt-2">
              {job.company.name} • {job.location} • {applications.length}{" "}
              applications
            </p>
          </div>
        )}

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500">
                Applications will appear here when candidates apply to your job.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cover Letter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => {
                    const candidate = application.candidate as any;
                    return (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {candidate.email}
                            </div>
                            {candidate.profile?.title && (
                              <div className="text-sm text-gray-500">
                                {candidate.profile.title}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(application.appliedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(application.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {application.coverLetter}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              downloadResume(application.resume, candidate.name)
                            }
                          >
                            Download Resume
                          </Button>

                          {application.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateApplicationStatus(
                                    application._id,
                                    "accepted"
                                  )
                                }
                                disabled={actionLoading === application._id}
                              >
                                {actionLoading === application._id
                                  ? "Accepting..."
                                  : "Accept"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  updateApplicationStatus(
                                    application._id,
                                    "rejected"
                                  )
                                }
                                disabled={actionLoading === application._id}
                              >
                                {actionLoading === application._id
                                  ? "Rejecting..."
                                  : "Reject"}
                              </Button>
                            </>
                          )}

                          {application.status === "accepted" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                updateApplicationStatus(
                                  application._id,
                                  "rejected"
                                )
                              }
                              disabled={actionLoading === application._id}
                            >
                              {actionLoading === application._id
                                ? "Revoking..."
                                : "Revoke"}
                            </Button>
                          )}

                          {application.status === "rejected" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateApplicationStatus(
                                  application._id,
                                  "accepted"
                                )
                              }
                              disabled={actionLoading === application._id}
                            >
                              {actionLoading === application._id
                                ? "Accepting..."
                                : "Accept"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplications;
