import type { Schema, Struct } from '@strapi/strapi';

export interface AboutSection extends Struct.ComponentSchema {
  collectionName: 'components_about_sections';
  info: {
    displayName: 'section';
    icon: 'file-text';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    image: Schema.Attribute.Media;
  };
}

export interface AboutTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_about_team_members';
  info: {
    displayName: 'team-member';
    icon: 'users';
  };
  attributes: {
    bio: Schema.Attribute.String;
    name: Schema.Attribute.String;
    photo: Schema.Attribute.Media;
    role: Schema.Attribute.String;
  };
}

export interface AboutValueItem extends Struct.ComponentSchema {
  collectionName: 'components_about_value_items';
  info: {
    displayName: 'value-item';
    icon: 'tag';
  };
  attributes: {
    description: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface AboutValues extends Struct.ComponentSchema {
  collectionName: 'components_about_values';
  info: {
    displayName: 'values';
    icon: 'award';
  };
  attributes: {
    values: Schema.Attribute.Component<'about.value-item', true>;
  };
}

export interface FooterFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_columns';
  info: {
    displayName: 'footer-column';
    icon: 'bulletList';
  };
  attributes: {
    footer_links: Schema.Attribute.Component<'footer.footer-link', true>;
    title: Schema.Attribute.String;
  };
}

export interface FooterFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_links';
  info: {
    displayName: 'footer-link';
    icon: 'link';
  };
  attributes: {
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    displayName: 'social-link';
    icon: 'link';
  };
  attributes: {
    platform: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface HeaderNavItem extends Struct.ComponentSchema {
  collectionName: 'components_header_nav_items';
  info: {
    displayName: 'nav-item';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String;
    slug: Schema.Attribute.String;
  };
}

export interface HomeHero extends Struct.ComponentSchema {
  collectionName: 'components_home_heroes';
  info: {
    displayName: 'hero';
    icon: 'heading';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface HomeShowcase extends Struct.ComponentSchema {
  collectionName: 'components_home_showcases';
  info: {
    displayName: 'showcase';
    icon: 'grid';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']>;
    imageUrl: Schema.Attribute.Media;
    title: Schema.Attribute.String;
  };
}

export interface HomeStory extends Struct.ComponentSchema {
  collectionName: 'components_home_stories';
  info: {
    displayName: 'story';
    icon: 'book';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.section': AboutSection;
      'about.team-member': AboutTeamMember;
      'about.value-item': AboutValueItem;
      'about.values': AboutValues;
      'footer.footer-column': FooterFooterColumn;
      'footer.footer-link': FooterFooterLink;
      'footer.social-link': FooterSocialLink;
      'header.nav-item': HeaderNavItem;
      'home.hero': HomeHero;
      'home.showcase': HomeShowcase;
      'home.story': HomeStory;
    }
  }
}
