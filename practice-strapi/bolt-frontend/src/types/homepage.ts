export interface HeroBlock {
  __component: 'shared.hero';
  id: number;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  backgroundImage: {
    formats: {
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
    url: string;
  };
}

export interface FeatureBlock {
  __component: 'shared.feature';
  id: number;
  title: string;
  description: { type: string; children: { type: string; text: string }[] }[];
  icon: {
    formats: {
      small?: { url: string };
      thumbnail?: { url: string };
    };
    url: string;
  };
}

export interface CTABlock {
  __component: 'shared.cta';
  id: number;
  title: string;
  buttonText: string;
  buttonUrl: string;
}

export interface VideoBlock {
  __component: 'shared.video-block';
  id: number;
  title: string;
  videoUrl: string;
  poster: {
    url: string;
  };
}

export interface RichTextBlock {
  __component: 'shared.rich-text';
  id: number;
  body: string;
}

export type Block = HeroBlock | FeatureBlock | CTABlock | VideoBlock | RichTextBlock;

export interface HomepageData {
  title: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  blocks: Block[];
}