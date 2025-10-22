import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-3xl font-bold">404 - Page not found</h1>
      <p className="text-secondary-600">The page you are looking for doesn't exist.</p>
      <p className="text-sm text-secondary-500 mb-4">GenZFlow - Where all tasks, teams, and time flow together</p>
      <Link to="/" className="text-primary-600 hover:underline">Go back home</Link>
    </div>
  )
}


