export interface Article {
  id: number;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  cover: {
    formats: {
      medium: CoverFormat | null;
      small: CoverFormat | null;
    };
  };
  category: {
    name: string;
  };
}

export interface CoverFormat {
  url: string;
}

export interface Category {
  name: string;
}

export interface ApiResponse {
  data: Article[];
  meta: {
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      pageCount: number;
    }
  }
}
