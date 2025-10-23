'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import DOMPurify from 'dompurify';
import type { ElementData } from '@/types';

interface StageProps {
  htmlContent: string;
  onElementSelect: (element: ElementData | null) => void;
  selectedElement: ElementData | null;
}

export const Stage = forwardRef<HTMLDivElement, StageProps>(
  ({ htmlContent, onElementSelect, selectedElement }, ref) => {
    const stageRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => stageRef.current!);

    useEffect(() => {
      if (stageRef.current && htmlContent) {
        // Sanitize and inject HTML
        const sanitizedHTML = DOMPurify.sanitize(htmlContent);
        
        // Extract body content if it's a full HTML document
        const parser = new DOMParser();
        const doc = parser.parseFromString(sanitizedHTML, 'text/html');
        const bodyContent = doc.body.innerHTML || sanitizedHTML;
        
        stageRef.current.innerHTML = bodyContent;
        
        // Add data attributes to all elements for selection and dragging
        const elements = stageRef.current.querySelectorAll('*');
        elements.forEach((element, index) => {
          if (element !== stageRef.current && element.tagName !== 'SCRIPT') {
            const elementId = `element-${Date.now()}-${index}`;
            element.setAttribute('data-element-id', elementId);
            (element as HTMLElement).style.cursor = 'pointer';
            
            // Ensure position is absolute for dragging
            const computedStyle = window.getComputedStyle(element as HTMLElement);
            if (computedStyle.position !== 'absolute' && computedStyle.position !== 'relative') {
              (element as HTMLElement).style.position = 'absolute';
            }
          }
        });
      }
    }, [htmlContent]);

    const handleElementClick = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      
      const target = event.target as HTMLElement;
      
      if (target === stageRef.current) {
        onElementSelect(null);
        return;
      }

      const elementId = target.getAttribute('data-element-id');
      if (elementId) {
        const rect = target.getBoundingClientRect();
        const stageRect = stageRef.current!.getBoundingClientRect();
        
        const elementData: ElementData = {
          id: elementId,
          tagName: target.tagName.toLowerCase(),
          content: target.textContent || undefined,
          src: target.tagName === 'IMG' ? (target as HTMLImageElement).src : undefined,
          alt: target.tagName === 'IMG' ? (target as HTMLImageElement).alt : undefined,
          style: {
            position: target.style.position || 'absolute',
            left: target.style.left || `${rect.left - stageRect.left}px`,
            top: target.style.top || `${rect.top - stageRect.top}px`,
            width: target.style.width || `${rect.width}px`,
            height: target.style.height || `${rect.height}px`,
            fontSize: target.style.fontSize || window.getComputedStyle(target).fontSize,
            color: target.style.color || window.getComputedStyle(target).color,
            fontWeight: target.style.fontWeight || window.getComputedStyle(target).fontWeight,
          },
          position: {
            x: parseInt(target.style.left) || rect.left - stageRect.left,
            y: parseInt(target.style.top) || rect.top - stageRect.top,
          },
        };
        onElementSelect(elementData);
      }
    };

    // Add drag and double-click event listeners to elements
    useEffect(() => {
      if (stageRef.current) {
        const elements = stageRef.current.querySelectorAll('[data-element-id]');
        
        elements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          let isDragging = false;
          let startX = 0;
          let startY = 0;
          let initialLeft = 0;
          let initialTop = 0;
          let clickCount = 0;

          const handleMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return; // Only left click
            
            clickCount++;
            setTimeout(() => {
              if (clickCount === 1) {
                // Single click - start drag
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = parseInt(htmlElement.style.left) || 0;
                initialTop = parseInt(htmlElement.style.top) || 0;
                
                htmlElement.style.zIndex = '1000';
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              } else if (clickCount === 2) {
                // Double click - start editing
                handleDoubleClick();
              }
              clickCount = 0;
            }, 250);
            
            e.preventDefault();
            e.stopPropagation();
          };

          const handleDoubleClick = () => {
            // Enable inline editing for text elements
            if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span'].includes(htmlElement.tagName.toLowerCase())) {
              const originalText = htmlElement.textContent || '';
              htmlElement.contentEditable = 'true';
              htmlElement.focus();
              
              // Select all text
              const range = document.createRange();
              range.selectNodeContents(htmlElement);
              const selection = window.getSelection();
              selection?.removeAllRanges();
              selection?.addRange(range);
              
              const finishEditing = () => {
                htmlElement.contentEditable = 'false';
                htmlElement.removeEventListener('blur', finishEditing);
                htmlElement.removeEventListener('keydown', handleKeyDown);
                
                // Update the selected element if this is it
                const elementId = htmlElement.getAttribute('data-element-id');
                if (selectedElement && selectedElement.id === elementId) {
                  onElementSelect({
                    ...selectedElement,
                    content: htmlElement.textContent || '',
                  });
                }
              };
              
              const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  finishEditing();
                } else if (e.key === 'Escape') {
                  htmlElement.textContent = originalText;
                  finishEditing();
                }
              };
              
              htmlElement.addEventListener('blur', finishEditing);
              htmlElement.addEventListener('keydown', handleKeyDown);
            }
          };

          const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const newLeft = Math.max(0, Math.min(720 - htmlElement.offsetWidth, initialLeft + deltaX));
            const newTop = Math.max(0, Math.min(720 - htmlElement.offsetHeight, initialTop + deltaY));
            
            htmlElement.style.left = `${newLeft}px`;
            htmlElement.style.top = `${newTop}px`;
            htmlElement.style.position = 'absolute';
            
            // Update selected element if this is the selected one
            const elementId = htmlElement.getAttribute('data-element-id');
            if (selectedElement && selectedElement.id === elementId) {
              onElementSelect({
                ...selectedElement,
                position: { x: newLeft, y: newTop },
                style: {
                  ...selectedElement.style,
                  left: `${newLeft}px`,
                  top: `${newTop}px`,
                },
              });
            }
          };

          const handleMouseUp = () => {
            isDragging = false;
            htmlElement.style.zIndex = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          htmlElement.addEventListener('mousedown', handleMouseDown);
          
          // Cleanup function
          return () => {
            htmlElement.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
        });
      }
    }, [htmlContent, selectedElement, onElementSelect]);

    // Handle keyboard events for deletion
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Delete' && selectedElement) {
          if (stageRef.current) {
            const target = stageRef.current.querySelector(`[data-element-id="${selectedElement.id}"]`);
            if (target) {
              target.remove();
              onElementSelect(null);
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedElement, onElementSelect]);

    return (
      <div className="relative">
        <div
          ref={stageRef}
          className="relative bg-gray-50 border-2 border-gray-300 overflow-hidden"
          style={{ width: '720px', height: '720px' }}
          onClick={handleElementClick}
        >
          {/* Stage content will be injected here */}
        </div>
        
        {/* Selection overlay */}
        {selectedElement && stageRef.current && (
          <SelectionOverlay
            selectedElement={selectedElement}
            stageRef={stageRef}
          />
        )}
      </div>
    );
  }
);

Stage.displayName = 'Stage';

interface SelectionOverlayProps {
  selectedElement: ElementData;
  stageRef: React.RefObject<HTMLDivElement | null>;
}

function SelectionOverlay({ selectedElement, stageRef }: SelectionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stageRef.current && overlayRef.current) {
      const target = stageRef.current.querySelector(`[data-element-id="${selectedElement.id}"]`) as HTMLElement;
      if (target) {
        const rect = target.getBoundingClientRect();
        const stageRect = stageRef.current.getBoundingClientRect();
        
        overlayRef.current.style.position = 'absolute';
        overlayRef.current.style.left = `${rect.left - stageRect.left - 2}px`;
        overlayRef.current.style.top = `${rect.top - stageRect.top - 2}px`;
        overlayRef.current.style.width = `${rect.width + 4}px`;
        overlayRef.current.style.height = `${rect.height + 4}px`;
      }
    }
  }, [selectedElement, stageRef]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none border-2 border-blue-500 bg-blue-200 bg-opacity-20"
      style={{ zIndex: 1000 }}
    />
  );
}