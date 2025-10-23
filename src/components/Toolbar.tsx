'use client';

interface ToolbarProps {
  onImport: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onDelete: () => void;
  onExport: () => void;
  hasSelection: boolean;
}

export function Toolbar({
  onImport,
  onAddText,
  onAddImage,
  onDelete,
  onExport,
  hasSelection,
}: ToolbarProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Toolbar</h2>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Import</h3>
        <button
          onClick={onImport}
          className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Import HTML
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Add Elements</h3>
        <button
          onClick={onAddText}
          className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Add Text
        </button>
        <button
          onClick={onAddImage}
          className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Add Image
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Actions</h3>
        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Delete Selected
        </button>
        <button
          onClick={onExport}
          className="w-full px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Export HTML
        </button>
      </div>
    </div>
  );
}