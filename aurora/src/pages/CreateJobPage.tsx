import { useNavigate } from 'react-router-dom'

export default function CreateJobPage() {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement job creation logic
    navigate('/jobs')
  }

  return (
    <div className="flex flex-1 flex-col p-8">
      <h1 className="mb-6 text-3xl font-bold">Create New Job Requisition</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full rounded-lg border border-gray-700 bg-neutral-800 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        <div>
          <label htmlFor="department" className="mb-2 block text-sm font-medium">
            Department
          </label>
          <input
            type="text"
            id="department"
            className="w-full rounded-lg border border-gray-700 bg-neutral-800 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Engineering"
          />
        </div>
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Job Description
          </label>
          <textarea
            id="description"
            rows={6}
            className="w-full rounded-lg border border-gray-700 bg-neutral-800 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Describe the role and responsibilities..."
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Create Job
          </button>
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="rounded-lg border border-gray-600 px-6 py-2 transition-colors hover:bg-neutral-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
