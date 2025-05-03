import { useState, useEffect } from "react";
import { NodeGraph } from "../NodeGraph";
import { sampleData } from "../../data/sampleData";
import { FolderIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from "../ThemeToggle";

function DataVisualize() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleGDriveProcess = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 dark:bg-dark">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 dark:text-gray-50 text-gray-700 text-center">
          ABC Energy Solutions Ltd.
        </h1>
        
        {showNotification && (
          <div className="mb-8">
            <div className={`flex items-center gap-3 dark:bg-gray-800 dark:border-none ${showSuccess ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
              <div className="flex-shrink-0">
                {showSuccess ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500 dark:text-gray-400" />
                ) : (
                  <FolderIcon className="h-6 w-6 text-blue-500 dark:text-gray-200" />
                )}
              </div>
              <div className="flex-grow">
                <p className={`font-medium dark:text-gray-200 ${showSuccess ? 'text-green-700' : 'text-blue-700'}`}>
                  {showSuccess ? 'Successfully processed 226 files' : 'Found 226 new/modified files on Google Drive'}
                </p>
                <p className={`text-sm dark:text-gray-200 ${showSuccess ? 'text-green-600' : 'text-blue-600'}`}>
                  {showSuccess ? 'All documents have been analyzed' : 'New documents are available for processing'}
                </p>
              </div>
              {!showSuccess && (
                <button
                onClick={handleGDriveProcess}
                disabled={isProcessing}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-900 text-blue-600 dark:text-gray-200 text-sm font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Process Files"
                )}
              </button>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-100 text-gray-600">
            Interactive Data Flow Visualization
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            This graph represents the current data consumption and analysis process from various sources. 
            Interact with nodes to explore data relationships and flow patterns.
          </p>
        </div>
        </div>

        <div className="w-[1024px] h-[1024px] bg-gray-90 rounded-xl backdrop-blur-sm p-8 mx-auto">
          <NodeGraph data={sampleData} />
        </div>
    </div>
  );
}

export default DataVisualize;
