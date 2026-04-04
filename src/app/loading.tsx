export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-[#E6F2EC] border-t-[#0B6B3A] rounded-full animate-spin" />
      <p className="mt-4 text-sm font-body text-[#6B7771]">Loading...</p>
    </div>
  );
}
