export interface FooterData {
  id: number;
  text: string;
  description: RichTextBlock[];
  footer_columns: FooterColumn[];
  social_links: SocialLink[];
}

export interface RichTextBlock {
  type: string;
  children: { type: string; text: string }[];
}

export interface FooterColumn {
  id: number;
  title: string;
  footer_links: FooterLink[];
}

export interface FooterLink {
  id: number;
  name: string;
  url: string | null;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
}
