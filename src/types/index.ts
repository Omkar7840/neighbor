export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  rating: number;
  total_reviews: number;
  items_shared: number;
  items_borrowed: number;
  created_at: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  images: string[];
  daily_value?: number;
  owner_id: string;
  location?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  owner?: User;
}

export interface BorrowRequest {
  id: string;
  item_id: string;
  borrower_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'returned' | 'completed';
  created_at: string;
  item?: Item;
  borrower?: User;
  owner?: User;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  item_id?: string;
  request_id: string;
  rating: number;
  comment?: string;
  type: 'borrower' | 'lender';
  created_at: string;
  reviewer?: User;
}

export interface Message {
  id: string;
  request_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: User;
}

export const CATEGORIES = [
  'Tools & Equipment',
  'Electronics',
  'Sports & Recreation',
  'Books & Media',
  'Kitchen & Appliances',
  'Garden & Outdoor',
  'Baby & Kids',
  'Clothing & Accessories',
  'Home & Furniture',
  'Art & Crafts',
  'Musical Instruments',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];