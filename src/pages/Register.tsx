import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import FileUpload from "../components/FileUpload";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "employer" | "jobseeker";
  companyName?: string;
  companyDescription?: string;
  website?: string;
  businessLicense?: FileList;
}

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(
    null
  );
  const role = watch("role");
  const password = watch("password");

  // Set role from URL parameter
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "jobseeker" || roleParam === "employer") {
      setValue("role", roleParam);
    }
  }, [searchParams, setValue]);

  const handleFileSelect = (file: File) => {
    setBusinessLicenseFile(file);
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setError("");

      const registerData: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      if (data.role === "employer") {
        if (!businessLicenseFile) {
          setError("Business license is required for employers");
          return;
        }

        const businessLicenseBase64 = await readFileAsBase64(
          businessLicenseFile
        );

        registerData.company = {
          name: data.companyName,
          description: data.companyDescription,
          website: data.website,
        };
        registerData.businessLicense = businessLicenseBase64;
      }

      await registerUser(registerData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <Input
                id="name"
                className="mt-1"
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address *
              </label>
              <Input
                id="email"
                type="email"
                className="mt-1"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password *
              </label>
              <Input
                id="password"
                type="password"
                className="mt-1"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password *
              </label>
              <Input
                id="confirmPassword"
                type="password"
                className="mt-1"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              I am a... *
            </label>
            <select
              id="role"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              {...register("role", { required: "Please select a role" })}
            >
              <option value="">Select Role</option>
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {role === "employer" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name *
                  </label>
                  <Input
                    id="companyName"
                    className="mt-1"
                    placeholder="Enter your company name"
                    {...register("companyName", {
                      required: "Company name is required for employers",
                    })}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <Input
                    id="website"
                    type="url"
                    className="mt-1"
                    placeholder="https://example.com"
                    {...register("website")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="companyDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Description
                </label>
                <textarea
                  id="companyDescription"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  placeholder="Brief description of your company"
                  rows={3}
                  {...register("companyDescription")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License *
                </label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  acceptedTypes=".pdf,.jpg,.jpeg,.png"
                  maxSize={10}
                />
                {businessLicenseFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {businessLicenseFile.name} selected
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Upload a copy of your business license (PDF, JPG, PNG, max
                  10MB)
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-700">
                  <strong>Note for Employers:</strong> Your account will be
                  pending approval until we verify your business license. You'll
                  be able to post jobs once your account is activated.
                </p>
              </div>
            </>
          )}

          <Button type="button" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
