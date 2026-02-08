export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Zavala Software Portfolio
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12">
          Next.js 14 + TypeScript + Tailwind CSS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-semibold text-blue-900">Next.js 14</div>
            <div className="text-sm text-blue-700">App Router</div>
          </div>
          <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-semibold text-green-900">TypeScript</div>
            <div className="text-sm text-green-700">Strict Mode</div>
          </div>
          <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-semibold text-purple-900">Tailwind CSS</div>
            <div className="text-sm text-purple-700">Configured</div>
          </div>
        </div>
      </div>
    </div>
  )
}
