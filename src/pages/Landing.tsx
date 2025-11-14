import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

const Landing: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                JobPortal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/jobs">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md transition-colors duration-200"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover thousands of job opportunities from top companies around
            the world
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="City or remote"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                  <option>All Types</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Remote</option>
                </select>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors duration-200">
                Search Jobs
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="text-center">
            <p className="text-blue-200 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Designer",
                "Developer",
                "Marketing",
                "Sales",
                "Product Manager",
              ].map((term) => (
                <span
                  key={term}
                  className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors duration-200 cursor-pointer"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "1,234", label: "Live Jobs" },
              { number: "567", label: "Companies" },
              { number: "12,345", label: "Candidates" },
              { number: "89", label: "Locations" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Companies */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Companies
            </h2>
            <p className="text-lg text-gray-600">
              Explore opportunities at top companies hiring now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "TechCorp", positions: "12 open positions" },
              { name: "DataSystems", positions: "6 open positions" },
              { name: "DesignHub", positions: "8 open positions" },
              { name: "CloudWorks", positions: "10 open positions" },
              { name: "InnovateLabs", positions: "15 open positions" },
              { name: "StartupX", positions: "5 open positions" },
            ].map((company, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {company.name}
                  </h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <p className="text-blue-600 font-medium">{company.positions}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Jobs Preview */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">All Jobs</h2>
              <p className="text-gray-600 mt-2">Showing 6 jobs</p>
            </div>
            <Link to="/jobs">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                View All Jobs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Listings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Senior Frontend Developer
                    </h3>
                    <p className="text-gray-700 font-medium">
                      TechCorp Solutions
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">T</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  We're looking for an experienced frontend developer to join
                  our growing team and help build the next generation of our
                  product.
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {["React", "TypeScript", "Tailwind CSS"].map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Job Details */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="mr-1">💷</span>
                    San Francisco, CA
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">🔍</span>
                    Full Time
                  </div>
                  <div className="font-semibold text-gray-900">
                    $120k - $160k
                  </div>
                </div>

                <div className="text-sm text-gray-500">2 days ago</div>
              </div>

              {/* Additional job cards would go here */}
              <div className="text-center py-8">
                <Link to="/jobs">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Load More Jobs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Clear all
                  </button>
                </div>

                {/* Job Type Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {[
                      "Full Time",
                      "Part Time",
                      "Contract",
                      "Internship",
                      "Remote",
                    ].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Experience Level
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Entry Level",
                      "Mid Level",
                      "Senior Level",
                      "Lead/Manager",
                    ].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who found their dream jobs through
              our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register?role=candidate">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 text-lg font-semibold"
                >
                  Create Account
                </Button>
              </Link>
              <Link to="/jobs">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 border-2 border-white text-white hover:bg-blue-700 rounded-md transition-colors duration-200 text-lg font-semibold"
                >
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-4">JobPortal</div>
            <p className="text-gray-400 mb-6">
              Connecting talent with opportunity, one career at a time.
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {social}
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-sm">
              &copy; 2024 JobPortal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
