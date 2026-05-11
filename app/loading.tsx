export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Spinner */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="w-20 h-20 border-4 border-zavala-border-subtle rounded-full"></div>
            <div className="w-20 h-20 border-4 border-zavala-accent-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-zavala-text-primary mb-4">Loading...</h2>
        <p className="text-base text-zavala-text-secondary">
          Please wait while we prepare your content
        </p>

        {/* Loading Skeleton (optional decorative element) */}
        <div className="mt-12 space-y-4">
          <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-md mx-auto"></div>
          <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-lg mx-auto"></div>
          <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-sm mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
