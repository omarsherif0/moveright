import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileVideo, Loader2, FileSpreadsheet, AlertCircle, Film, Moon, Sun } from 'lucide-react';

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Check system preference for dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check if the file is a video
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file.');
      setVideoFile(null);
      setVideoUrl(null);
      return;
    }
    
    simulateUpload(file);
  };

  // Simulate file upload with progress
  const simulateUpload = (file: File) => {
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setVideoFile(file);
          setVideoUrl(URL.createObjectURL(file));
          setIsProcessed(false);
          setSuccess('Video uploaded successfully!');
          setTimeout(() => setSuccess(null), 3000);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessVideo = () => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate processing with a progress bar
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsProcessed(true);
          setSuccess('Video processed successfully!');
          setTimeout(() => setSuccess(null), 3000);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  const handleExportToExcel = () => {
    // Create a simple Excel-like CSV data
    const csvData = `Video Name,Duration,Size\n${videoFile?.name},00:05:30,${(videoFile?.size / (1024 * 1024)).toFixed(2)} MB`;
    
    // Create a blob and download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video_analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSuccess('Analysis exported to Excel!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);
    setSuccess(null);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file.');
        return;
      }
      
      simulateUpload(file);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100'} flex flex-col items-center justify-center p-4`}>
      {/* Dark mode toggle */}
      <button 
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'} transition-all duration-300`}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      
      {/* Toast notifications */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}
      
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        </div>
      )}
      
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center justify-center p-3 ${isDarkMode ? 'bg-purple-600' : 'bg-indigo-600'} rounded-full mb-4 shadow-lg`}>
            <Film className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600'}`}>Video Processor</h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-lg mx-auto`}>Transform your videos into actionable insights with our powerful processing tool</p>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-100'} rounded-2xl shadow-xl overflow-hidden border transition-colors duration-300`}>
          <div className="p-8">
            <div className="mb-8">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept="video/*" 
                className="hidden" 
              />
              
              {!videoFile ? (
                <div 
                  ref={dropAreaRef}
                  onClick={handleUploadClick}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-3 border-dashed ${isDarkMode ? 
                    (isDragging ? 'border-purple-400 bg-purple-900/30' : 'border-gray-600 bg-gray-700/30') : 
                    (isDragging ? 'border-indigo-400 bg-indigo-100' : 'border-indigo-200 bg-indigo-50')
                  } rounded-xl p-12 text-center cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${
                    isDragging ? 'scale-[1.02] shadow-lg' : ''
                  } ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-indigo-100'}`}
                >
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${isDragging ? 'scale-110' : ''}`}>
                    <Upload className={`h-10 w-10 ${isDarkMode ? 'text-purple-400' : 'text-indigo-500'} ${isDragging ? 'animate-bounce' : ''}`} />
                  </div>
                  <p className={`font-medium text-lg ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
                    {isDragging ? 'Drop your video here' : 'Click to upload or drag & drop'}
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-indigo-400'}`}>MP4, MOV, AVI, etc.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-900'} rounded-xl overflow-hidden shadow-lg`}>
                    {videoUrl && (
                      <video 
                        src={videoUrl} 
                        controls 
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                  
                  <div className={`flex items-center text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'} p-3 rounded-lg`}>
                    <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-indigo-100'} p-2 rounded-md mr-3`}>
                      <FileVideo className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>{videoFile.name}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-indigo-500'}`}>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleUploadClick}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isDarkMode ? 
                        'text-purple-300 bg-gray-700 border border-gray-600 hover:bg-gray-600 focus:ring-purple-500' : 
                        'text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 focus:ring-indigo-500'
                      }`}
                    >
                      Change File
                    </button>
                    
                    {!isProcessed && (
                      <button
                        onClick={handleProcessVideo}
                        disabled={isProcessing}
                        className={`px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center shadow-md transition-all ${
                          isDarkMode ?
                          'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500' :
                          'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500'
                        } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Process Video'
                        )}
                      </button>
                    )}
                    
                    {isProcessed && (
                      <button
                        onClick={handleExportToExcel}
                        className={`px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center shadow-md transition-all ${
                          isDarkMode ?
                          'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:ring-emerald-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:ring-green-500'
                        }`}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export to Excel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress bar */}
            {(uploadProgress > 0 && uploadProgress < 100) && (
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {isProcessing ? 'Processing...' : 'Uploading...'}
                  </span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{uploadProgress}%</span>
                </div>
                <div className={`h-2 w-full rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isProcessing ? 
                      (isDarkMode ? 'bg-purple-500' : 'bg-indigo-600') : 
                      (isDarkMode ? 'bg-blue-500' : 'bg-blue-500')
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {isProcessed && (
              <div className={`${
                isDarkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-800' : 
                'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'
              } border rounded-lg p-5 animate-fadeIn`}>
                <div className="flex items-start">
                  <div className={`${isDarkMode ? 'bg-green-800' : 'bg-green-100'} p-2 rounded-full mr-3`}>
                    <svg className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>Processing Complete!</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-green-700'}`}>Your video has been successfully processed. Click the "Export to Excel" button to download the analysis.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-indigo-500'}`}>
            Supported video formats: MP4, MOV, AVI, WebM, and more
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-indigo-400'}`}>
            © 2025 Video Processor. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;