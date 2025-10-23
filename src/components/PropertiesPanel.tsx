'use client';

import { useState, useEffect } from 'react';
import type { ElementData } from '@/types';

interface PropertiesPanelProps {
  selectedElement: ElementData | null;
  onElementUpdate: (element: ElementData) => void;
}

export function PropertiesPanel({ selectedElement, onElementUpdate }: PropertiesPanelProps) {
  const [formData, setFormData] = useState<Partial<ElementData>>({});

  useEffect(() => {
    if (selectedElement) {
      setFormData(selectedElement);
    } else {
      setFormData({});
    }
  }, [selectedElement]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStyleChange = (styleProperty: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [styleProperty]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (selectedElement && formData) {
      onElementUpdate({
        ...selectedElement,
        ...formData,
      } as ElementData);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('src', result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedElement) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        <p className="text-gray-500">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Element Type</label>
          <p className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {selectedElement.tagName.toUpperCase()}
          </p>
        </div>

        {/* Text Content */}
        {(selectedElement.tagName === 'p' || 
          selectedElement.tagName === 'h1' || 
          selectedElement.tagName === 'h2' || 
          selectedElement.tagName === 'h3' || 
          selectedElement.tagName === 'div') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Double-click the element on the stage to edit inline
            </p>
          </div>
        )}

        {/* Image Properties */}
        {selectedElement.tagName === 'img' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Source
              </label>
              <input
                type="text"
                value={formData.src || ''}
                onChange={(e) => handleInputChange('src', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                placeholder="Enter image URL"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={formData.alt || ''}
                onChange={(e) => handleInputChange('alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </>
        )}

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Left (px)
            </label>
            <input
              type="number"
              value={parseInt(formData.style?.left || '0') || 0}
              onChange={(e) => handleStyleChange('left', `${e.target.value}px`)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Top (px)
            </label>
            <input
              type="number"
              value={parseInt(formData.style?.top || '0') || 0}
              onChange={(e) => handleStyleChange('top', `${e.target.value}px`)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Size */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width
            </label>
            <input
              type="text"
              value={formData.style?.width || 'auto'}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="auto, 100px, 50%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height
            </label>
            <input
              type="text"
              value={formData.style?.height || 'auto'}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="auto, 100px, 50%"
            />
          </div>
        </div>

        {/* Text Styling */}
        {(selectedElement.tagName === 'p' || 
          selectedElement.tagName === 'h1' || 
          selectedElement.tagName === 'h2' || 
          selectedElement.tagName === 'h3' || 
          selectedElement.tagName === 'div') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <input
                type="text"
                value={formData.style?.fontSize || '16px'}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="16px, 1.2em, large"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={formData.style?.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Weight
              </label>
              <select
                value={formData.style?.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </div>
          </>
        )}

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}