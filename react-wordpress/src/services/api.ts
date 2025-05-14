import {
  WordPressPost,
  WordPressPage,
  WordPressEvent,
  WordPressCategory,
  WordPressSiteInfo,
  WordPressGalleryItem,
  PaginationInfo
} from '../types/wordpress';

import axios from 'axios';

const WORDPRESS_API_URL = 'http://192.168.0.104:8001/wp-json/wp/v2';
const SITE_INFO_URL = 'http://192.168.0.104:8001/wp-json';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

const extractPaginationInfo = (response: Response): PaginationInfo => {
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
  const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);

  return {
    currentPage: 1,
    totalPages,
    totalItems
  };
};

export const getNextGENAlbum = async () => {
  const res = await axios.get(`${SITE_INFO_URL}/nextgen/v1/albums/1`);
  return res.data;
};

// export const fetchGalleryItems = async (): Promise<{ items: WordPressGalleryItem[], pagination: PaginationInfo } | null> => {
//   const response = await fetch(`${WORDPRESS_API_URL}/media?`);
//   const pagination = extractPaginationInfo(response);

//   const items = await handleResponse<WordPressGalleryItem[]>(response);
//   return { items, pagination };
// };

export const fetchGalleryItems = async (): Promise<{
  albums: { post: WordPressPost; items: WordPressGalleryItem[] }[];
  pagination: PaginationInfo;
} | null> => {
  try {
    // Fetch all posts (albums)
    const postsResponse = await fetch(`${WORDPRESS_API_URL}/posts?_embed&per_page=100`);
    const posts = await handleResponse<WordPressPost[]>(postsResponse);

    // Fetch all media items (gallery items)
    const mediaResponse = await fetch(`${WORDPRESS_API_URL}/media?per_page=100`);
    const mediaItems = await handleResponse<WordPressGalleryItem[]>(mediaResponse);

    // Extract pagination info from media response
    const pagination = extractPaginationInfo(mediaResponse);

    // Group media items by associated post (using item.post === post.id)
    const albums = posts.map(post => {
      const albumItems = mediaItems.filter(item => item.post === post.id);
      return { post, items: albumItems };
    });

    return { albums, pagination };
  } catch (error) {
    console.error("Error fetching gallery items with albums:", error);
    return null;
  }
};




export const fetchPosts = async (page = 1, perPage = 10): Promise<{ posts: WordPressPost[], pagination: PaginationInfo }> => {
  const response = await fetch(`${WORDPRESS_API_URL}/posts?_embed=wp:featuredmedia,author&page=${page}&per_page=${perPage}`);
  const pagination = extractPaginationInfo(response);
  pagination.currentPage = page;
  const posts = await handleResponse<WordPressPost[]>(response);
  return { posts, pagination };
};

export const fetchPostBySlug = async (slug: string): Promise<WordPressPost | null> => {
  const response = await fetch(`${WORDPRESS_API_URL}/posts?slug=${slug}&_embed=wp:featuredmedia,author`);
  console.log("response from sample data", response)
  const posts = await handleResponse<WordPressPost[]>(response);
  return posts.length > 0 ? posts[0] : null;
};

export const fetchPages = async (): Promise<WordPressPage[]> => {
  const response = await fetch(`${WORDPRESS_API_URL}/pages?_embed&per_page=100`);
  return handleResponse<WordPressPage[]>(response);
};

export const fetchPageBySlug = async (slug: string): Promise<WordPressPage | null> => {
  const response = await fetch(`${WORDPRESS_API_URL}/pages?slug=${slug}&_embed`);
  const pages = await handleResponse<WordPressPage[]>(response);
  return pages.length > 0 ? pages[0] : null;
};

export const fetchCategories = async (): Promise<WordPressCategory[]> => {
  const response = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100`);
  return handleResponse<WordPressCategory[]>(response);
};

export const fetchSiteInfo = async (): Promise<WordPressSiteInfo> => {
  const response = await fetch(SITE_INFO_URL);
  const data = await handleResponse<any>(response);

  return {
    name: data.name,
    description: data.description,
    url: data.url,
    home: data.home,
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#'
    }
  };
};

export const fetchEvents = async (page = 1, perPage = 10): Promise<{ events: WordPressEvent[], pagination: PaginationInfo }> => {
  const response = await fetch(`${WORDPRESS_API_URL}/tribe_events?_embed&page=${page}&per_page=${perPage}`);
  const pagination = extractPaginationInfo(response);
  pagination.currentPage = page;
  const events = await handleResponse<WordPressEvent[]>(response);
  return { events, pagination };
};

export const fetchEventBySlug = async (slug: string): Promise<WordPressEvent | null> => {
  const response = await fetch(`${WORDPRESS_API_URL}/event?slug=${slug}&_embed`);
  const events = await handleResponse<WordPressEvent[]>(response);
  return events.length > 0 ? events[0] : null;
};