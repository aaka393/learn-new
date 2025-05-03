import { format } from 'date-fns';

export const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown';
  try {
    return format(new Date(dateString), 'PPP p');
  } catch (error) {
    return 'Invalid date';
  }
};

export const generatePullCommand = (registry: string, repository: string, tag: string): string => {
  // Remove http:// or https:// from registry URL
  const cleanRegistry = registry.replace(/^https?:\/\//, '');
  return `docker pull ${cleanRegistry}/${repository}:${tag}`;
};