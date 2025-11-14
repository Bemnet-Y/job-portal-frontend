import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Job } from "../../types";
import { jobAPI } from "../../lib/api";
import Navigation from "../../components/Navigation";
import Button from "../../components/Button";
import { formatSalary, formatDate } from "../../lib/utils";

const EmployerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobAPI.getEmployerJobs();
      setJobs(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (jobsData: Job[]) => {
    const totalJobs = jobsData.length;
    const activeJobs = jobsData.filter((job) => job.status === "active").length;
    const totalApplications = jobsData.reduce(
      (acc, job) => acc + job.applications.length,
      0
    );
    const pendingApplications = jobsData.reduce((acc, job) => {
      // This would need to be calculated from actual application data
      return acc + job.applications.length; // Simplified for now
    }, 0);

    setStats({
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
    });
  };

  const getApplicationsCount = (job: Job) => {
    return job.applications.length;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      active: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}
      >
        {status}
      </span>
    );
  };

  const isJobExpired = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-gray-600 mt-2">
              Manage your job postings and applications
            </p>
          </div>
          <Link to="/employer/post-job">
            <Button>Post New Job</Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalJobs}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeJobs}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingApplications}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-lg">Loading jobs...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex space-x-2">
                        {getStatusBadge(job.status)}
                        {isJobExpired(job.deadline) &&
                          job.status === "active" && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Expired
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
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
                        <strong>Salary:</strong> {formatSalary(job.salary)}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <strong>Deadline:</strong> {formatDate(job.deadline)}
                      {isJobExpired(job.deadline) && (
                        <span className="text-red-600 ml-2">(Passed)</span>
                      )}
                    </div>

                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 text-right space-y-3 min-w-[200px]">
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">
                        {getApplicationsCount(job)} Applications
                      </div>
                      {getApplicationsCount(job) > 0 && (
                        <div className="text-blue-600">View applications</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Link to={`/employer/job/${job._id}/applications`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Applications
                        </Button>
                      </Link>

                      {job.status === "active" &&
                        !isJobExpired(job.deadline) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Edit Job
                          </Button>
                        )}

                      {isJobExpired(job.deadline) &&
                        job.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-gray-100"
                          >
                            Repost Job
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💼</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs posted yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by posting your first job opening to attract candidates
                </p>
                <Link to="/employer/post-job">
                  <Button>Post Your First Job</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
