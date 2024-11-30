
// props untuk fungsi Provider Auth
export interface ProviderProps {
  user: any;
  token: string;
  login: (data: LoginProps) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// props untuk fungsi login
export type LoginProps = {
  email: string;
  password: string;
}

export type userType = {
  "name": string ;
  "email": string ;
  "is_admin": boolean ;
  "photo_url": string | null;
  "id": number ;
  "is_active": boolean ;
  "saved_places": string[];
}