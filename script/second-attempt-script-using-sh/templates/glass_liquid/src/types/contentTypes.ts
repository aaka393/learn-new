export interface Blog {
  id: number;
  title: string;
  summary: string;
  image: string;
  tags: string[];
  date: string;
  readTime: number;
  author: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  image: string;
  tags: string[];
  date: string;
  readTime: number;
  author: string;
  category: string;
}

export interface UIPreferences {
  theme: 'light' | 'dark';
  activeSection: 'home' | 'blog' | 'articles';
  glassmorphismIntensity: number;
}