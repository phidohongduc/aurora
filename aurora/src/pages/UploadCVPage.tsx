import { Link, useParams } from 'react-router-dom'

export default function UploadCVPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="flex flex-1 flex-col p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to={`/jobs/${id}`}
          className="text-blue-400 transition-colors hover:text-blue-300"
        >
          &larr; Back to Job #{id}
        </Link>
      </div>
      <h1 className="mb-6 text-3xl font-bold">Upload CVs</h1>
      <div className="max-w-2xl">
        <div className="mb-6 rounded-lg border-2 border-dashed border-gray-600 bg-neutral-900 p-12 text-center">
          <div className="mb-4 text-4xl">📄</div>
          <p className="mb-2 text-lg">Drag and drop CV files here</p>
          <p className="mb-4 text-sm text-gray-400">or</p>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700">
            Browse Files
          </button>
          <p className="mt-4 text-sm text-gray-400">
            Supported formats: PDF, DOC, DOCX
          </p>
        </div>
        <div className="rounded-lg border border-gray-700 bg-neutral-900 p-4">
          <h2 className="mb-4 text-lg font-semibold">Uploaded CVs</h2>
          <p className="text-gray-400">No CVs uploaded yet.</p>
        </div>
      </div>
    </div>
  )
}
