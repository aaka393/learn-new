import axios from 'axios';
import { Registry, RepositoriesResponse, TagsResponse, Manifest } from '../types/registry';

const createAuthHeaders = (registry: Registry): Record<string, string> => {
  const headers: Record<string, string> = {};

  if (registry.username && registry.password) {
    const auth = btoa(`${registry.username}:${registry.password}`);
    headers['Authorization'] = `Basic ${auth}`;
  }

  return headers;
};

export const getRepositories = async (registry: Registry): Promise<RepositoriesResponse> => {
  try {
    const headers = createAuthHeaders(registry);
    const registryUrl = registry.url;

    const response = await axios.get(`${registryUrl}/v2/_catalog`, { headers });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

export const getTags = async (registry: Registry, repository: string): Promise<TagsResponse> => {
  try {
    const headers = createAuthHeaders(registry);
    const registryUrl = registry.url;

    const response = await axios.get(`${registryUrl}/v2/${repository}/tags/list`, { headers });

    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const getManifest = async (registry: Registry, repository: string, tag: string): Promise<Manifest> => {
  try {
    const headers = {
      ...createAuthHeaders(registry),
      'Accept': 'application/vnd.docker.distribution.manifest.v2+json',
    };
    const registryUrl = registry.url;

    const response = await axios.get(`${registryUrl}/v2/${repository}/manifests/${tag}`, { headers });
    console.log('Manifest response:', response.data);
    const layerSizes = response.data.layers
      ? response.data.layers.reduce((total: number, layer: { size: number }) => total + layer.size, 0)
      : 0;

    return {
      ...response.data,
      size: layerSizes,
    };
  } catch (error: any) {
    console.error('Error fetching manifest:', error.message);
    throw error;
  }
};
