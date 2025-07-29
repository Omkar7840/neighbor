/*
  # Sample Data for NeighborShare

  1. Sample Users
    - Create demo user profiles with realistic data
    
  2. Sample Items
    - Create various items across different categories
    
  3. Sample Requests
    - Create some borrow requests to show functionality
    
  4. Sample Reviews
    - Create reviews to show rating system
*/

-- Insert sample users (these will be created when users sign up, but we can prepare some demo data)
-- Note: In a real app, these would be created automatically when users sign up

-- Insert sample items for demo purposes
-- These items will show up in the browse section

-- First, we need to insert some demo user data
-- In production, this would be handled by the auth trigger, but for demo we'll insert directly

DO $$
BEGIN
  -- Only insert if users don't exist (to avoid conflicts)
  IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
    -- Insert demo users (these IDs would normally come from auth.users)
    INSERT INTO users (id, email, full_name, bio, location, rating, total_reviews, items_shared, items_borrowed) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@example.com', 'Sarah Johnson', 'Love sharing tools and building community connections!', 'Downtown Portland', 4.8, 12, 15, 8),
    ('550e8400-e29b-41d4-a716-446655440002', 'mike.chen@example.com', 'Mike Chen', 'Outdoor enthusiast always happy to share camping gear.', 'East Austin', 4.9, 8, 12, 5),
    ('550e8400-e29b-41d4-a716-446655440003', 'emma.davis@example.com', 'Emma Davis', 'Kitchen gadget collector and baking enthusiast.', 'Capitol Hill Seattle', 4.7, 15, 20, 12),
    ('550e8400-e29b-41d4-a716-446655440004', 'james.wilson@example.com', 'James Wilson', 'DIY home improvement specialist with lots of tools to share.', 'Mission District SF', 5.0, 6, 8, 3),
    ('550e8400-e29b-41d4-a716-446655440005', 'lisa.brown@example.com', 'Lisa Brown', 'Art supplies and craft materials galore!', 'Brooklyn Heights', 4.6, 9, 11, 7);

    -- Insert sample items
    INSERT INTO items (title, description, category, condition, images, daily_value, owner_id, location, is_available) VALUES
    (
      'DeWalt 20V Power Drill',
      'Professional grade cordless drill with 2 batteries and charger. Perfect for home improvement projects, furniture assembly, and general repairs. Very reliable and powerful.',
      'Tools & Equipment',
      'excellent',
      ARRAY[
        'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      8.00,
      '550e8400-e29b-41d4-a716-446655440001',
      'Downtown Portland',
      true
    ),
    (
      '4-Person Camping Tent',
      'Spacious and weatherproof tent perfect for family camping trips. Easy to set up and take down. Includes stakes and guylines. Used only a few times.',
      'Sports & Recreation',
      'good',
      ARRAY[
        'https://images.pexels.com/photos/2422312/pexels-photo-2422312.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      15.00,
      '550e8400-e29b-41d4-a716-446655440002',
      'East Austin',
      true
    ),
    (
      'KitchenAid Stand Mixer',
      'Classic white KitchenAid stand mixer with dough hook, wire whip, and flat beater. Perfect for baking bread, cookies, and cakes. Well-maintained and works perfectly.',
      'Kitchen & Appliances',
      'good',
      ARRAY[
        'https://images.pexels.com/photos/4686820/pexels-photo-4686820.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/4087392/pexels-photo-4087392.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      12.00,
      '550e8400-e29b-41d4-a716-446655440003',
      'Capitol Hill Seattle',
      true
    ),
    (
      'Circular Saw - 7.25 inch',
      'Heavy-duty circular saw for woodworking projects. Includes extra blades and safety guide. Great for deck building, framing, and general construction work.',
      'Tools & Equipment',
      'good',
      ARRAY[
        'https://images.pexels.com/photos/1216544/pexels-photo-1216544.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      10.00,
      '550e8400-e29b-41d4-a716-446655440004',
      'Mission District SF',
      true
    ),
    (
      'Professional Sewing Machine',
      'Brother computerized sewing machine with multiple stitch patterns and automatic threading. Perfect for clothing alterations, quilting, and craft projects.',
      'Art & Crafts',
      'excellent',
      ARRAY[
        'https://images.pexels.com/photos/3738373/pexels-photo-3738373.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/6765045/pexels-photo-6765045.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      7.00,
      '550e8400-e29b-41d4-a716-446655440005',
      'Brooklyn Heights',
      true
    ),
    (
      'Pressure Washer - 2000 PSI',
      'Gas-powered pressure washer perfect for cleaning driveways, decks, and siding. Includes various nozzle attachments and cleaning solution tank.',
      'Tools & Equipment',
      'good',
      ARRAY[
        'https://images.pexels.com/photos/8199179/pexels-photo-8199179.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      18.00,
      '550e8400-e29b-41d4-a716-446655440004',
      'Mission District SF',
      true
    ),
    (
      'Kayak - Single Person',
      'Lightweight recreational kayak perfect for lakes and calm rivers. Includes paddle and life jacket. Great for beginners and casual paddlers.',
      'Sports & Recreation',
      'fair',
      ARRAY[
        'https://images.pexels.com/photos/3811101/pexels-photo-3811101.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3952048/pexels-photo-3952048.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      25.00,
      '550e8400-e29b-41d4-a716-446655440002',
      'East Austin',
      true
    ),
    (
      'Baby High Chair',
      'Adjustable high chair with removable tray and washable seat pad. Safe and sturdy construction with 5-point harness. Perfect for feeding time.',
      'Baby & Kids',
      'good',
      ARRAY[
        'https://images.pexels.com/photos/8088467/pexels-photo-8088467.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      5.00,
      '550e8400-e29b-41d4-a716-446655440001',
      'Downtown Portland',
      true
    ),
    (
      'Guitar - Acoustic Steel String',
      'Beautiful acoustic guitar perfect for beginners and casual players. Good tone and easy to play. Includes picks and beginner chord chart.',
      'Musical Instruments',
      'good',
      ARRAY[
        'https://images.pexels.com/photos/1851148/pexels-photo-1851148.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      8.00,
      '550e8400-e29b-41d4-a716-446655440003',
      'Capitol Hill Seattle',
      true
    ),
    (
      'Ladder - 8ft Step Ladder',
      'Sturdy aluminum step ladder perfect for interior painting, changing light bulbs, and general household tasks. Lightweight but stable.',
      'Tools & Equipment',
      'excellent',
      ARRAY[
        'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      6.00,
      '550e8400-e29b-41d4-a716-446655440005',
      'Brooklyn Heights',
      true
    );

    -- Insert some sample borrow requests
    INSERT INTO borrow_requests (item_id, borrower_id, owner_id, start_date, end_date, message, status) VALUES
    (
      (SELECT id FROM items WHERE title = 'DeWalt 20V Power Drill' LIMIT 1),
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440001',
      CURRENT_DATE + INTERVAL '2 days',
      CURRENT_DATE + INTERVAL '5 days',
      'Hi! I need to assemble some IKEA furniture this weekend. Would love to borrow your drill!',
      'pending'
    ),
    (
      (SELECT id FROM items WHERE title = 'KitchenAid Stand Mixer' LIMIT 1),
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440003',
      CURRENT_DATE + INTERVAL '1 day',
      CURRENT_DATE + INTERVAL '3 days',
      'Planning to bake cookies for a charity event. This would be perfect!',
      'approved'
    ),
    (
      (SELECT id FROM items WHERE title = 'Kayak - Single Person' LIMIT 1),
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440002',
      CURRENT_DATE - INTERVAL '5 days',
      CURRENT_DATE - INTERVAL '2 days',
      'Would love to try kayaking before buying my own. Thanks!',
      'completed'
    );

    -- Insert some sample reviews
    INSERT INTO reviews (reviewer_id, reviewee_id, request_id, rating, comment, type) VALUES
    (
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440002',
      (SELECT id FROM borrow_requests WHERE status = 'completed' LIMIT 1),
      5,
      'Mike was super helpful and the kayak was in great condition. Had an amazing day on the water!',
      'borrower'
    ),
    (
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440004',
      (SELECT id FROM borrow_requests WHERE status = 'completed' LIMIT 1),
      5,
      'James was very respectful with the kayak and returned it clean and on time. Great borrower!',
      'lender'
    );

  END IF;
END $$;