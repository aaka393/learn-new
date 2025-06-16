import axios from 'axios';
import { Blog, Article } from '../types/contentTypes';

// Simulated API service
const API_BASE_URL = 'https://api.example.com';

// Dummy data
const dummyBlogs: Blog[] = [
  {
    id: 1,
    title: 'Why Design Matters in Modern Development',
    summary: 'Exploring the intersection of design and technology in creating meaningful user experiences.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Design', 'UX', 'Development'],
    date: '2024-01-15',
    readTime: 8,
    author: 'Sarah Chen'
  },
  {
    id: 2,
    title: 'The Future of Glassmorphism in Web Design',
    summary: 'How translucent interfaces are shaping the next generation of digital experiences.',
    image: 'https://images.pexels.com/photos/7135057/pexels-photo-7135057.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['UI', 'Trends', 'Glassmorphism'],
    date: '2024-01-10',
    readTime: 6,
    author: 'Alex Rivera'
  },
  {
    id: 3,
    title: 'Minimalism in Modern Development',
    summary: 'Why less is more when it comes to building scalable, maintainable applications.',
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Code', 'Minimal', 'Architecture'],
    date: '2024-01-05',
    readTime: 10,
    author: 'Jordan Park'
  }
];

const dummyArticles: Article[] = [
  {
    id: 1,
    title: 'React Performance Optimization Tips',
    summary: 'Advanced techniques to optimize your React components and improve application performance.',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['React', 'Performance', 'Optimization'],
    date: '2024-01-12',
    readTime: 12,
    author: 'Emily Watson',
    category: 'Technical'
  },
  {
    id: 2,
    title: 'Understanding Zustand State Management',
    summary: 'A comprehensive guide to Zustand - the lightweight state management solution for React.',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Zustand', 'State', 'React'],
    date: '2024-01-08',
    readTime: 9,
    author: 'Michael Brown',
    category: 'Tutorial'
  },
  {
    id: 3,
    title: 'Building Robust API Service Layers',
    summary: 'Best practices for creating maintainable and scalable API service architectures.',
    image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['API', 'Architecture', 'Backend'],
    date: '2024-01-03',
    readTime: 15,
    author: 'Lisa Zhang',
    category: 'Architecture'
  }
];

class BlogService {
  async getBlogs(): Promise<Blog[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return dummyBlogs;
  }

  async getArticles(): Promise<Article[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return dummyArticles;
  }

  async getBlogById(id: number): Promise<Blog | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return dummyBlogs.find(blog => blog.id === id);
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return dummyArticles.find(article => article.id === id);
  }
}

export const blogService = new BlogService();