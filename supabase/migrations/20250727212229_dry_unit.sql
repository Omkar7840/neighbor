/*
  # Initial Database Schema for NeighborShare

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `bio` (text, optional)
      - `location` (text, optional)
      - `phone` (text, optional)
      - `rating` (numeric, default 5.0)
      - `total_reviews` (integer, default 0)
      - `items_shared` (integer, default 0)
      - `items_borrowed` (integer, default 0)
      - `created_at` (timestamptz)

    - `items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `condition` (text)
      - `images` (text array)
      - `daily_value` (numeric, optional)
      - `owner_id` (uuid, foreign key to users)
      - `location` (text, optional)
      - `is_available` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `borrow_requests`
      - `id` (uuid, primary key)
      - `item_id` (uuid, foreign key to items)
      - `borrower_id` (uuid, foreign key to users)
      - `owner_id` (uuid, foreign key to users)
      - `start_date` (date)
      - `end_date` (date)
      - `message` (text, optional)
      - `status` (text, default 'pending')
      - `created_at` (timestamptz)

    - `reviews`
      - `id` (uuid, primary key)
      - `reviewer_id` (uuid, foreign key to users)
      - `reviewee_id` (uuid, foreign key to users)
      - `item_id` (uuid, foreign key to items, optional)
      - `request_id` (uuid, foreign key to borrow_requests)
      - `rating` (integer)
      - `comment` (text, optional)
      - `type` (text) - 'borrower' or 'lender'
      - `created_at` (timestamptz)

    - `messages`
      - `id` (uuid, primary key)
      - `request_id` (uuid, foreign key to borrow_requests)
      - `sender_id` (uuid, foreign key to users)
      - `receiver_id` (uuid, foreign key to users)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
    - Add policies for public read access where appropriate
    - Add policies for request and message access
*/

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  location text,
  phone text,
  rating numeric DEFAULT 5.0,
  total_reviews integer DEFAULT 0,
  items_shared integer DEFAULT 0,
  items_borrowed integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  images text[] DEFAULT '{}',
  daily_value numeric,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create borrow_requests table
CREATE TABLE IF NOT EXISTS borrow_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  borrower_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'returned', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  request_id uuid NOT NULL REFERENCES borrow_requests(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  type text NOT NULL CHECK (type IN ('borrower', 'lender')),
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES borrow_requests(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrow_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Items policies
CREATE POLICY "Items are publicly readable"
  ON items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own items"
  ON items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Borrow requests policies
CREATE POLICY "Users can read own requests"
  ON borrow_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = borrower_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create borrow requests"
  ON borrow_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = borrower_id);

CREATE POLICY "Owners can update request status"
  ON borrow_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Reviews policies
CREATE POLICY "Reviews are publicly readable"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- Messages policies
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS items_owner_id_idx ON items(owner_id);
CREATE INDEX IF NOT EXISTS items_category_idx ON items(category);
CREATE INDEX IF NOT EXISTS items_is_available_idx ON items(is_available);
CREATE INDEX IF NOT EXISTS borrow_requests_borrower_id_idx ON borrow_requests(borrower_id);
CREATE INDEX IF NOT EXISTS borrow_requests_owner_id_idx ON borrow_requests(owner_id);
CREATE INDEX IF NOT EXISTS borrow_requests_item_id_idx ON borrow_requests(item_id);
CREATE INDEX IF NOT EXISTS borrow_requests_status_idx ON borrow_requests(status);
CREATE INDEX IF NOT EXISTS reviews_reviewee_id_idx ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS messages_request_id_idx ON messages(request_id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update user ratings
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS trigger AS $$
BEGIN
  -- Update the reviewee's rating and review count
  UPDATE users 
  SET 
    rating = (
      SELECT AVG(rating)::numeric(3,2) 
      FROM reviews 
      WHERE reviewee_id = NEW.reviewee_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update ratings when reviews are added
CREATE TRIGGER update_rating_on_review
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();