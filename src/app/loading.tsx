export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-[#E6F2EC] border-t-[#2d5016] rounded-full animate-spin" />
      <p className="mt-4 text-sm font-body text-[#555555]">Loading...</p>
    </div>
  );
}
