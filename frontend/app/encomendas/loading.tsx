import { Skeleton } from "@/components/ui/skeleton";

export default function EncomendasLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex items-center space-x-6">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-6 w-96 mb-8" />

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Upload Area */}
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Submit Button */}
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
