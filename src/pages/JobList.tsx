import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Job } from "../types";
import { jobAPI } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import Button from "../components/Button";
import { formatSalary, formatDate } from "../lib/utils";

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    category: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobs(filters);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const isJobExpired = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600 mt-2">
            Discover the latest job opportunities
          </p>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search jobs, companies..."
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
            />
            <select
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
            <select
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="">All Categories</option>
              <option value="Software Development">Software Development</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Data Science">Data Science</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg">Loading jobs...</div>
            </div>
          ) : (
            jobs.map((job) => {
              const expired = isJobExpired(job.deadline);

              return (
                <div
                  key={job._id}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link to={`/jobs/${job._id}`}>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mt-1">{job.company.name}</p>
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          📍 {job.location}
                        </span>
                        <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                          {job.type.replace("-", " ")}
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatSalary(job.salary)}
                        </span>
                        <span className="text-blue-600">{job.category}</span>
                      </div>
                      <p className="mt-3 text-gray-700 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ml-6 text-right space-y-3">
                      <div className="text-sm text-gray-500">
                        Posted {formatDate(job.createdAt)}
                        {expired && (
                          <div className="text-red-600 font-medium mt-1">
                            Expired
                          </div>
                        )}
                      </div>

                      {user?.role === "jobseeker" ? (
                        <Link to={`/apply/${job._id}`}>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={expired || job.status !== "active"}
                          >
                            {expired
                              ? "Expired"
                              : job.status !== "active"
                              ? "Closed"
                              : "Apply Now"}
                          </Button>
                        </Link>
                      ) : user?.role === "employer" ? (
                        <Button disabled className="bg-gray-400">
                          Apply Now
                        </Button>
                      ) : (
                        <Link to="/login">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Login to Apply
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">
              No jobs found matching your criteria.
            </p>
            <p className="text-gray-400">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
