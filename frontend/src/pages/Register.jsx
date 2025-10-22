import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function Register() {
  const { register: registerUser, isLoading } = useAuth()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (values) => {
    await registerUser(values.name, values.email, values.password, values.role)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Join GenZFlow</h1>
          <p className="text-secondary-500">Where all tasks, teams, and time flow together</p>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm text-secondary-600">Full Name</label>
          <input 
            type="text" 
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" 
            {...register('name', { required: 'Name is required' })} 
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-secondary-600">Email</label>
          <input 
            type="email" 
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" 
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })} 
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-secondary-600">Role</label>
          <select 
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register('role', { required: 'Role is required' })}
          >
            <option value="">Select Role</option>
            <option value="CEO">CEO</option>
            <option value="Director">Director</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Developer">Developer</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-secondary-600">Password</label>
          <input 
            type="password" 
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" 
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })} 
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-secondary-600">Confirm Password</label>
          <input 
            type="password" 
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" 
            {...register('confirmPassword', { 
              required: 'Please confirm password',
              validate: value => value === password || 'Passwords do not match'
            })} 
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
        </div>

        <button 
          disabled={isLoading} 
          className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-md py-2 transition disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-secondary-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
