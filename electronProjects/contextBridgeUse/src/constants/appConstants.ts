export const serviceBaseUrl =
  import.meta.env.MODE === "development"
    ? "/api"
    : "http://192.168.0.108:8000"; 
export const staticFileBaseUrl = '/api/static/documents/';
export const staticImageBaseUrl = '/api/static/images/';

export const FILE_TYPES = {
  FOLDER: 'folder',
  FILE: 'file',
} as const;

export const MENU_ACTIONS = {
  EDIT: 'edit',
  DOWNLOAD: 'download',
  INFO: 'info',
  DELETE: 'delete',
  UPDATE: 'update',
} as const;
