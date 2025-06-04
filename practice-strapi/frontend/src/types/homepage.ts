export interface HeroBlock {
  __component: 'shared.hero';
  title: string;
  subtitle: string;
  backgroundImage: { url: string };
}

export interface FeatureBlock {
  __component: 'shared.feature';
  title: string;
  description: string;
  icon: { url: string };
}

export interface VideoBlock {
  __component: 'shared.video-block';
  title: string;
  videoUrl: string;
  poster: { url: string };
}

export interface CTABlock {
  __component: 'shared.cta';
  title: string;
  buttonText: string;
  buttonUrl: string;
}

export type Block = HeroBlock | FeatureBlock | VideoBlock | CTABlock;

export interface HomepageData {
  title: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  blocks: Block[];
}
