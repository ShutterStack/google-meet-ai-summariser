// src/content/components/ProcessingIndicator.js
import React from 'react';

const ProcessingIndicator = () => {
  return (
    <div className="flex items-center justify-center p-2 bg-blue-50">
      <div className="flex items-center space-x-2">
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" 
               style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" 
               style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" 
               style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-sm text-blue-600 font-medium">
          Processing meeting content...
        </span>
      </div>
    </div>
  );
};

export default ProcessingIndicator;