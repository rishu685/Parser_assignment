'use client';

import { useState } from 'react';

interface ImportDialogProps {
  onImport: (content: string) => void;
  onClose: () => void;
}

export function ImportDialog({ onImport, onClose }: ImportDialogProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setHtmlContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    if (htmlContent.trim()) {
      onImport(htmlContent);
    }
  };

  const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Sample Poster</title>
    <style>
        body { margin: 0; padding: 0; }
        .poster {
            width: 720px; height: 720px; position: relative;
            background: #f3f4f6; overflow: hidden; font-family: sans-serif;
        }
        .title {
            position: absolute; top: 80px; left: 40px;
            font-size: 48px; font-weight: bold; color: #111827;
        }
        .subtitle {
            position: absolute; top: 160px; left: 40px;
            font-size: 20px; color: #374151;
        }
        .hero {
            position: absolute; bottom: 0; right: 0; width: 380px; height: 380px;
            object-fit: cover; border-top-left-radius: 16px;
        }
    </style>
</head>
<body>
    <div class="poster">
        <h1 class="title">Summer Sale</h1>
        <p class="subtitle">Up to <strong>50% off</strong> on select items!</p>
        <img class="hero" 
             src="https://images.unsplash.com/photo-1520975922284-7bcd4290b0e1?q=80&w=1200&auto=format&fit=crop" 
             alt="Model" />
    </div>
</body>
</html>`;

  const loadSample = () => {
    setHtmlContent(sampleHTML);
    setActiveTab('paste');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Import HTML</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'paste'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Paste HTML
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose HTML file
                </label>
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="text-center">
                <p className="text-gray-500 mb-2">or</p>
                <button
                  onClick={loadSample}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Load Sample HTML
                </button>
              </div>
            </div>
          )}

          {/* Paste Tab */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste HTML content
                </label>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="Paste your HTML content here..."
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                />
              </div>
              <button
                onClick={loadSample}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Load Sample HTML
              </button>
            </div>
          )}

          {/* Preview */}
          {htmlContent && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <div className="bg-gray-50 p-4 rounded max-h-32 overflow-auto">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {htmlContent.substring(0, 500)}
                  {htmlContent.length > 500 && '...'}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!htmlContent.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}