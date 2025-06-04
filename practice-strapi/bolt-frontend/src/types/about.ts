export interface QuoteBlock {
  __component: 'shared.quote';
  id: number;
  title: string;
  body: string;
}

export interface RichTextBlock {
  __component: 'shared.rich-text';
  id: number;
  body: string;
}

export interface MediaBlock {
  __component: 'shared.media';
  id: number;
  media: {
    formats: {
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
    url: string;
  };
}

export type AboutBlock = QuoteBlock | RichTextBlock | MediaBlock;

export interface AboutData {
  id: number;
  title: string;
  blocks: AboutBlock[];
}