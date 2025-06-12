export interface Block {
  id: number;
  __component: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  imagePosition?: string;
  media?: {
    data: {
      id: number;
      attributes: {
        url: string;
        formats: {
          thumbnail?: { url: string };
          small?: { url: string };
          medium?: { url: string };
          large?: { url: string };
        };
      };
    };
  };
  features?: Array<{
    id: number;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface HomepageData {
  title: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  blocks: Block[];
  hero: {
    title: string;
    subtitle: string;
    buttonUrl: string;
    description: string;
    buttonText: string;
    backgroundImage: string;
  };
  showcases: {
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    imagePosition: string;
  }[];
  story: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    buttonText: string;
    buttonUrl: string
  };
}

