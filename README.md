# Editable HTML Poster

A web application that allows users to import, visually edit, and export HTML files within a fixed 720×720 design area. Built with Next.js, TypeScript, and Tailwind CSS following SOLID design principles.

## Features

### ✅ Core Functionality
- **HTML Import**: Upload `.html` files or paste HTML content directly
- **Visual Editor**: 720×720 pixel canvas with visual editing capabilities
- **Element Selection**: Click to select elements with visual highlighting
- **Text Editing**: Double-click for inline editing or use properties panel
- **Image Replacement**: Upload new images or change URLs
- **Drag & Drop**: Reposition elements with mouse dragging
- **Element Management**: Add new text/image elements, delete selected elements
- **Export**: Download edited HTML with proper formatting and metadata

### 🎨 User Interface
- **Toolbar**: Import, add elements, delete, and export actions
- **Stage**: Fixed 720×720 canvas area for visual editing
- **Properties Panel**: Contextual editor for selected elements
- **Import Dialog**: File upload and HTML paste interface

### 🔒 Security & Performance
- **HTML Sanitization**: Uses DOMPurify to prevent XSS attacks
- **Efficient Rendering**: Custom drag implementation without heavy libraries
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Clean Tailwind CSS styling

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd htm-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Architecture & SOLID Design Principles

### Component Architecture

The application follows a modular component architecture with clear separation of concerns:

```
src/
├── app/
│   └── page.tsx                 # Next.js App Router entry point
├── components/
│   ├── HtmlEditor.tsx          # Main application container (S, O)
│   ├── Toolbar.tsx             # Action buttons and controls (S)
│   ├── Stage.tsx               # 720x720 editing canvas (S, O)
│   ├── PropertiesPanel.tsx     # Element property editor (S, O)
│   └── ImportDialog.tsx        # HTML import interface (S)
├── types/
│   └── index.ts                # TypeScript type definitions (D)
```

### SOLID Principles Implementation

#### **S - Single Responsibility Principle**
- **`HtmlEditor`**: Manages overall application state and coordinates components
- **`Toolbar`**: Handles user action buttons (import, add, delete, export)
- **`Stage`**: Manages the 720×720 canvas, element rendering, and interaction
- **`PropertiesPanel`**: Handles element property editing
- **`ImportDialog`**: Manages HTML import from files or paste

#### **O - Open/Closed Principle**
- Components are open for extension through props interfaces
- New element types can be added without modifying existing code
- Stage component can handle any HTML element through generic `ElementData` interface
- Properties panel automatically adapts to different element types

#### **L - Liskov Substitution Principle**
- All HTML elements are treated uniformly through the `ElementData` interface
- Element manipulation functions work consistently across different element types
- Component props follow consistent interfaces for easy substitution

#### **I - Interface Segregation Principle**
- Components receive only the props they need
- `ElementData` interface is focused and doesn't force unused properties
- Each component has minimal, focused prop interfaces

#### **D - Dependency Inversion Principle**
- Components depend on abstractions (TypeScript interfaces) not concrete implementations
- State management flows through props and callbacks, not direct DOM manipulation
- Type definitions are separated in `/types` directory

### State Management Pattern

```typescript
// Centralized state in HtmlEditor
const [htmlContent, setHtmlContent] = useState<string>('');
const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

// Unidirectional data flow
HtmlEditor -> Stage -> Element Selection -> Properties Panel -> Updates
```

### Key Technical Decisions

1. **Custom Drag Implementation**: Instead of heavy libraries like `react-dnd`, implemented lightweight mouse event handling for better performance and control

2. **DOMPurify Integration**: Sanitizes all HTML input to prevent XSS attacks while preserving valid HTML structure

3. **Direct DOM Manipulation**: For performance reasons, direct DOM updates are used within the controlled Stage environment

4. **TypeScript-First**: Complete type safety with interfaces for all data structures

## Usage Guide

### Importing HTML
1. Click "Import HTML" in the toolbar
2. Choose "Upload File" tab for `.html` files or "Paste HTML" for direct content
3. Use "Load Sample HTML" to test with provided example

### Editing Elements
1. **Select**: Click any element to select it (shows blue border)
2. **Move**: Drag selected elements around the 720×720 canvas
3. **Edit Text**: Double-click text elements for inline editing, or use Properties Panel
4. **Edit Images**: Select image and use Properties Panel to change URL or upload new file
5. **Style**: Use Properties Panel to modify position, size, colors, fonts

### Adding Elements
- Use "Add Text" to create new text elements
- Use "Add Image" to create new image placeholders
- New elements appear with slight offset and are auto-selected

### Exporting
- Click "Export HTML" to download your edited poster as an HTML file
- Exported file includes proper HTML structure and metadata

## Dependencies

### Core Dependencies
- **Next.js 15+**: React framework with App Router
- **React 18+**: UI library
- **TypeScript**: Type safety and development experience
- **Tailwind CSS**: Utility-first CSS framework

### Additional Dependencies
- **DOMPurify**: HTML sanitization for security
- **react-draggable**: Lightweight dragging library (minimal usage)

## Browser Support
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Known Limitations & Potential Improvements

### Current Limitations
1. **No Undo/Redo**: Changes are immediate and cannot be undone
2. **No Multi-Select**: Only one element can be selected at a time
3. **Limited CSS Support**: Properties panel covers basic styling only
4. **No Layer Management**: No z-index control or layer reordering
5. **No Responsive Preview**: Only 720×720 view available

### Potential Improvements
1. **Command Pattern**: Implement undo/redo with command history
2. **Multi-Selection**: Ctrl+click for multiple element selection
3. **Advanced Styling**: Color picker, gradient support, border controls
4. **Element Tree**: Hierarchical view of all elements
5. **Snapping Guides**: Alignment helpers and grid snapping
6. **Zoom & Pan**: Canvas zoom for detailed editing
7. **Keyboard Shortcuts**: Hot keys for common actions
8. **Copy/Paste**: Element duplication functionality
9. **Animation Support**: CSS transition and animation controls
10. **Component Library**: Pre-built UI components to add

### Performance Optimizations
- Implement virtual scrolling for large element lists
- Add debouncing for rapid property changes
- Use React.memo for components that don't need frequent re-renders
- Implement element pooling for large documents

### Accessibility Improvements
- Add ARIA labels and roles
- Implement keyboard navigation
- Add focus management
- Screen reader compatibility

## Testing

Currently manual testing is supported. For automated testing, consider:

```bash
# Unit tests (future)
npm run test

# E2E tests (future)
npm run test:e2e
```

## Contributing

The codebase follows these conventions:
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Functional components with hooks
- Props interfaces for all components
- Consistent naming conventions

## License

This project is created for evaluation purposes.

---

**Created**: October 2025  
**Framework**: Next.js 15 with App Router  
**Language**: TypeScript  
**Styling**: Tailwind CSS
