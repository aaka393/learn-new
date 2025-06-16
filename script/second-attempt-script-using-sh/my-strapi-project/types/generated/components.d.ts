import type { Schema, Struct } from '@strapi/strapi';

export interface FooterFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_columns';
  info: {
    displayName: 'footer-column';
    icon: 'columns';
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
    icon: 'globe';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['Mail', 'Github', 'Twitter', 'Linkedin', 'Instagram']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String;
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

export interface NavigationNavItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_items';
  info: {
    displayName: 'nav-item';
    icon: 'menu';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer.footer-column': FooterFooterColumn;
      'footer.footer-link': FooterFooterLink;
      'footer.social-link': FooterSocialLink;
      'home.hero': HomeHero;
      'home.showcase': HomeShowcase;
      'home.story': HomeStory;
      'navigation.nav-item': NavigationNavItem;
    }
  }
}
