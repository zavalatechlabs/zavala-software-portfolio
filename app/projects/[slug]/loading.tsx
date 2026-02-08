export default function ProjectLoading() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="mb-12">
          <div className="h-10 w-32 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
        </div>

        {/* Project Header Skeleton */}
        <div className="mb-16">
          {/* Title */}
          <div className="h-12 bg-zavala-bg-surface rounded-lg animate-pulse mb-6 max-w-2xl"></div>
          
          {/* Metadata (Date, Tags) */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="h-6 w-32 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
            <div className="h-6 w-24 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
            <div className="h-6 w-28 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
            <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-4xl"></div>
            <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-3xl"></div>
          </div>
        </div>

        {/* Featured Image Skeleton */}
        <div className="mb-16">
          <div className="aspect-video bg-zavala-bg-surface rounded-xl animate-pulse border border-zavala-border-subtle"></div>
        </div>

        {/* Tech Stack Section Skeleton */}
        <div className="mb-16">
          <div className="h-8 w-48 bg-zavala-bg-surface rounded-lg animate-pulse mb-6"></div>
          <div className="flex flex-wrap gap-3">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-10 w-24 bg-zavala-bg-surface rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div>
            <div className="h-8 w-64 bg-zavala-bg-surface rounded-lg animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-5xl"></div>
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-4xl"></div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <div className="h-8 w-56 bg-zavala-bg-surface rounded-lg animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-5xl"></div>
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-3xl"></div>
            </div>
          </div>

          {/* Code Block Skeleton */}
          <div className="p-6 bg-zavala-terminal-bg border border-zavala-terminal-border rounded-xl">
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-4 bg-zavala-bg-surface/50 rounded animate-pulse"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <div className="h-8 w-48 bg-zavala-bg-surface rounded-lg animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-4xl"></div>
              <div className="h-4 bg-zavala-bg-surface rounded-lg animate-pulse max-w-5xl"></div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons Skeleton */}
        <div className="mt-16 flex gap-4">
          <div className="h-12 w-40 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
          <div className="h-12 w-36 bg-zavala-bg-surface rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
