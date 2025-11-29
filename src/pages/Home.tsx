import { useState } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '@/lib/auth'

export default function Home() {
  const [, setLocation] = useLocation()
  const { user, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'parent' as 'parent' | 'teacher'
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn, signUp } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400">
        <div className="text-xl text-white font-semibold">Loading...</div>
      </div>
    )
  }

  if (user) {
    setLocation('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password)
      } else {
        await signUp(formData.email, formData.password, formData.name, formData.role)
      }
      setLocation('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">My Duc School</h1>
            <p className="text-xl md:text-2xl text-white/95 font-medium">School of Science - Parent & Teacher Portal</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900"
                    placeholder="Enter your password"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      I am a
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'parent' | 'teacher' })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900"
                    >
                      <option value="parent">Parent</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                  }}
                  className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">📚</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Track Progress</h3>
                    <p className="text-gray-600 text-base leading-relaxed">Monitor your child's academic progress, test scores, and achievements in real-time with detailed insights.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">📅</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Attendance</h3>
                    <p className="text-gray-600 text-base leading-relaxed">Stay updated with daily attendance records and receive notifications about your child's presence.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">💬</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Messages</h3>
                    <p className="text-gray-600 text-base leading-relaxed">Communicate directly with teachers, receive important updates, and stay connected with the school.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
