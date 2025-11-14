import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { Job } from "../../types";
import { jobAPI, applicationAPI } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import Navigation from "../../components/Navigation";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { formatSalary, formatDate } from "../../lib/utils";

interface ApplicationForm {
  coverLetter: string;
  resume: FileList;
}

const JobApplication: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ApplicationForm>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const resumeFile = watch("resume");

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      const response = await jobAPI.getJob(jobId!);
      setJob(response.data);

      // Check if job is expired or closed
      const deadline = new Date(response.data.deadline);
      if (deadline < new Date() || response.data.status !== "active") {
        setError("This job is no longer accepting applications.");
      }
    } catch (error) {
      console.error("Failed to load job:", error);
      setError("Job not found or you do not have permission to view it.");
    } finally {
      setLoading(false);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: ApplicationForm) => {
    if (!jobId || !user) return;

    try {
      setSubmitLoading(true);
      setError("");

      // Validate resume file
      if (!data.resume || data.resume.length === 0) {
        setError("Please upload your resume");
        return;
      }

      const resumeFile = data.resume[0];

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(resumeFile.type)) {
        setError("Please upload a PDF or Word document");
        return;
      }

      // Validate file size (5MB max)
      if (resumeFile.size > 5 * 1024 * 1024) {
        setError("Resume must be smaller than 5MB");
        return;
      }

      const resumeBase64 = await readFileAsBase64(resumeFile);

      const applicationData = {
        coverLetter: data.coverLetter,
        resume: resumeBase64,
      };

      await applicationAPI.applyForJob(jobId, applicationData);

      alert("Application submitted successfully!");
      navigate("/jobseeker/applications");
    } catch (error: any) {
      console.error("Failed to submit application:", error);
      setError(
        error.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
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

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Job not found</div>
        </div>
      </div>
    );
  }

  const isExpired = new Date(job.deadline) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/jobs"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to Jobs
          </Link>
        </div>

        {/* Job Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Apply for {job.title}
          </h1>
          <p className="text-gray-600 mb-4">{job.company.name}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Location:</strong> {job.location}
            </div>
            <div>
              <strong>Type:</strong>{" "}
              <span className="capitalize">{job.type.replace("-", " ")}</span>
            </div>
            <div>
              <strong>Salary:</strong> {formatSalary(job.salary)}
            </div>
            <div>
              <strong>Deadline:</strong> {formatDate(job.deadline)}
            </div>
          </div>

          {isExpired && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              This job is no longer accepting applications.
            </div>
          )}
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Application Form</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Applicant Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Applicant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume *
              </label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register("resume", {
                  required: "Resume is required",
                })}
              />
              {errors.resume && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.resume.message}
                </p>
              )}
              {resumeFile && resumeFile[0] && (
                <p className="text-green-600 text-sm mt-1">
                  ✓ Selected: {resumeFile[0].name}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain why you are a good fit for this position. Include your relevant experience, skills, and why you're interested in this role..."
                {...register("coverLetter", {
                  required: "Cover letter is required",
                  minLength: {
                    value: 50,
                    message: "Cover letter should be at least 50 characters",
                  },
                  maxLength: {
                    value: 2000,
                    message: "Cover letter should not exceed 2000 characters",
                  },
                })}
              />
              {errors.coverLetter && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coverLetter.message}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {watch("coverLetter")?.length || 0}/2000 characters
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitLoading || isExpired || job.status !== "active"}
              >
                {submitLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
