import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function DueDiligenceCadastroLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 h-[76px] flex items-center">
        <div className="max-w-6xl w-full mx-auto px-6 flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-[340px] rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </header>

      {/* Breadcrumbs Skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Main content Skeleton */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>

        {/* Estatísticas Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-sm p-4">
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </Card>

          <Card className="border-0 shadow-sm p-4">
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </Card>

          <Card className="border-0 shadow-sm p-4">
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          </Card>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-3">
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
