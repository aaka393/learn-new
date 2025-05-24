export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  uploaded: string | null;
  textContent: string | null;
  markdownContent: string | null;
  email: string | null;
  coverMedia: {
    id: number;
    formats: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
    url: string;
  } | null;
  author: {
    id: number;
    name: string;
    email: string;
  } | null;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export interface ApiResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}