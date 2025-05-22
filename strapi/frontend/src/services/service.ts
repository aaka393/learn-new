import axios from 'axios';
import { Article, ApiResponse } from '../types/Article';
import { API_BASE_URL, baseUrl } from "../constants/appConstants";


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
      const res = await axios.get(`${API_BASE_URL}/about?populate=*`);
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
