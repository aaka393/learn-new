export interface Registry {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  isDefault: boolean;
}

export interface Repository {
  name: string;
}

export interface RepositoriesResponse {
  repositories: string[];
}

export interface Tag {
  name: string;
}

export interface TagsResponse {
  name: string;
  tags: string[];
}

export interface Manifest {
  modified: any;
  schemaVersion: number;
  mediaType: string;
  config: {
    mediaType: string;
    size: number;
    digest: string;
  };
  layers: {
    mediaType: string;
    size: number;
    digest: string;
  }[];
  size?: number;
  created?: string;
}