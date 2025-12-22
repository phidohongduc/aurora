import { Link, useParams } from 'react-router-dom'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="flex flex-1 flex-col p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/jobs"
          className="text-blue-400 transition-colors hover:text-blue-300"
        >
          &larr; Back to Jobs
        </Link>
      </div>
      <div className="rounded-lg border border-gray-700 bg-neutral-900 p-6">
        <h1 className="mb-4 text-3xl font-bold">Job Requisition #{id}</h1>
        <div className="mb-6 space-y-4">
          <div>
            <span className="text-sm text-gray-400">Status:</span>
            <span className="ml-2 rounded-full bg-green-600/20 px-3 py-1 text-sm text-green-400">
              Open
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Department:</span>
            <span className="ml-2">Engineering</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Created:</span>
            <span className="ml-2">December 22, 2025</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            to={`/jobs/${id}/upload`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Upload CVs
          </Link>
          <button className="rounded-lg border border-gray-600 px-4 py-2 transition-colors hover:bg-neutral-800">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
