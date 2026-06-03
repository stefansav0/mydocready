export interface ResumeElement {
  id: string;

  type: "text" | "image";

  content?: string;

  data?: string;

  x: number;

  y: number;

  w: number;

  h: number;

  fontSize?: number;

  fontWeight?: string;

  color?: string;

  fontFamily?: string;

  textAlign?: string;

  opacity?: number;

  rotation?: number;

  locked?: boolean;
}