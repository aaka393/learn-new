export interface LoginData {
    username: string;
    password: string;
  }
  export type LoginCredentials = LoginData;
  export interface RegisterData {
    username: string;
    email: string;
    password: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
  }
  
