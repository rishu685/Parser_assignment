export interface ElementData {
  id: string;
  tagName: string;
  content?: string;
  src?: string;
  alt?: string;
  style?: Partial<CSSStyleDeclaration>;
  position?: {
    x: number;
    y: number;
  };
  attributes?: Record<string, string>;
}