export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          Zavala Software Portfolio
        </h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300">
          Next.js 14 + TypeScript + Tailwind CSS
        </p>
        <div className="mt-8 flex gap-4 items-center justify-center">
          <div className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            ✅ Next.js Initialized
          </div>
          <div className="px-4 py-2 bg-green-500 text-white rounded-lg">
            ✅ TypeScript Configured
          </div>
          <div className="px-4 py-2 bg-purple-500 text-white rounded-lg">
            ✅ Tailwind Working
          </div>
        </div>
      </div>
    </main>
  )
}
