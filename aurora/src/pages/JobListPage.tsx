import { Link } from 'react-router-dom'

export default function JobListPage() {
  return (
    <div className="flex flex-1 flex-col p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Job Requisitions</h1>
        <Link
          to="/jobs/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Create New
        </Link>
      </div>
      <div className="rounded-lg border border-gray-700 bg-neutral-900 p-6">
        <p className="text-gray-400">No job requisitions yet. Create your first one!</p>
      </div>
    </div>
  )
}
