const MessageSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6 p-4 flex-1 overflow-y-auto">
      {[...Array(8)].map((_, i) => {
        const isOutgoing = i % 3 === 0;
        return (
          <div key={i} className={`flex items-end gap-3 ${isOutgoing ? "justify-end" : ""}`}>
            {!isOutgoing && (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0"></div>
            )}
            <div className={`flex flex-col gap-1 max-w-xs ${isOutgoing ? "items-end" : ""}`}>
              <div className={`rounded-2xl px-4 py-3 animate-pulse ${isOutgoing ? "bg-orange-200 rounded-br-sm" : "bg-gray-200 rounded-bl-sm"}`}>
                <div className={`h-3 bg-gray-300 rounded ${isOutgoing ? "w-40" : "w-52"}`}></div>
                {i % 2 === 0 && <div className={`h-3 bg-gray-300 rounded mt-2 ${isOutgoing ? "w-28" : "w-40"}`}></div>}
              </div>
              <div className="h-2 w-14 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;
