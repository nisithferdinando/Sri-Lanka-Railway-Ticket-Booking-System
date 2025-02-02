import React from 'react';
import { LoaderCircle } from 'lucide-react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-none">
      <LoaderCircle className="h-24 w-24 text-blue-500 animate-spin" />
    </div>
  );
};

export default LoadingOverlay;