import type { Schema, Struct } from '@strapi/strapi';

export interface AboutSection extends Struct.ComponentSchema {
  collectionName: 'components_about_sections';
  info: {
    displayName: 'section';
    icon: 'bold';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface AboutTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_about_team_members';
  info: {
    description: '';
    displayName: 'team-member';
    icon: 'bold';
  };
  attributes: {
    bio: Schema.Attribute.String;
    name: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    role: Schema.Attribute.String;
  };
}

export interface AboutValueItem extends Struct.ComponentSchema {
  collectionName: 'components_about_value_items';
  info: {
    displayName: 'value-item';
    icon: 'bold';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface AboutValues extends Struct.ComponentSchema {
  collectionName: 'components_about_values';
  info: {
    description: '';
    displayName: 'values';
    icon: 'bold';
  };
  attributes: {
    values: Schema.Attribute.Component<'about.value-item', true>;
  };
}

export interface FeatureFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_feature_feature_items';
  info: {
    description: '';
    displayName: 'feature-item';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface FooterFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_columns';
  info: {
    description: '';
    displayName: 'footer-column';
    icon: 'bold';
  };
  attributes: {
    footer_links: Schema.Attribute.Component<'footer.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface FooterLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_links';
  info: {
    displayName: 'link';
    icon: 'bold';
  };
  attributes: {
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    description: '';
    displayName: 'social-link';
    icon: 'bold';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['Mail', 'Github', 'Twitter', 'Linkedin', 'Instagram']
    >;
    url: Schema.Attribute.String;
  };
}

export interface HeaderMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_header_menu_items';
  info: {
    description: '';
    displayName: 'menu_item';
  };
  attributes: {
    label: Schema.Attribute.String;
    slug: Schema.Attribute.String;
  };
}

export interface SharedContact extends Struct.ComponentSchema {
  collectionName: 'components_shared_contacts';
  info: {
    description: '';
    displayName: 'contact';
    icon: 'bold';
  };
  attributes: {
    label: Schema.Attribute.String;
    name: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean;
    type: Schema.Attribute.Enumeration<['text, email, textarea']> &
      Schema.Attribute.DefaultTo<'text, email, textarea'>;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: '';
    displayName: 'cta';
    icon: 'bold';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    description: '';
    displayName: 'feature';
    icon: 'bold';
  };
  attributes: {
    features: Schema.Attribute.Component<'feature.feature-item', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    description: '';
    displayName: 'hero';
    icon: 'bold';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_images';
  info: {
    description: '';
    displayName: 'image';
    icon: 'picture';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    description: '';
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'videos' | 'audios' | 'files'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedShowcase extends Struct.ComponentSchema {
  collectionName: 'components_shared_showcases';
  info: {
    description: '';
    displayName: 'showcase';
    icon: 'bold';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']>;
    imageUrl: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedStory extends Struct.ComponentSchema {
  collectionName: 'components_shared_stories';
  info: {
    description: '';
    displayName: 'story';
    icon: 'bold';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedVideoBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_video_blocks';
  info: {
    displayName: 'video-block';
    icon: 'bold';
  };
  attributes: {
    poster: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.section': AboutSection;
      'about.team-member': AboutTeamMember;
      'about.value-item': AboutValueItem;
      'about.values': AboutValues;
      'feature.feature-item': FeatureFeatureItem;
      'footer.footer-column': FooterFooterColumn;
      'footer.link': FooterLink;
      'footer.social-link': FooterSocialLink;
      'header.menu-item': HeaderMenuItem;
      'shared.contact': SharedContact;
      'shared.cta': SharedCta;
      'shared.feature': SharedFeature;
      'shared.hero': SharedHero;
      'shared.image': SharedImage;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.showcase': SharedShowcase;
      'shared.slider': SharedSlider;
      'shared.story': SharedStory;
      'shared.video-block': SharedVideoBlock;
    }
  }
}
