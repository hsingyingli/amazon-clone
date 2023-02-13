import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="animate-spin w-20 h-20 border-gray-400 border-t-4 rounded-full">
      </div>
    </div>
  )
}

export {
  LoadingPage
}
