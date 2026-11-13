import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Article {
  id: string;
  name: string;
  heading: string;
  description: string;
  image_url: string | null;
  pinned: boolean;
  pin_rank: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'techxadmin@00';
