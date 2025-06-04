import axios from 'axios';
import { Article, ApiResponse } from '../types/Article';
import { HeaderData, MenuItem } from '../types/Header'
import { API_BASE_URL, baseUrl } from "../constants/appConstants";
import { HomepageData } from '../types/homepage';
import { ContactData } from '../types/contact';

export const fetchHeaderData = async (): Promise<HeaderData | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/headers?populate=*`);
    const firstItem = response.data.data[0];

    if (!firstItem) return null;

    const { title, menu_items } = firstItem;

    const cleanedMenuItems = menu_items.map((item: MenuItem) => ({
      label: item.label,
      slug: item.slug.trim(),
    }));

    return { title, menu_items: cleanedMenuItems };
  } catch (error) {
    console.error('Error fetching header data:', error);
    return null;
  }
};

export const fetchHomepageData = async (): Promise<HomepageData> => {
  const res = await axios.get(`${API_BASE_URL}/homepages?populate[blocks][populate]=*`);
  const homepage = res.data.data?.[0];
  if (!homepage) {
    throw new Error('Homepage data missing');
  }

  return {
    title: homepage.title || '',
    slug: homepage.slug || '',
    seo_title: homepage.seo_title || '',
    seo_description: homepage.seo_description || '',
    blocks: homepage.blocks || [],
  };
};


export const fetchFooterData = async (): Promise<{ text: string } | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/footers?populate=*`);
    const firstItem = response.data.data[0];
    return firstItem ? { text: firstItem.text } : null;
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return null;
  }
};


export const fetchContactData = async (): Promise<ContactData | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contact`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch contact data:', error);
    return null;
  }
};



export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/articles?populate=*`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    throw error;
  }
};

export const fetchArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/articles?filters[slug][$eq]=${slug}&populate=*`);
    if (response.data.data.length > 0) {
      return response.data.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch article with slug ${slug}:`, error);
    throw error;
  }
};

export const fetchAboutData = async (): Promise<any> => {
    try {
      const res = await axios.get(`${API_BASE_URL}/about?populate=blocks.media`);
      return res.data.data;
    } catch (error) {
      console.error('Failed to load About content:', error);
      throw error;
    }
  };

  export const fetchAuthorData = async (): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/articles?populate=author`);
      console.log(response)
      const articles = response.data.data;
      if (articles && articles.length > 0 && articles[1]?.author) {
        return articles[1].author;
      } else {
        throw new Error('No author data found.');
      }
    } catch (error) {
      console.error('Failed to load author data:', error);
      throw error;
    }
  };

  export const getArticleCover = (article: Article): string => {    
    return article.coverMedia?.formats?.medium?.url ? `${baseUrl}${article.coverMedia.formats.medium.url}` :
           article.coverMedia?.formats?.small?.url ? `${baseUrl}${article.coverMedia.formats.small.url}` :
           'https://source.unsplash.com/random/400x300';
  };

  export const getArticleCategory = (article: Article): string => {
    return article.category?.name || 'Uncategorized';
  };

  export const getAboutImageUrl = (block: any): string | undefined => {
    return block.formats?.medium?.url ? `${baseUrl}${block.formats.medium.url}` :
           block.formats?.small?.url ? `${baseUrl}${block.formats.small.url}` :
           block.url;
  };


export const fetchGalleryImages = async (): Promise<any[]> => {
    try {
      const response = await axios.get<any[]>(`${API_BASE_URL}/upload/files`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      throw error;
    }
  };

