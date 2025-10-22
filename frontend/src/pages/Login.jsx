import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function Login() {
  const { login, isLoading } = useAuth()
  const { register, handleSubmit } = useForm()

  const onSubmit = async (values) => {
    await login(values.email, values.password)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Welcome to GenZFlow</h1>
          <p className="text-secondary-500">Where all tasks, teams, and time flow together</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-secondary-600">Email</label>
          <input type="email" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" {...register('email', { required: true })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-secondary-600">Password</label>
          <input type="password" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" {...register('password', { required: true })} />
        </div>
        <button disabled={isLoading} className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-md py-2 transition">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
        
        <p className="text-center text-sm text-secondary-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  )
}


