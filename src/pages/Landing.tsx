import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'

const Landing: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                JobPortal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/jobs">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm text-white/80">
              Trusted by 10,000+ professionals
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Dream Career
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with innovative companies and discover opportunities that
            align with your passion. Join our community of professionals shaping
            the future of work.
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
              <Link to="/register?role=candidate" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 text-lg font-semibold shadow-2xl"
                >
                  🚀 Find Your Dream Job
                </Button>
              </Link>
              <Link to="/register?role=employer" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-12 py-4 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 text-lg font-semibold"
                >
                  💼 Hire Talent
                </Button>
              </Link>
            </div>
          )}

          {/* Stats with Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { number: '500+', label: 'Premium Jobs', emoji: '💎' },
              { number: '1,200+', label: 'Active Seekers', emoji: '👥' },
              { number: '150+', label: 'Top Companies', emoji: '🏢' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:bg-white/15"
              >
                <div className="text-4xl mb-2">{stat.emoji}</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gradient-to-b from-slate-900 to-purple-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Professionals
              <span className="block bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Choose Us
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the next generation of job searching with AI-powered
              matching and personalized career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                emoji: '🤖',
                title: 'AI Matching',
                description:
                  'Our intelligent algorithm matches you with perfect opportunities based on your skills and preferences.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                emoji: '⚡',
                title: 'Instant Apply',
                description:
                  'One-click applications with smart profiles. Apply to multiple jobs in seconds, not hours.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                emoji: '📈',
                title: 'Career Growth',
                description:
                  'Get personalized career recommendations and skill development paths from industry experts.',
                gradient: 'from-green-400 to-blue-500',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transform hover:scale-105 transition-all duration-500 hover:border-white/20"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-2xl">{feature.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300">
              Hear from professionals who transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Product Manager',
                company: 'TechCorp',
                text: 'Landed my dream job in 2 weeks!',
                avatar: '👩‍💼',
              },
              {
                name: 'Marcus Johnson',
                role: 'Senior Developer',
                company: 'StartupXYZ',
                text: 'The AI matching found opportunities I never would have discovered.',
                avatar: '👨‍💻',
              },
              {
                name: 'Elena Rodriguez',
                role: 'UX Designer',
                company: 'DesignCo',
                text: 'From application to offer in just 5 days!',
                avatar: '👩‍🎨',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-300">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
                <p className="text-gray-200 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who accelerated their career
              growth with our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-12 py-4 bg-white text-cyan-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 text-lg font-bold shadow-2xl"
                >
                  Start Free Today
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-12 py-4 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 text-lg font-semibold"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-cyan-100 mt-6 text-sm">
              No credit card required • Free forever plan
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative bg-gray-900/80 backdrop-blur-md border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              JobPortal
            </div>
            <p className="text-gray-400 mb-6">
              Connecting talent with opportunity, one career at a time.
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
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
              &copy; 2024 JobPortal. All rights reserved. Made with ❤️ for job
              seekers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
