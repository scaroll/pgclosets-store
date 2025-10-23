-- PostgreSQL Migration Script for PG Closets Store
-- Version: 1.0.0
-- Description: Complete database schema implementation with all 5 categories

-- ===================================================================
-- PREREQUISITES
-- ===================================================================
-- 1. PostgreSQL 15+ with pgvector extension
-- 2. Existing Prisma schema already applied
-- 3. Backup existing database before running

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ===================================================================
-- 1. E-COMMERCE SCHEMA EXTENSIONS
-- ===================================================================

-- Enhance existing products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS brand_id VARCHAR(255) REFERENCES brands(id),
ADD COLUMN IF NOT EXISTS collection_id VARCHAR(255) REFERENCES collections(id),
ADD COLUMN IF NOT EXISTS tax_class VARCHAR(50) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS requires_shipping BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS weight_unit VARCHAR(10) DEFAULT 'lbs',
ADD COLUMN IF NOT EXISTS dimension_unit VARCHAR(10) DEFAULT 'inches',
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[],
ADD COLUMN IF NOT EXISTS availability_status VARCHAR(20) DEFAULT 'in-stock',
ADD COLUMN IF NOT EXISTS pre_order_date DATE,
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS warranty_months INT DEFAULT 12,
ADD COLUMN IF NOT EXISTS assembly_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS age_rating VARCHAR(20),
ADD COLUMN IF NOT EXISTS safety_certifications TEXT[],
ADD COLUMN IF NOT EXISTS video_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS pdf_specifications VARCHAR(500),
ADD COLUMN IF NOT EXISTS related_products TEXT[],
ADD COLUMN IF NOT EXISTS cross_sell_products TEXT[],
ADD COLUMN IF NOT EXISTS upsell_products TEXT[],
ADD COLUMN IF NOT EXISTS search_rank INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS purchase_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  website_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_is_featured ON brands(is_featured);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  banner_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  discount_percentage DECIMAL(5,2),
  product_ids TEXT[],
  sort_order VARCHAR(20) DEFAULT 'manual',
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_is_featured ON collections(is_featured);
CREATE INDEX IF NOT EXISTS idx_collections_dates ON collections(start_date, end_date);

-- Create categories table (if not exists from Prisma)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        CREATE TABLE categories (
          id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          image_url VARCHAR(500),
          parent_id VARCHAR(255) REFERENCES categories(id),
          level INT NOT NULL DEFAULT 0,
          position INT NOT NULL DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          meta_title VARCHAR(255),
          meta_description TEXT,
          seo_keywords TEXT[],
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX idx_categories_parent_id ON categories(parent_id);
        CREATE INDEX idx_categories_slug ON categories(slug);
        CREATE INDEX idx_categories_level ON categories(level);
    END IF;
END $$;

-- Product categories junction table
CREATE TABLE IF NOT EXISTS product_categories (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id VARCHAR(255) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON product_categories(category_id);

-- Pricing tiers
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_min INT NOT NULL DEFAULT 1,
  quantity_max INT,
  price_cents INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pricing_tiers_product_id ON pricing_tiers(product_id);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_quantity ON pricing_tiers(quantity_min, quantity_max);

-- Discount codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  usage_limit INT,
  usage_limit_per_customer INT DEFAULT 1,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  product_ids TEXT[],
  category_ids TEXT[],
  customer_ids TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active_dates ON discount_codes(is_active, starts_at, expires_at);

-- Discount code usage tracking
CREATE TABLE IF NOT EXISTS discount_code_usage (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  discount_code_id VARCHAR(255) NOT NULL REFERENCES discount_codes(id),
  order_id VARCHAR(255) NOT NULL REFERENCES orders(id),
  customer_id VARCHAR(255),
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discount_code_usage_code_id ON discount_code_usage(discount_code_id);
CREATE INDEX IF NOT EXISTS idx_discount_code_usage_order_id ON discount_code_usage(order_id);

-- Inventory locations
CREATE TABLE IF NOT EXISTS inventory_locations (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inventory stock
CREATE TABLE IF NOT EXISTS inventory_stock (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id VARCHAR(255) REFERENCES product_variants(id) ON DELETE CASCADE,
  location_id VARCHAR(255) NOT NULL REFERENCES inventory_locations(id),
  quantity_available INT NOT NULL DEFAULT 0,
  quantity_reserved INT NOT NULL DEFAULT 0,
  reorder_point INT DEFAULT 0,
  reorder_quantity INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, variant_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_stock_product_variant ON inventory_stock(product_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_location ON inventory_stock(location_id);

-- Inventory transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id),
  variant_id VARCHAR(255) REFERENCES product_variants(id),
  location_id VARCHAR(255) REFERENCES inventory_locations(id),
  transaction_type VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  reference_type VARCHAR(50),
  reference_id VARCHAR(255),
  reason TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_date ON inventory_transactions(created_at);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'My Wishlist',
  is_public BOOLEAN DEFAULT false,
  share_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  wishlist_id VARCHAR(255) NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id VARCHAR(255) REFERENCES product_variants(id),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(wishlist_id, product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);

-- Product questions and answers
CREATE TABLE IF NOT EXISTS product_questions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  question TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_answers (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  question_id VARCHAR(255) NOT NULL REFERENCES product_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  answered_by VARCHAR(255),
  is_helpful BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_questions_product_id ON product_questions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_questions_approved ON product_questions(is_approved);

-- ===================================================================
-- 2. USER MANAGEMENT SCHEMA EXTENSIONS
-- ===================================================================

-- Enhance existing users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Toronto',
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'CAD',
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_consent BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS login_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP,
ADD COLUMN IF NOT EXISTS account_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS lock_reason VARCHAR(255),
ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS notes TEXT;

-- User profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  company VARCHAR(255),
  job_title VARCHAR(255),
  website VARCHAR(500),
  social_links JSONB DEFAULT '{}',
  interests TEXT[],
  skills TEXT[],
  avatar_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  order_updates BOOLEAN DEFAULT true,
  promotional_emails BOOLEAN DEFAULT false,
  newsletter_subscription BOOLEAN DEFAULT true,
  new_arrivals_alert BOOLEAN DEFAULT true,
  price_drop_alert BOOLEAN DEFAULT true,
  back_in_stock_alert BOOLEAN DEFAULT true,
  order_reminder BOOLEAN DEFAULT true,
  review_requests BOOLEAN DEFAULT true,
  theme VARCHAR(20) DEFAULT 'light',
  products_per_page INT DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User groups and roles
CREATE TABLE IF NOT EXISTS user_groups (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_group_memberships (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id VARCHAR(255) NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
  assigned_by VARCHAR(255),
  assigned_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  UNIQUE(user_id, group_id)
);

CREATE INDEX IF NOT EXISTS idx_user_group_memberships_user_id ON user_group_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_group_memberships_group_id ON user_group_memberships(group_id);

-- Payment methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_payment_method_id VARCHAR(255),
  is_default BOOLEAN DEFAULT false,
  billing_address_id VARCHAR(255) REFERENCES addresses(id),
  card_last_four VARCHAR(4),
  card_brand VARCHAR(50),
  card_expiry_month INT,
  card_expiry_year INT,
  paypal_email VARCHAR(255),
  bank_account_last_four VARCHAR(4),
  bank_routing_number VARCHAR(50),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);

-- User activity logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  activity_type VARCHAR(50) NOT NULL,
  activity_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  page_url VARCHAR(1000),
  referrer_url VARCHAR(1000),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_session_id ON user_activity_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_type_date ON user_activity_logs(activity_type, created_at);

-- User segments
CREATE TABLE IF NOT EXISTS user_segments (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  user_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_segment_memberships (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  segment_id VARCHAR(255) NOT NULL REFERENCES user_segments(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, segment_id)
);

CREATE INDEX IF NOT EXISTS idx_user_segment_memberships_user_id ON user_segment_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_segment_memberships_segment_id ON user_segment_memberships(segment_id);

-- Loyalty program
CREATE TABLE IF NOT EXISTS loyalty_programs (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_per_dollar INT DEFAULT 1,
  points_for_signup INT DEFAULT 0,
  points_for_review INT DEFAULT 10,
  points_for_referral INT DEFAULT 100,
  redemption_rate DECIMAL(5,2) DEFAULT 0.01,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_loyalty (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id VARCHAR(255) NOT NULL REFERENCES loyalty_programs(id),
  points_earned INT DEFAULT 0,
  points_redeemed INT DEFAULT 0,
  points_available INT DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'bronze',
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_loyalty_id VARCHAR(255) NOT NULL REFERENCES user_loyalty(id),
  transaction_type VARCHAR(20) NOT NULL,
  points INT NOT NULL,
  reference_type VARCHAR(50),
  reference_id VARCHAR(255),
  description TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_loyalty_id ON loyalty_transactions(user_loyalty_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_type_date ON loyalty_transactions(transaction_type, created_at);

-- Referral system
CREATE TABLE IF NOT EXISTS referrals (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  referrer_id VARCHAR(255) NOT NULL REFERENCES users(id),
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_email VARCHAR(255),
  referred_id VARCHAR(255) REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
  reward_points INT DEFAULT 0,
  reward_amount DECIMAL(10,2) DEFAULT 0,
  converted_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- User notes (admin)
CREATE TABLE IF NOT EXISTS user_notes (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_id VARCHAR(255) NOT NULL REFERENCES users(id),
  note TEXT NOT NULL,
  note_type VARCHAR(20) DEFAULT 'general',
  is_internal BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_admin_id ON user_notes(admin_id);

-- Email subscriptions
CREATE TABLE IF NOT EXISTS email_subscriptions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  subscription_type VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  unsubscribe_reason TEXT,
  UNIQUE(email, subscription_type)
);

CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_type ON email_subscriptions(subscription_type);

-- ===================================================================
-- 3. BOOKING SYSTEM SCHEMA
-- ===================================================================

-- Service types
CREATE TABLE IF NOT EXISTS service_types (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  base_price_cents INT NOT NULL,
  requires_deposit BOOLEAN DEFAULT false,
  deposit_percentage DECIMAL(5,2) DEFAULT 0.2,
  cancellation_policy TEXT,
  preparation_instructions TEXT,
  what_to_bring TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  booking_window_days INT DEFAULT 30,
  min_notice_hours INT DEFAULT 24,
  max_capacity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_types_slug ON service_types(slug);
CREATE INDEX IF NOT EXISTS idx_service_types_is_active ON service_types(is_active);

-- Service providers
CREATE TABLE IF NOT EXISTS service_providers (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  bio TEXT,
  photo_url VARCHAR(500),
  specialties TEXT[],
  certifications TEXT[],
  years_experience INT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  service_area TEXT[],
  availability_json JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_is_active ON service_providers(is_active);

-- Provider services
CREATE TABLE IF NOT EXISTS provider_services (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  provider_id VARCHAR(255) NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  service_type_id VARCHAR(255) NOT NULL REFERENCES service_types(id) ON DELETE CASCADE,
  price_cents INT,
  duration_minutes INT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider_id, service_type_id)
);

CREATE INDEX IF NOT EXISTS idx_provider_services_provider_id ON provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_service_type_id ON provider_services(service_type_id);

-- Availability schedules
CREATE TABLE IF NOT EXISTS availability_schedules (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  provider_id VARCHAR(255) NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_start_time TIME,
  break_end_time TIME,
  max_appointments INT DEFAULT 1,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider_id, day_of_week, start_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_schedules_provider_id ON availability_schedules(provider_id);

-- Enhance existing blocked_dates table
ALTER TABLE blocked_dates
ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255) REFERENCES service_providers(id),
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS recurrence_pattern VARCHAR(50),
ADD COLUMN IF NOT EXISTS end_date DATE;

CREATE INDEX IF NOT EXISTS idx_blocked_dates_provider_id ON blocked_dates(provider_id);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date_range ON blocked_dates(date, is_recurring);

-- Enhance existing bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS service_type_id VARCHAR(255) REFERENCES service_types(id),
ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255) REFERENCES service_providers(id),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'website',
ADD COLUMN IF NOT EXISTS referral_source VARCHAR(255),
ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS rescheduled_from_id VARCHAR(255) REFERENCES bookings(id),
ADD COLUMN IF NOT EXISTS rescheduled_to_id VARCHAR(255) REFERENCES bookings(id),
ADD COLUMN IF NOT EXISTS google_calendar_event_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS zoom_meeting_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS zoom_join_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS customer_arrived_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS provider_started_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS provider_completed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS feedback_rating INT,
ADD COLUMN IF NOT EXISTS feedback_comment TEXT,
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS deposit_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_amount_cents INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_paid_cents INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_amount_cents INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount_cents INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount_cents INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS final_price_cents INT,
ADD COLUMN IF NOT EXISTS booking_updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_bookings_service_type_id ON bookings(service_type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status_date ON bookings(status, date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Booking attachments
CREATE TABLE IF NOT EXISTS booking_attachments (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  booking_id VARCHAR(255) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INT,
  file_type VARCHAR(100),
  description TEXT,
  uploaded_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_attachments_booking_id ON booking_attachments(booking_id);

-- Booking notes
CREATE TABLE IF NOT EXISTS booking_notes (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  booking_id VARCHAR(255) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  author_id VARCHAR(255) NOT NULL REFERENCES users(id),
  note TEXT NOT NULL,
  note_type VARCHAR(20) DEFAULT 'internal',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_notes_booking_id ON booking_notes(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_notes_author_id ON booking_notes(author_id);

-- Booking reminders
CREATE TABLE IF NOT EXISTS booking_reminders (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  booking_id VARCHAR(255) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  channel VARCHAR(20) DEFAULT 'email',
  status VARCHAR(20) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_reminders_booking_id ON booking_reminders(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_scheduled_at ON booking_reminders(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_status ON booking_reminders(status);

-- Service reviews
CREATE TABLE IF NOT EXISTS service_reviews (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  booking_id VARCHAR(255) UNIQUE NOT NULL REFERENCES bookings(id),
  customer_id VARCHAR(255) NOT NULL REFERENCES users(id),
  provider_id VARCHAR(255) NOT NULL REFERENCES service_providers(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  response TEXT,
  responded_by VARCHAR(255),
  responded_at TIMESTAMP,
  is_public BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_reviews_booking_id ON service_reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_service_reviews_provider_id ON service_reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_reviews_rating ON service_reviews(rating);

-- Service analytics
CREATE TABLE IF NOT EXISTS service_analytics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  provider_id VARCHAR(255) NOT NULL REFERENCES service_providers(id),
  service_type_id VARCHAR(255) REFERENCES service_types(id),
  date DATE NOT NULL,
  bookings_count INT DEFAULT 0,
  completed_bookings INT DEFAULT 0,
  cancelled_bookings INT DEFAULT 0,
  no_show_bookings INT DEFAULT 0,
  total_revenue_cents INT DEFAULT 0,
  average_rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider_id, service_type_id, date)
);

CREATE INDEX IF NOT EXISTS idx_service_analytics_provider_date ON service_analytics(provider_id, date);
CREATE INDEX IF NOT EXISTS idx_service_analytics_service_date ON service_analytics(service_type_id, date);

-- Service categories
CREATE TABLE IF NOT EXISTS service_categories (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_type_categories (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  service_type_id VARCHAR(255) NOT NULL REFERENCES service_types(id) ON DELETE CASCADE,
  category_id VARCHAR(255) NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(service_type_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_service_type_categories_service_id ON service_type_categories(service_type_id);
CREATE INDEX IF NOT EXISTS idx_service_type_categories_category_id ON service_type_categories(category_id);

-- ===================================================================
-- 4. CONTENT MANAGEMENT SCHEMA
-- ===================================================================

-- Enhance existing pages table
ALTER TABLE pages
ADD COLUMN IF NOT EXISTS parent_id VARCHAR(255) REFERENCES pages(id),
ADD COLUMN IF NOT EXISTS template VARCHAR(100) DEFAULT 'default',
ADD COLUMN IF NOT EXISTS author_id VARCHAR(255) REFERENCES users(id),
ADD COLUMN IF NOT EXISTS featured_image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS content_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS scheduled_unpublish_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS password_protected BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS password VARCHAR(255),
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'public',
ADD COLUMN IF NOT EXISTS page_updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_published_at ON pages(published_at);

-- Enhance existing blog_posts table
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS author_id VARCHAR(255) REFERENCES users(id),
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS featured_image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS content_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS estimated_read_time INT,
ADD COLUMN IF NOT EXISTS table_of_contents JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[],
ADD COLUMN IF NOT EXISTS schema_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS structured_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'public',
ADD COLUMN IF NOT EXISTS password VARCHAR(255),
ADD COLUMN IF NOT EXISTS blog_updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Blog categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  parent_id VARCHAR(255) REFERENCES blog_categories(id),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_categories_parent_id ON blog_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- Update blog_posts to reference blog_categories
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS category_id VARCHAR(255) REFERENCES blog_categories(id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);

-- Content blocks (reusable)
CREATE TABLE IF NOT EXISTS content_blocks (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  is_global BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_blocks_slug ON content_blocks(slug);
CREATE INDEX IF NOT EXISTS idx_content_blocks_type ON content_blocks(type);
CREATE INDEX IF NOT EXISTS idx_content_blocks_is_global ON content_blocks(is_global);

-- Media library
CREATE TABLE IF NOT EXISTS media_items (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INT NOT NULL,
  width INT,
  height INT,
  duration_seconds INT,
  alt_text VARCHAR(255),
  caption TEXT,
  description TEXT,
  folder_path VARCHAR(500),
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  uploaded_by VARCHAR(255) REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_items_mime_type ON media_items(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_items_folder_path ON media_items(folder_path);
CREATE INDEX IF NOT EXISTS idx_media_items_uploaded_by ON media_items(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_items_tags ON media_items USING GIN(tags);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_company VARCHAR(255),
  customer_title VARCHAR(255),
  customer_avatar_url VARCHAR(500),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT NOT NULL,
  product_id VARCHAR(255) REFERENCES products(id),
  service_id VARCHAR(255) REFERENCES service_types(id),
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verification_date DATE,
  source VARCHAR(50),
  source_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_product_id ON testimonials(product_id);

-- FAQ categories
CREATE TABLE IF NOT EXISTS faq_categories (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_categories_slug ON faq_categories(slug);

-- FAQ items
CREATE TABLE IF NOT EXISTS faq_items (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  category_id VARCHAR(255) NOT NULL REFERENCES faq_categories(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  view_count INT DEFAULT 0,
  helpful_count INT DEFAULT 0,
  not_helpful_count INT DEFAULT 0,
  product_id VARCHAR(255) REFERENCES products(id),
  service_id VARCHAR(255) REFERENCES service_types(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_items_category_id ON faq_items(category_id);
CREATE INDEX IF NOT EXISTS idx_faq_items_is_active ON faq_items(is_active);
CREATE INDEX IF NOT EXISTS idx_faq_items_product_id ON faq_items(product_id);

-- FAQ feedback
CREATE TABLE IF NOT EXISTS faq_feedback (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  faq_item_id VARCHAR(255) NOT NULL REFERENCES faq_items(id),
  feedback_type VARCHAR(10) NOT NULL,
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  email VARCHAR(255),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_feedback_faq_item_id ON faq_feedback(faq_item_id);

-- Dynamic content
CREATE TABLE IF NOT EXISTS dynamic_content (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  content JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  version INT DEFAULT 1,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dynamic_content_key ON dynamic_content(key);
CREATE INDEX IF NOT EXISTS idx_dynamic_content_is_active ON dynamic_content(is_active);

-- Content revisions
CREATE TABLE IF NOT EXISTS content_revisions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  content_type VARCHAR(50) NOT NULL,
  content_id VARCHAR(255) NOT NULL,
  version INT NOT NULL,
  title VARCHAR(255),
  content TEXT,
  content_json JSONB,
  author_id VARCHAR(255) REFERENCES users(id),
  change_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_revisions_content ON content_revisions(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_revisions_author_id ON content_revisions(author_id);

-- Menu system
CREATE TABLE IF NOT EXISTS menus (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  location VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  menu_id VARCHAR(255) NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  parent_id VARCHAR(255) REFERENCES menu_items(id),
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  page_id VARCHAR(255) REFERENCES pages(id),
  target VARCHAR(20) DEFAULT '_self',
  css_class VARCHAR(255),
  rel VARCHAR(255),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_order ON menu_items(menu_id, parent_id, order_index);

-- SEO URLs
CREATE TABLE IF NOT EXISTS seo_urls (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  url VARCHAR(500) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id VARCHAR(255) NOT NULL,
  is_canonical BOOLEAN DEFAULT false,
  redirect_code INT DEFAULT 301,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_urls_url ON seo_urls(url);
CREATE INDEX IF NOT EXISTS idx_seo_urls_target ON seo_urls(target_type, target_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_urls_unique_url ON seo_urls(url);

-- ===================================================================
-- 5. ANALYTICS SCHEMA
-- ===================================================================

-- User events (partitioned table)
CREATE TABLE IF NOT EXISTS user_events (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  event_type VARCHAR(50) NOT NULL,
  event_category VARCHAR(50),
  event_action VARCHAR(100),
  event_label VARCHAR(500),
  event_value DECIMAL(10,2),
  properties JSONB DEFAULT '{}',
  page_url VARCHAR(1000),
  referrer_url VARCHAR(1000),
  ip_address INET,
  user_agent TEXT,
  platform VARCHAR(50),
  browser VARCHAR(50),
  browser_version VARCHAR(50),
  os VARCHAR(50),
  os_version VARCHAR(50),
  device_type VARCHAR(50),
  screen_resolution VARCHAR(20),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create current month partition
CREATE TABLE IF NOT EXISTS user_events_current PARTITION OF user_events
FOR VALUES FROM (CURRENT_DATE - INTERVAL '1 month') TO (CURRENT_DATE + INTERVAL '1 month');

CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type_date ON user_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);

-- Page views (partitioned table)
CREATE TABLE IF NOT EXISTS page_views (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  url VARCHAR(1000) NOT NULL,
  title VARCHAR(500),
  referrer_url VARCHAR(1000),
  time_on_page_seconds INT,
  viewport_width INT,
  viewport_height INT,
  scroll_depth_percentage INT,
  is_bounce BOOLEAN DEFAULT false,
  entry_timestamp TIMESTAMP DEFAULT NOW(),
  exit_timestamp TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create current month partition
CREATE TABLE IF NOT EXISTS page_views_current PARTITION OF page_views
FOR VALUES FROM (CURRENT_DATE - INTERVAL '1 month') TO (CURRENT_DATE + INTERVAL '1 month');

CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_url_date ON page_views(url, created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON page_views(user_id);

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(255) REFERENCES users(id),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  duration_seconds INT,
  page_views_count INT DEFAULT 0,
  events_count INT DEFAULT 0,
  is_bounce BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10,2) DEFAULT 0,
  has_conversion BOOLEAN DEFAULT false,
  ip_address INET,
  country VARCHAR(2),
  region VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  device_type VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  referrer_domain VARCHAR(255),
  referrer_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_country ON user_sessions(country);

-- E-commerce events
CREATE TABLE IF NOT EXISTS ecommerce_events (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  event_type VARCHAR(50) NOT NULL,
  product_id VARCHAR(255) REFERENCES products(id),
  variant_id VARCHAR(255) REFERENCES product_variants(id),
  order_id VARCHAR(255) REFERENCES orders(id),
  quantity INT,
  price_cents INT,
  currency VARCHAR(3) DEFAULT 'CAD',
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ecommerce_events_product_id ON ecommerce_events(product_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_events_order_id ON ecommerce_events(order_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_events_type_date ON ecommerce_events(event_type, created_at);

-- Product analytics
CREATE TABLE IF NOT EXISTS product_analytics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id),
  date DATE NOT NULL,
  views_count INT DEFAULT 0,
  unique_views_count INT DEFAULT 0,
  add_to_cart_count INT DEFAULT 0,
  cart_removal_count INT DEFAULT 0,
  checkout_count INT DEFAULT 0,
  purchase_count INT DEFAULT 0,
  revenue_cents INT DEFAULT 0,
  average_time_on_page INT DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, date)
);

CREATE INDEX IF NOT EXISTS idx_product_analytics_product_date ON product_analytics(product_id, date);
CREATE INDEX IF NOT EXISTS idx_product_analytics_date ON product_analytics(date);

-- Conversion tracking
CREATE TABLE IF NOT EXISTS conversions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  conversion_type VARCHAR(50) NOT NULL,
  conversion_value DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'CAD',
  order_id VARCHAR(255) REFERENCES orders(id),
  booking_id VARCHAR(255) REFERENCES bookings(id),
  lead_id VARCHAR(255),
  properties JSONB DEFAULT '{}',
  attribution_model VARCHAR(20) DEFAULT 'last_click',
  attributed_touch_id VARCHAR(255),
  touch_points JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_session_id ON conversions(session_id);
CREATE INDEX IF NOT EXISTS idx_conversions_type_date ON conversions(conversion_type, created_at);

-- Funnel analytics
CREATE TABLE IF NOT EXISTS funnel_steps (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  funnel_name VARCHAR(255) NOT NULL,
  step_name VARCHAR(255) NOT NULL,
  step_order INT NOT NULL,
  step_description TEXT,
  definition JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(funnel_name, step_order)
);

CREATE TABLE IF NOT EXISTS funnel_analytics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  funnel_name VARCHAR(255) NOT NULL,
  step_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  users_entered INT DEFAULT 0,
  users_completed INT DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  average_time_to_complete INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(funnel_name, step_name, date)
);

CREATE INDEX IF NOT EXISTS idx_funnel_analytics_funnel_date ON funnel_analytics(funnel_name, date);

-- A/B testing
CREATE TABLE IF NOT EXISTS experiments (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  hypothesis TEXT,
  success_metric VARCHAR(255),
  confidence_level DECIMAL(5,2) DEFAULT 95.0,
  traffic_percentage DECIMAL(5,2) DEFAULT 100.0,
  start_date DATE,
  end_date DATE,
  winning_variant VARCHAR(255),
  statistical_significance BOOLEAN DEFAULT false,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiment_variants (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  experiment_id VARCHAR(255) NOT NULL REFERENCES experiments(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  configuration JSONB NOT NULL,
  traffic_split DECIMAL(5,2) DEFAULT 50.0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  conversion_count INT DEFAULT 0,
  participant_count INT DEFAULT 0,
  is_control BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiment_participants (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  experiment_id VARCHAR(255) NOT NULL REFERENCES experiments(id),
  variant_id VARCHAR(255) NOT NULL REFERENCES experiment_variants(id),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  converted BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10,2),
  participated_at TIMESTAMP DEFAULT NOW(),
  converted_at TIMESTAMP,
  UNIQUE(experiment_id, COALESCE(user_id, session_id))
);

CREATE INDEX IF NOT EXISTS idx_experiment_participants_experiment_id ON experiment_participants(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_participants_variant_id ON experiment_participants(variant_id);

-- Search analytics
CREATE TABLE IF NOT EXISTS search_analytics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  query VARCHAR(255) NOT NULL,
  normalized_query VARCHAR(255),
  result_count INT NOT NULL,
  clicked_result_position INT,
  clicked_result_type VARCHAR(50),
  clicked_result_id VARCHAR(255),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  has_conversion BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10,2),
  search_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_analytics_query_date ON search_analytics(query, search_date);
CREATE INDEX IF NOT EXISTS idx_search_analytics_normalized_query ON search_analytics(normalized_query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_search_date ON search_analytics(search_date);

-- Performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  metric_type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20),
  url VARCHAR(1000),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_type_date ON performance_metrics(metric_type, created_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name_date ON performance_metrics(name, created_at);

-- Revenue analytics
CREATE TABLE IF NOT EXISTS revenue_analytics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  date DATE NOT NULL,
  currency VARCHAR(3) DEFAULT 'CAD',
  gross_revenue_cents INT DEFAULT 0,
  net_revenue_cents INT DEFAULT 0,
  orders_count INT DEFAULT 0,
  average_order_value_cents INT DEFAULT 0,
  returns_count INT DEFAULT 0,
  returns_amount_cents INT DEFAULT 0,
  discounts_amount_cents INT DEFAULT 0,
  shipping_amount_cents INT DEFAULT 0,
  tax_amount_cents INT DEFAULT 0,
  refunds_amount_cents INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, currency)
);

CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(date);

-- Customer segments analytics
CREATE TABLE IF NOT EXISTS segment_analytics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  segment_id VARCHAR(255) NOT NULL REFERENCES user_segments(id),
  date DATE NOT NULL,
  user_count INT DEFAULT 0,
  active_users INT DEFAULT 0,
  new_users INT DEFAULT 0,
  churned_users INT DEFAULT 0,
  total_revenue_cents INT DEFAULT 0,
  average_revenue_per_user DECIMAL(10,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(segment_id, date)
);

CREATE INDEX IF NOT EXISTS idx_segment_analytics_segment_date ON segment_analytics(segment_id, date);

-- Cohort analysis
CREATE TABLE IF NOT EXISTS cohort_analytics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  cohort_date DATE NOT NULL,
  period_number INT NOT NULL,
  period_type VARCHAR(20) DEFAULT 'month',
  user_count INT DEFAULT 0,
  active_user_count INT DEFAULT 0,
  retention_rate DECIMAL(5,2) DEFAULT 0,
  revenue_cents INT DEFAULT 0,
  average_revenue_per_user DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(cohort_date, period_number, period_type)
);

CREATE INDEX IF NOT EXISTS idx_cohort_analytics_cohort_date ON cohort_analytics(cohort_date);
CREATE INDEX IF NOT EXISTS idx_cohort_analytics_period ON cohort_analytics(period_number);

-- Heatmap data
CREATE TABLE IF NOT EXISTS heatmap_data (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  url VARCHAR(1000) NOT NULL,
  viewport_width INT NOT NULL,
  viewport_height INT NOT NULL,
  click_x INT NOT NULL,
  click_y INT NOT NULL,
  element_selector VARCHAR(500),
  element_text VARCHAR(255),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_heatmap_data_url_date ON heatmap_data(url, created_at);

-- Error tracking
CREATE TABLE IF NOT EXISTS error_logs (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  error_type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  stack_trace TEXT,
  url VARCHAR(1000),
  user_agent TEXT,
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  context JSONB DEFAULT '{}',
  severity VARCHAR(20) DEFAULT 'error',
  resolved BOOLEAN DEFAULT false,
  resolved_by VARCHAR(255),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_error_logs_type_date ON error_logs(error_type, created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);

-- ===================================================================
-- 6. PERFORMANCE OPTIMIZATIONS
-- ===================================================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_category_status ON products(category, status);
CREATE INDEX IF NOT EXISTS idx_products_featured_status ON products(featured, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_products_price_range ON products(price, sale_price) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_orders_user_date ON orders(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_product ON order_items(order_id, product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_product ON cart_items(cart_id, product_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(
  to_tsvector('english', name || ' ' || description || ' ' || array_to_string(features, ' ') || ' ' || array_to_string(tags, ' '))
);

-- Partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_active_products ON products(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_pending_orders ON orders(id) WHERE fulfillment_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_unread_reviews ON reviews(id) WHERE status = 'pending';

-- JSONB indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_users_preferences ON users USING GIN(preferences);
CREATE INDEX IF NOT EXISTS idx_products_dimensions ON products USING GIN(dimensions);

-- ===================================================================
-- 7. SECURITY FEATURES
-- ===================================================================

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(255) NOT NULL,
  operation VARCHAR(10) NOT NULL,
  user_id VARCHAR(255) REFERENCES users(id),
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, old_values)
    VALUES (TG_TABLE_NAME, TG_OP, current_setting('app.current_user_id', true)::VARCHAR(255), row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, old_values, new_values)
    VALUES (TG_TABLE_NAME, TG_OP, current_setting('app.current_user_id', true)::VARCHAR(255), row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, new_values)
    VALUES (TG_TABLE_NAME, TG_OP, current_setting('app.current_user_id', true)::VARCHAR(255), row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables (run these individually as needed)
-- CREATE TRIGGER audit_users_trigger AFTER INSERT OR UPDATE OR DELETE ON users
-- FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- ===================================================================
-- 8. STORED PROCEDURES & FUNCTIONS
-- ===================================================================

-- Function to calculate daily revenue
CREATE OR REPLACE FUNCTION calculate_daily_revenue(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
  INSERT INTO revenue_analytics (
    date, gross_revenue_cents, net_revenue_cents, orders_count,
    average_order_value_cents, returns_amount_cents, discounts_amount_cents,
    shipping_amount_cents, tax_amount_cents, refunds_amount_cents
  )
  SELECT
    target_date,
    COALESCE(SUM(total), 0) as gross_revenue_cents,
    COALESCE(SUM(total - COALESCE(refund_amount, 0)), 0) as net_revenue_cents,
    COUNT(*) as orders_count,
    COALESCE(AVG(total), 0) as average_order_value_cents,
    COALESCE(SUM(COALESCE(refund_amount, 0)), 0) as returns_amount_cents,
    COALESCE(SUM(discount), 0) as discounts_amount_cents,
    COALESCE(SUM(shipping_cost), 0) as shipping_amount_cents,
    COALESCE(SUM(tax), 0) as tax_amount_cents,
    COALESCE(SUM(COALESCE(refund_amount, 0)), 0) as refunds_amount_cents
  FROM orders
  WHERE DATE(created_at) = target_date
    AND payment_status = 'paid'
  ON CONFLICT (date, currency) DO UPDATE SET
    gross_revenue_cents = EXCLUDED.gross_revenue_cents,
    net_revenue_cents = EXCLUDED.net_revenue_cents,
    orders_count = EXCLUDED.orders_count,
    average_order_value_cents = EXCLUDED.average_order_value_cents,
    returns_amount_cents = EXCLUDED.returns_amount_cents,
    discounts_amount_cents = EXCLUDED.discounts_amount_cents,
    shipping_amount_cents = EXCLUDED.shipping_amount_cents,
    tax_amount_cents = EXCLUDED.tax_amount_cents,
    refunds_amount_cents = EXCLUDED.refunds_amount_cents;
END;
$$ LANGUAGE plpgsql;

-- Function to update product analytics
CREATE OR REPLACE FUNCTION update_product_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
  INSERT INTO product_analytics (
    product_id, date, views_count, add_to_cart_count, purchase_count, revenue_cents
  )
  SELECT
    product_id,
    target_date,
    COUNT(*) FILTER (WHERE event_type = 'product_view') as views_count,
    COUNT(*) FILTER (WHERE event_type = 'add_to_cart') as add_to_cart_count,
    COUNT(*) FILTER (WHERE event_type = 'purchase') as purchase_count,
    COALESCE(SUM(CASE WHEN event_type = 'purchase' THEN price_cents * quantity ELSE 0 END), 0) as revenue_cents
  FROM ecommerce_events
  WHERE DATE(created_at) = target_date
    AND product_id IS NOT NULL
  GROUP BY product_id
  ON CONFLICT (product_id, date) DO UPDATE SET
    views_count = EXCLUDED.views_count,
    add_to_cart_count = EXCLUDED.add_to_cart_count,
    purchase_count = EXCLUDED.purchase_count,
    revenue_cents = EXCLUDED.revenue_cents;
END;
$$ LANGUAGE plpgsql;

-- Function to update inventory with low stock notification
CREATE OR REPLACE FUNCTION update_inventory_with_notification()
RETURNS TRIGGER AS $$
DECLARE
  reorder_threshold INT;
BEGIN
  -- Get reorder threshold from products table
  SELECT low_stock_threshold INTO reorder_threshold
  FROM products
  WHERE id = NEW.product_id;

  -- Check if quantity is below threshold
  IF NEW.quantity_available <= reorder_threshold THEN
    -- Send low stock notification
    PERFORM pg_notify('low_stock', json_build_object(
      'product_id', NEW.product_id,
      'variant_id', NEW.variant_id,
      'location_id', NEW.location_id,
      'current_quantity', NEW.quantity_available,
      'reorder_point', reorder_threshold
    )::text);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to inventory_stock table
CREATE TRIGGER inventory_low_stock_trigger
AFTER UPDATE ON inventory_stock
FOR EACH ROW
WHEN (NEW.quantity_available <> OLD.quantity_available)
EXECUTE FUNCTION update_inventory_with_notification();

-- ===================================================================
-- 9. FINAL SETUP
-- ===================================================================

-- Update table statistics
ANALYZE;

-- Create function for periodic maintenance
CREATE OR REPLACE FUNCTION maintenance_routine()
RETURNS VOID AS $$
BEGIN
  -- Update analytics
  PERFORM calculate_daily_revenue(CURRENT_DATE - INTERVAL '1 day');
  PERFORM update_product_analytics(CURRENT_DATE - INTERVAL '1 day');

  -- Clean old analytics data (keep 2 years)
  DELETE FROM user_events WHERE created_at < CURRENT_DATE - INTERVAL '2 years';
  DELETE FROM page_views WHERE created_at < CURRENT_DATE - INTERVAL '2 years';

  -- Update table statistics
  ANALYZE;

  RAISE NOTICE 'Maintenance routine completed successfully';
END;
$$ LANGUAGE plpgsql;

-- Create a cron job function to run maintenance (example)
-- This would be set up externally using pg_cron or system cron
-- SELECT cron.schedule('maintenance', '0 2 * * *', 'SELECT maintenance_routine();');

-- Grant necessary permissions (adjust as needed)
-- GRANT USAGE ON SCHEMA public TO pgclosets_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pgclosets_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pgclosets_app;

COMMIT;

-- ===================================================================
-- MIGRATION COMPLETE
-- ===================================================================
-- Next steps:
-- 1. Update Prisma schema file with new tables
-- 2. Run Prisma generate and db push
-- 3. Update application code to use new schema
-- 4. Set up monitoring and backup procedures
-- 5. Test all functionality thoroughly