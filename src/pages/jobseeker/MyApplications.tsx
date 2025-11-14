import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Application } from "../../types";
import { applicationAPI } from "../../lib/api";
import Navigation from "../../components/Navigation";
import Button from "../../components/Button";
import { formatDate } from "../../lib/utils";

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      accepted: "bg-green-100 text-green-800 border border-green-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const downloadResume = (resume: string, jobTitle: string) => {
    const link = document.createElement("a");
    link.href = resume;
    link.download = `Resume_${jobTitle.replace(/\s+/g, "_")}.pdf`;
    link.click();
  };

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

        {/* Application Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-gray-900">
              {applications.length}
            </div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter((app) => app.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter((app) => app.status === "accepted").length}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-600">
              {applications.filter((app) => app.status === "rejected").length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-lg">Loading applications...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => {
              const job = application.job as any;
              return (
                <div
                  key={application._id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <Link to={`/jobs/${job._id}`}>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                            {job.title}
                          </h3>
                        </Link>
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
                          <strong>Type:</strong>{" "}
                          <span className="capitalize">
                            {job.type.replace("-", " ")}
                          </span>
                        </div>
                        <div>
                          <strong>Applied:</strong>{" "}
                          {formatDate(application.appliedAt)}
                        </div>
                      </div>

                      <div className="mb-4">
                        <strong className="text-gray-700">Cover Letter:</strong>
                        <p className="text-gray-600 mt-1 whitespace-pre-line">
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

                    <div className="ml-6 space-y-3 min-w-[200px]">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          downloadResume(application.resume, job.title)
                        }
                      >
                        Download Resume
                      </Button>

                      {application.status === "accepted" && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                          <p className="text-sm text-green-700 font-medium">
                            🎉 Congratulations!
                          </p>
                          <p className="text-sm text-green-600">
                            Your application has been accepted!
                          </p>
                        </div>
                      )}

                      {application.status === "rejected" && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                          <p className="text-sm text-red-700 font-medium">
                            Application Not Selected
                          </p>
                          <p className="text-sm text-red-600">
                            Keep applying to other opportunities!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
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
                <Link to="/jobs">
                  <Button>Browse Jobs</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
