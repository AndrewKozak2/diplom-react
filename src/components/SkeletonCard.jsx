import React from "react";

function SkeletonCard() {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm w-full sm:w-[300px] min-h-[380px] animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
      </div>
      <div className="w-full h-[180px] bg-gray-200 rounded mb-2"></div>
      <div className="space-y-2 mb-2">
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
      </div>
      <div className="h-9 w-full bg-gray-300 rounded-md"></div>
    </div>
  );
}

export default SkeletonCard;
