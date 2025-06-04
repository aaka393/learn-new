export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface Media {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  url: string;
}

export interface RichTextNode {
  type: string;
  children?: {
    type: string;
    text: string;
  }[];
}

export interface Album {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: RichTextNode[];
  cover: Media;
  photos: Media[];
}