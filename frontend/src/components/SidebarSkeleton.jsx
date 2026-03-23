const SidebarSkeleton = () => {
  return (
    <div className="w-full h-full bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="w-24 h-3 bg-gray-200 rounded"></div>
              <div className="w-36 h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarSkeleton;
