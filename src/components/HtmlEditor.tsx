'use client';

import { useState, useRef } from 'react';
import { Toolbar } from './Toolbar';
import { Stage } from './Stage';
import { PropertiesPanel } from './PropertiesPanel';
import { ImportDialog } from './ImportDialog';
import type { ElementData } from '@/types';

export function HtmlEditor() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleImport = (content: string) => {
    setHtmlContent(content);
    setSelectedElement(null);
    setShowImportDialog(false);
  };

  const handleElementSelect = (element: ElementData | null) => {
    setSelectedElement(element);
  };

  const handleElementUpdate = (updatedElement: ElementData) => {
    if (stageRef.current && selectedElement) {
      const target = stageRef.current.querySelector(`[data-element-id="${selectedElement.id}"]`) as HTMLElement;
      if (target) {
        // Update element properties
        if (updatedElement.content !== undefined) {
          target.textContent = updatedElement.content;
        }
        if (updatedElement.src && target.tagName === 'IMG') {
          (target as HTMLImageElement).src = updatedElement.src;
        }
        if (updatedElement.alt && target.tagName === 'IMG') {
          (target as HTMLImageElement).alt = updatedElement.alt;
        }
        if (updatedElement.style) {
          Object.assign(target.style, updatedElement.style);
        }
        
        setSelectedElement(updatedElement);
      }
    }
  };

  const handleDeleteElement = () => {
    if (stageRef.current && selectedElement) {
      const target = stageRef.current.querySelector(`[data-element-id="${selectedElement.id}"]`);
      if (target) {
        target.remove();
        setSelectedElement(null);
      }
    }
  };

  const handleAddElement = (type: 'text' | 'image') => {
    if (stageRef.current) {
      const newElement = document.createElement(type === 'text' ? 'p' : 'img');
      const id = `element-${Date.now()}`;
      newElement.setAttribute('data-element-id', id);
      
      if (type === 'text') {
        newElement.textContent = 'New text element';
        newElement.style.position = 'absolute';
        newElement.style.left = '50px';
        newElement.style.top = '50px';
        newElement.style.fontSize = '16px';
        newElement.style.color = '#000';
        newElement.style.cursor = 'pointer';
      } else {
        (newElement as HTMLImageElement).src = 'https://via.placeholder.com/150x150/cccccc/666666?text=New+Image';
        (newElement as HTMLImageElement).alt = 'New image';
        newElement.style.position = 'absolute';
        newElement.style.left = '50px';
        newElement.style.top = '50px';
        newElement.style.width = '150px';
        newElement.style.height = '150px';
        newElement.style.cursor = 'pointer';
      }
      
      // Find next available position
      const elements = stageRef.current.querySelectorAll('[data-element-id]');
      const offset = elements.length * 20;
      newElement.style.left = `${50 + offset}px`;
      newElement.style.top = `${50 + offset}px`;
      
      stageRef.current.appendChild(newElement);
      
      // Auto-select the new element
      const rect = newElement.getBoundingClientRect();
      const stageRect = stageRef.current.getBoundingClientRect();
      const elementData: ElementData = {
        id,
        tagName: newElement.tagName.toLowerCase(),
        content: newElement.textContent || undefined,
        src: type === 'image' ? (newElement as HTMLImageElement).src : undefined,
        alt: type === 'image' ? (newElement as HTMLImageElement).alt : undefined,
        style: {
          position: 'absolute',
          left: newElement.style.left,
          top: newElement.style.top,
          width: newElement.style.width,
          height: newElement.style.height,
          fontSize: newElement.style.fontSize || '16px',
          color: newElement.style.color || '#000000',
          fontWeight: 'normal',
        },
        position: {
          x: parseInt(newElement.style.left),
          y: parseInt(newElement.style.top),
        },
      };
      setSelectedElement(elementData);
    }
  };

  const handleExport = () => {
    if (stageRef.current) {
      // Get all elements and clean up data attributes
      const clonedStage = stageRef.current.cloneNode(true) as HTMLElement;
      const elements = clonedStage.querySelectorAll('[data-element-id]');
      
      elements.forEach(element => {
        element.removeAttribute('data-element-id');
        (element as HTMLElement).style.cursor = '';
      });
      
      const content = clonedStage.innerHTML;
      const timestamp = new Date().toISOString().split('T')[0];
      
      const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta data-generated-by="editable-html-poster" />
    <meta name="generator" content="Editable HTML Poster" />
    <meta name="created-date" content="${timestamp}" />
    <title>HTML Poster - ${timestamp}</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .poster {
            width: 720px;
            height: 720px;
            position: relative;
            background: #f3f4f6;
            overflow: hidden;
            font-family: sans-serif;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="poster">
${content}
    </div>
</body>
</html>`;
      
      const blob = new Blob([htmlDocument], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `html-poster-${timestamp}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <Toolbar
          onImport={() => setShowImportDialog(true)}
          onAddText={() => handleAddElement('text')}
          onAddImage={() => handleAddElement('image')}
          onDelete={handleDeleteElement}
          onExport={handleExport}
          hasSelection={!!selectedElement}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Stage Container */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Stage
            ref={stageRef}
            htmlContent={htmlContent}
            onElementSelect={handleElementSelect}
            selectedElement={selectedElement}
          />
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <PropertiesPanel
            selectedElement={selectedElement}
            onElementUpdate={handleElementUpdate}
          />
        </div>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <ImportDialog
          onImport={handleImport}
          onClose={() => setShowImportDialog(false)}
        />
      )}
    </div>
  );
}