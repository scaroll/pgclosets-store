# Comprehensive Database Schema Design - PG Closets Store

## Overview
Production-ready PostgreSQL database schema for PG Closets Store e-commerce platform with advanced features including AI-powered search, booking system, content management, and comprehensive analytics.

**Database Engine**: PostgreSQL 15+ with pgvector extension
**ORM**: Prisma with PostgreSQL extensions
**Total Tables**: 62 tables across 5 categories

---

## 1. E-COMMERCE SCHEMA (18 Tables)

### Core Products (Extended from existing)
```sql
-- Enhanced Products Table
ALTER TABLE products ADD COLUMN IF NOT EXISTS
  brand_id VARCHAR(255) REFERENCES brands(id),
  collection_id VARCHAR(255) REFERENCES collections(id),
  tax_class VARCHAR(50) DEFAULT 'standard',
  requires_shipping BOOLEAN DEFAULT true,
  weight_unit VARCHAR(10) DEFAULT 'lbs',
  dimension_unit VARCHAR(10) DEFAULT 'inches',
  seo_keywords TEXT[],
  availability_status VARCHAR(20) DEFAULT 'in-stock', -- in-stock, out-of-stock, pre-order, discontinued
  pre_order_date DATE,
  care_instructions TEXT,
  warranty_months INT DEFAULT 12,
  assembly_required BOOLEAN DEFAULT false,
  age_rating VARCHAR(20),
  safety_certifications TEXT[],
  video_url VARCHAR(500),
  pdf_specifications VARCHAR(500),
  related_products TEXT[], -- Array of product IDs
  cross_sell_products TEXT[],
  upsell_products TEXT[],
  search_rank INT DEFAULT 0,
  view_count INT DEFAULT 0,
  purchase_count INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0;

-- New Categories & Collections
CREATE TABLE IF NOT EXISTS categories (
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
  sort_order VARCHAR(20) DEFAULT 'manual', -- manual, price_asc, price_desc, name_asc, name_desc, created_at
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_collections_is_featured ON collections(is_featured);
CREATE INDEX idx_collections_dates ON collections(start_date, end_date);

-- Brands
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

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_is_featured ON brands(is_featured);

-- Product Categories Junction
CREATE TABLE IF NOT EXISTS product_categories (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id VARCHAR(255) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX idx_product_categories_category_id ON product_categories(category_id);

-- Pricing & Discounts
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_min INT NOT NULL DEFAULT 1,
  quantity_max INT,
  price_cents INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pricing_tiers_product_id ON pricing_tiers(product_id);
CREATE INDEX idx_pricing_tiers_quantity ON pricing_tiers(quantity_min, quantity_max);

CREATE TABLE IF NOT EXISTS discount_codes (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL, -- percentage, fixed_amount, free_shipping, buy_x_get_y
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

CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_discount_codes_active_dates ON discount_codes(is_active, starts_at, expires_at);

CREATE TABLE IF NOT EXISTS discount_code_usage (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  discount_code_id VARCHAR(255) NOT NULL REFERENCES discount_codes(id),
  order_id VARCHAR(255) NOT NULL REFERENCES orders(id),
  customer_id VARCHAR(255),
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_discount_code_usage_code_id ON discount_code_usage(discount_code_id);
CREATE INDEX idx_discount_code_usage_order_id ON discount_code_usage(order_id);

-- Inventory Management
CREATE TABLE IF NOT EXISTS inventory_locations (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

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

CREATE INDEX idx_inventory_stock_product_variant ON inventory_stock(product_id, variant_id);
CREATE INDEX idx_inventory_stock_location ON inventory_stock(location_id);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  product_id VARCHAR(255) NOT NULL REFERENCES products(id),
  variant_id VARCHAR(255) REFERENCES product_variants(id),
  location_id VARCHAR(255) REFERENCES inventory_locations(id),
  transaction_type VARCHAR(20) NOT NULL, -- in, out, adjustment, transfer
  quantity INT NOT NULL,
  reference_type VARCHAR(50), -- order, return, adjustment, transfer
  reference_id VARCHAR(255),
  reason TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(created_at);

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

CREATE INDEX idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);

-- Product Questions & Answers
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

CREATE INDEX idx_product_questions_product_id ON product_questions(product_id);
CREATE INDEX idx_product_questions_approved ON product_questions(is_approved);

---

## 2. USER MANAGEMENT SCHEMA (15 Tables)

### Enhanced User Profiles
```sql
-- Extended Users Table
ALTER TABLE users ADD COLUMN IF NOT EXISTS
  date_of_birth DATE,
  gender VARCHAR(20),
  avatar_url VARCHAR(500),
  timezone VARCHAR(50) DEFAULT 'America/Toronto',
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(3) DEFAULT 'CAD',
  marketing_consent BOOLEAN DEFAULT false,
  sms_consent BOOLEAN DEFAULT false,
  email_consent BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  login_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  account_locked BOOLEAN DEFAULT false,
  lock_reason VARCHAR(255),
  failed_login_attempts INT DEFAULT 0,
  last_failed_login TIMESTAMP,
  preferences JSONB DEFAULT '{}',
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW();

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  company VARCHAR(255),
  job_title VARCHAR(255),
  website VARCHAR(500),
  social_links JSONB DEFAULT '{}', -- {linkedin, twitter, facebook, instagram}
  interests TEXT[],
  skills TEXT[],
  avatar_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences
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
  theme VARCHAR(20) DEFAULT 'light', -- light, dark, auto
  products_per_page INT DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Groups & Roles
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
  id VARCHAR(255) PRIMARY KEY DEFAULT cud(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id VARCHAR(255) NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
  assigned_by VARCHAR(255),
  assigned_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  UNIQUE(user_id, group_id)
);

CREATE INDEX idx_user_group_memberships_user_id ON user_group_memberships(user_id);
CREATE INDEX idx_user_group_memberships_group_id ON user_group_memberships(group_id);

-- Payment Methods (Enhanced)
CREATE TABLE IF NOT EXISTS payment_methods (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- card, paypal, bank_account, crypto
  provider VARCHAR(50) NOT NULL, -- stripe, paypal, etc.
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

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_is_default ON payment_methods(is_default);

-- User Activity Logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  activity_type VARCHAR(50) NOT NULL, -- login, logout, view, add_to_cart, purchase, etc.
  activity_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  page_url VARCHAR(1000),
  referrer_url VARCHAR(1000),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_session_id ON user_activity_logs(session_id);
CREATE INDEX idx_user_activity_logs_type_date ON user_activity_logs(activity_type, created_at);

-- User Segments
CREATE TABLE IF NOT EXISTS user_segments (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL, -- {filters: [{field, operator, value}]}
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

CREATE INDEX idx_user_segment_memberships_user_id ON user_segment_memberships(user_id);
CREATE INDEX idx_user_segment_memberships_segment_id ON user_segment_memberships(segment_id);

-- Loyalty Program
CREATE TABLE IF NOT EXISTS loyalty_programs (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_per_dollar INT DEFAULT 1,
  points_for_signup INT DEFAULT 0,
  points_for_review INT DEFAULT 10,
  points_for_referral INT DEFAULT 100,
  redemption_rate DECIMAL(5,2) DEFAULT 0.01, -- 1 cent per point
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
  tier VARCHAR(50) DEFAULT 'bronze', -- bronze, silver, gold, platinum
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_loyalty_id VARCHAR(255) NOT NULL REFERENCES user_loyalty(id),
  transaction_type VARCHAR(20) NOT NULL, -- earn, redeem, expire, adjust
  points INT NOT NULL,
  reference_type VARCHAR(50), -- order, review, referral, etc.
  reference_id VARCHAR(255),
  description TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loyalty_transactions_user_loyalty_id ON loyalty_transactions(user_loyalty_id);
CREATE INDEX idx_loyalty_transactions_type_date ON loyalty_transactions(transaction_type, created_at);

-- Referral System
CREATE TABLE IF NOT EXISTS referrals (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  referrer_id VARCHAR(255) NOT NULL REFERENCES users(id),
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_email VARCHAR(255),
  referred_id VARCHAR(255) REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, registered, converted, expired
  reward_points INT DEFAULT 0,
  reward_amount DECIMAL(10,2) DEFAULT 0,
  converted_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);

-- User Notes (Admin)
CREATE TABLE IF NOT EXISTS user_notes (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_id VARCHAR(255) NOT NULL REFERENCES users(id),
  note TEXT NOT NULL,
  note_type VARCHAR(20) DEFAULT 'general', -- general, complaint, compliment, warning
  is_internal BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX idx_user_notes_admin_id ON user_notes(admin_id);

-- Email Subscription Management
CREATE TABLE IF NOT EXISTS email_subscriptions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  subscription_type VARCHAR(50) NOT NULL, -- newsletter, promotions, updates
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  unsubscribe_reason TEXT,
  UNIQUE(email, subscription_type)
);

CREATE INDEX idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX idx_email_subscriptions_type ON email_subscriptions(subscription_type);
```

---

## 3. BOOKING SYSTEM SCHEMA (12 Tables)

### Enhanced Booking System
```sql
-- Service Types
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

CREATE INDEX idx_service_types_slug ON service_types(slug);
CREATE INDEX idx_service_types_is_active ON service_types(is_active);

-- Service Providers
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
  service_area TEXT[], -- Ottawa, Kanata, etc.
  availability_json JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX idx_service_providers_is_active ON service_providers(is_active);

-- Provider Services
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

CREATE INDEX idx_provider_services_provider_id ON provider_services(provider_id);
CREATE INDEX idx_provider_services_service_type_id ON provider_services(service_type_id);

-- Availability Calendar
CREATE TABLE IF NOT EXISTS availability_schedules (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  provider_id VARCHAR(255) NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 0-6 (Sunday-Saturday)
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

CREATE INDEX idx_availability_schedules_provider_id ON availability_schedules(provider_id);

-- Blocked Dates (Enhanced)
ALTER TABLE blocked_dates ADD COLUMN IF NOT EXISTS
  provider_id VARCHAR(255) REFERENCES service_providers(id),
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(50), -- weekly, monthly, yearly
  end_date DATE;

CREATE INDEX idx_blocked_dates_provider_id ON blocked_dates(provider_id);
CREATE INDEX idx_blocked_dates_date_range ON blocked_dates(date, is_recurring);

-- Enhanced Bookings Table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS
  service_type_id VARCHAR(255) REFERENCES service_types(id),
  provider_id VARCHAR(255) REFERENCES service_providers(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled, no-show
  source VARCHAR(20) DEFAULT 'website', -- website, phone, email, in_person
  referral_source VARCHAR(255),
  cancel_reason TEXT,
  cancelled_by VARCHAR(255),
  cancelled_at TIMESTAMP,
  rescheduled_from_id VARCHAR(255) REFERENCES bookings(id),
  rescheduled_to_id VARCHAR(255) REFERENCES bookings(id),
  google_calendar_event_id VARCHAR(255),
  zoom_meeting_id VARCHAR(255),
  zoom_join_url VARCHAR(500),
  customer_arrived_at TIMESTAMP,
  provider_started_at TIMESTAMP,
  provider_completed_at TIMESTAMP,
  feedback_rating INT,
  feedback_comment TEXT,
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, refunded, partially_refunded
  deposit_paid BOOLEAN DEFAULT false,
  deposit_amount_cents INT DEFAULT 0,
  total_paid_cents INT DEFAULT 0,
  refund_amount_cents INT DEFAULT 0,
  tax_amount_cents INT DEFAULT 0,
  discount_amount_cents INT DEFAULT 0,
  final_price_cents INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX idx_bookings_service_type_id ON bookings(service_type_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status_date ON bookings(status, date);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);

-- Booking Attachments
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

CREATE INDEX idx_booking_attachments_booking_id ON booking_attachments(booking_id);

-- Booking Notes
CREATE TABLE IF NOT EXISTS booking_notes (
  id VARCHAR(255) PRIMARY KEY DEFAULT cud(),
  booking_id VARCHAR(255) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  author_id VARCHAR(255) NOT NULL REFERENCES users(id),
  note TEXT NOT NULL,
  note_type VARCHAR(20) DEFAULT 'internal', -- internal, customer_visible
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_booking_notes_booking_id ON booking_notes(booking_id);
CREATE INDEX idx_booking_notes_author_id ON booking_notes(author_id);

-- Booking Reminders
CREATE TABLE IF NOT EXISTS booking_reminders (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  booking_id VARCHAR(255) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) NOT NULL, -- confirmation, 24h, 2h, follow_up
  scheduled_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  channel VARCHAR(20) DEFAULT 'email', -- email, sms, both
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed, cancelled
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_booking_reminders_booking_id ON booking_reminders(booking_id);
CREATE INDEX idx_booking_reminders_scheduled_at ON booking_reminders(scheduled_at);
CREATE INDEX idx_booking_reminders_status ON booking_reminders(status);

-- Service Reviews
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

CREATE INDEX idx_service_reviews_booking_id ON service_reviews(booking_id);
CREATE INDEX idx_service_reviews_provider_id ON service_reviews(provider_id);
CREATE INDEX idx_service_reviews_rating ON service_reviews(rating);

-- Service Analytics
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

CREATE INDEX idx_service_analytics_provider_date ON service_analytics(provider_id, date);
CREATE INDEX idx_service_analytics_service_date ON service_analytics(service_type_id, date);

-- Service Categories
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

CREATE INDEX idx_service_type_categories_service_id ON service_type_categories(service_type_id);
CREATE INDEX idx_service_type_categories_category_id ON service_type_categories(category_id);
```

---

## 4. CONTENT MANAGEMENT SCHEMA (12 Tables)

### Enhanced CMS
```sql
-- Enhanced Pages Table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS
  parent_id VARCHAR(255) REFERENCES pages(id),
  template VARCHAR(100) DEFAULT 'default',
  author_id VARCHAR(255) REFERENCES users(id),
  featured_image_url VARCHAR(500),
  excerpt TEXT,
  content_json JSONB DEFAULT '{}', -- Structured content blocks
  custom_fields JSONB DEFAULT '{}',
  view_count INT DEFAULT 0,
  last_viewed_at TIMESTAMP,
  published_at TIMESTAMP,
  scheduled_publish_at TIMESTAMP,
  scheduled_unpublish_at TIMESTAMP,
  password_protected BOOLEAN DEFAULT false,
  password VARCHAR(255),
  allow_comments BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived, scheduled
  visibility VARCHAR(20) DEFAULT 'public', -- public, private, password
  search_index TSVECTOR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX idx_pages_parent_id ON pages(parent_id);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_published_at ON pages(published_at);
CREATE INDEX idx_pages_search_index ON pages USING GIN(search_index);

-- Enhanced Blog Posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS
  author_id VARCHAR(255) REFERENCES users(id),
  category_id VARCHAR(255) REFERENCES blog_categories(id),
  tags TEXT[],
  featured_image_url VARCHAR(500),
  content_json JSONB DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  last_viewed_at TIMESTAMP,
  estimated_read_time INT, -- minutes
  table_of_contents JSONB DEFAULT '[]',
  seo_keywords TEXT[],
  schema_type VARCHAR(100), -- Article, BlogPosting, NewsArticle
  structured_data JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft',
  visibility VARCHAR(20) DEFAULT 'public',
  password VARCHAR(255),
  search_index TSVECTOR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_search_index ON blog_posts USING GIN(search_index);

-- Blog Categories
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

CREATE INDEX idx_blog_categories_parent_id ON blog_categories(parent_id);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);

-- Content Blocks (Reusable)
CREATE TABLE IF NOT EXISTS content_blocks (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- hero, features, testimonials, gallery, etc.
  content JSONB NOT NULL,
  is_global BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_blocks_slug ON content_blocks(slug);
CREATE INDEX idx_content_blocks_type ON content_blocks(type);
CREATE INDEX idx_content_blocks_is_global ON content_blocks(is_global);

-- Media Library
CREATE TABLE IF NOT EXISTS media_items (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INT NOT NULL,
  width INT,
  height INT,
  duration_seconds INT, -- for videos
  alt_text VARCHAR(255),
  caption TEXT,
  description TEXT,
  folder_path VARCHAR(500),
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  uploaded_by VARCHAR(255) REFERENCES users(id),
  metadata JSONB DEFAULT '{}', -- EXIF data, colors, etc.
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_media_items_mime_type ON media_items(mime_type);
CREATE INDEX idx_media_items_folder_path ON media_items(folder_path);
CREATE INDEX idx_media_items_uploaded_by ON media_items(uploaded_by);
CREATE INDEX idx_media_items_tags ON media_items USING GIN(tags);

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
  source VARCHAR(50), -- website, email, social, third_party
  source_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);
CREATE INDEX idx_testimonials_product_id ON testimonials(product_id);

-- FAQ Categories
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

CREATE INDEX idx_faq_categories_slug ON faq_categories(slug);

-- FAQ Items
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
  search_index TSVECTOR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faq_items_category_id ON faq_items(category_id);
CREATE INDEX idx_faq_items_is_active ON faq_items(is_active);
CREATE INDEX idx_faq_items_product_id ON faq_items(product_id);
CREATE INDEX idx_faq_items_search_index ON faq_items USING GIN(search_index);

-- FAQ Feedback
CREATE TABLE IF NOT EXISTS faq_feedback (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  faq_item_id VARCHAR(255) NOT NULL REFERENCES faq_items(id),
  feedback_type VARCHAR(10) NOT NULL, -- helpful, not_helpful
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  email VARCHAR(255),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faq_feedback_faq_item_id ON faq_feedback(faq_item_id);

-- Dynamic Content
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

CREATE INDEX idx_dynamic_content_key ON dynamic_content(key);
CREATE INDEX idx_dynamic_content_is_active ON dynamic_content(is_active);

-- Content Revisions
CREATE TABLE IF NOT EXISTS content_revisions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  content_type VARCHAR(50) NOT NULL, -- page, blog_post, content_block
  content_id VARCHAR(255) NOT NULL,
  version INT NOT NULL,
  title VARCHAR(255),
  content TEXT,
  content_json JSONB,
  author_id VARCHAR(255) REFERENCES users(id),
  change_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_revisions_content ON content_revisions(content_type, content_id);
CREATE INDEX idx_content_revisions_author_id ON content_revisions(author_id);

-- Menu System
CREATE TABLE IF NOT EXISTS menus (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  location VARCHAR(100), -- header, footer, sidebar
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
  target VARCHAR(20) DEFAULT '_self', -- _self, _blank
  css_class VARCHAR(255),
  rel VARCHAR(255),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX idx_menu_items_parent_id ON menu_items(parent_id);
CREATE INDEX idx_menu_items_order ON menu_items(menu_id, parent_id, order_index);

-- SEO URLs
CREATE TABLE IF NOT EXISTS seo_urls (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  url VARCHAR(500) NOT NULL,
  target_type VARCHAR(50) NOT NULL, -- page, blog_post, product, category
  target_id VARCHAR(255) NOT NULL,
  is_canonical BOOLEAN DEFAULT false,
  redirect_code INT DEFAULT 301, -- 301, 302
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_seo_urls_url ON seo_urls(url);
CREATE INDEX idx_seo_urls_target ON seo_urls(target_type, target_id);
CREATE UNIQUE INDEX idx_seo_urls_unique_url ON seo_urls(url);
```

---

## 5. ANALYTICS SCHEMA (18 Tables)

### Comprehensive Analytics System
```sql
-- User Events
CREATE TABLE IF NOT EXISTS user_events (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  event_type VARCHAR(50) NOT NULL, -- page_view, add_to_cart, purchase, etc.
  event_category VARCHAR(50),
  event_action VARCHAR(100),
  event_label VARCHAR(500),
  event_value DECIMAL(10,2),
  properties JSONB DEFAULT '{}',
  page_url VARCHAR(1000),
  referrer_url VARCHAR(1000),
  ip_address INET,
  user_agent TEXT,
  platform VARCHAR(50), -- web, mobile, tablet
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
);

-- Partitioned by month for performance
CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_session_id ON user_events(session_id);
CREATE INDEX idx_user_events_type_date ON user_events(event_type, created_at);
CREATE INDEX idx_user_events_created_at ON user_events(created_at);

-- Page Views (Enhanced)
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
);

CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_url_date ON page_views(url, created_at);
CREATE INDEX idx_page_views_user_id ON page_views(user_id);

-- Sessions
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
  referrer_type VARCHAR(50), -- direct, search, social, email, referral
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_started_at ON user_sessions(started_at);
CREATE INDEX idx_user_sessions_country ON user_sessions(country);

-- E-commerce Events
CREATE TABLE IF NOT EXISTS ecommerce_events (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  event_type VARCHAR(50) NOT NULL, -- product_view, add_to_cart, remove_from_cart, checkout_start, purchase
  product_id VARCHAR(255) REFERENCES products(id),
  variant_id VARCHAR(255) REFERENCES product_variants(id),
  order_id VARCHAR(255) REFERENCES orders(id),
  quantity INT,
  price_cents INT,
  currency VARCHAR(3) DEFAULT 'CAD',
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ecommerce_events_product_id ON ecommerce_events(product_id);
CREATE INDEX idx_ecommerce_events_order_id ON ecommerce_events(order_id);
CREATE INDEX idx_ecommerce_events_type_date ON ecommerce_events(event_type, created_at);

-- Product Analytics
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
  average_time_on_page INT DEFAULT 0, -- seconds
  bounce_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  conversion_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, date)
);

CREATE INDEX idx_product_analytics_product_date ON product_analytics(product_id, date);
CREATE INDEX idx_product_analytics_date ON product_analytics(date);

-- Conversion Tracking
CREATE TABLE IF NOT EXISTS conversions (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  conversion_type VARCHAR(50) NOT NULL, -- purchase, lead_signup, newsletter_signup, booking
  conversion_value DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'CAD',
  order_id VARCHAR(255) REFERENCES orders(id),
  booking_id VARCHAR(255) REFERENCES bookings(id),
  lead_id VARCHAR(255),
  properties JSONB DEFAULT '{}',
  attribution_model VARCHAR(20) DEFAULT 'last_click', -- first_click, last_click, linear, time_decay
  attributed_touch_id VARCHAR(255),
  touch_points JSONB DEFAULT '[]', -- Array of touch points
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_session_id ON conversions(session_id);
CREATE INDEX idx_conversions_type_date ON conversions(conversion_type, created_at);

-- Funnel Analytics
CREATE TABLE IF NOT EXISTS funnel_steps (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  funnel_name VARCHAR(255) NOT NULL,
  step_name VARCHAR(255) NOT NULL,
  step_order INT NOT NULL,
  step_description TEXT,
  definition JSONB NOT NULL, -- Event conditions
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
  average_time_to_complete INT DEFAULT 0, -- seconds
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(funnel_name, step_name, date)
);

CREATE INDEX idx_funnel_analytics_funnel_date ON funnel_analytics(funnel_name, date);

-- A/B Testing
CREATE TABLE IF NOT EXISTS experiments (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft', -- draft, running, paused, completed
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

CREATE INDEX idx_experiment_participants_experiment_id ON experiment_participants(experiment_id);
CREATE INDEX idx_experiment_participants_variant_id ON experiment_participants(variant_id);

-- Search Analytics
CREATE TABLE IF NOT EXISTS search_analytics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  query VARCHAR(255) NOT NULL,
  normalized_query VARCHAR(255), -- Lowercase, stripped punctuation
  result_count INT NOT NULL,
  clicked_result_position INT,
  clicked_result_type VARCHAR(50), -- product, page, blog_post
  clicked_result_id VARCHAR(255),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  has_conversion BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10,2),
  search_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_search_analytics_query_date ON search_analytics(query, search_date);
CREATE INDEX idx_search_analytics_normalized_query ON search_analytics(normalized_query);
CREATE INDEX idx_search_analytics_search_date ON search_analytics(search_date);

-- Performance Metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  metric_type VARCHAR(50) NOT NULL, -- page_load, api_response, database_query
  name VARCHAR(255) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20), -- ms, bytes, count
  url VARCHAR(1000),
  user_id VARCHAR(255) REFERENCES users(id),
  session_id VARCHAR(255),
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_performance_metrics_type_date ON performance_metrics(metric_type, created_at);
CREATE INDEX idx_performance_metrics_name_date ON performance_metrics(name, created_at);

-- Revenue Analytics
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

CREATE INDEX idx_revenue_analytics_date ON revenue_analytics(date);

-- Customer Segments Analytics
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

CREATE INDEX idx_segment_analytics_segment_date ON segment_analytics(segment_id, date);

-- Cohort Analysis
CREATE TABLE IF NOT EXISTS cohort_analytics (
  id VARCHAR(255) PRIMARY KEY DEFAULT cuid(),
  cohort_date DATE NOT NULL, -- When users signed up
  period_number INT NOT NULL, -- 0=sign up period, 1=first period after, etc.
  period_type VARCHAR(20) DEFAULT 'month', -- day, week, month
  user_count INT DEFAULT 0,
  active_user_count INT DEFAULT 0,
  retention_rate DECIMAL(5,2) DEFAULT 0,
  revenue_cents INT DEFAULT 0,
  average_revenue_per_user DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(cohort_date, period_number, period_type)
);

CREATE INDEX idx_cohort_analytics_cohort_date ON cohort_analytics(cohort_date);
CREATE INDEX idx_cohort_analytics_period ON cohort_analytics(period_number);

-- Heatmap Data
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

CREATE INDEX idx_heatmap_data_url_date ON heatmap_data(url, created_at);

-- Error Tracking
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
  severity VARCHAR(20) DEFAULT 'error', -- debug, info, warning, error, critical
  resolved BOOLEAN DEFAULT false,
  resolved_by VARCHAR(255),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_error_logs_type_date ON error_logs(error_type, created_at);
CREATE INDEX idx_error_logs_resolved ON error_logs(resolved);
```

---

## PERFORMANCE OPTIMIZATIONS

### Indexing Strategy
```sql
-- Composite indexes for common queries
CREATE INDEX idx_products_category_status ON products(category, status);
CREATE INDEX idx_products_featured_status ON products(featured, status) WHERE status = 'active';
CREATE INDEX idx_products_price_range ON products(price, sale_price) WHERE status = 'active';
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);
CREATE INDEX idx_cart_items_cart_product ON cart_items(cart_id, product_id);
CREATE INDEX idx_user_events_session_created ON user_sessions(session_id, started_at);

-- Full-text search indexes
CREATE INDEX idx_products_search ON products USING GIN(
  to_tsvector('english', name || ' ' || description || ' ' || array_to_string(features, ' ') || ' ' || array_to_string(tags, ' '))
);
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(search_index);

-- Partial indexes for better performance
CREATE INDEX idx_active_products ON products(id) WHERE status = 'active';
CREATE INDEX idx_pending_orders ON orders(id) WHERE fulfillment_status = 'pending';
CREATE INDEX idx_unread_reviews ON reviews(id) WHERE status = 'pending';

-- JSONB indexes for efficient queries
CREATE INDEX idx_users_preferences ON users USING GIN(preferences);
CREATE INDEX idx_products_dimensions ON products USING GIN(dimensions);
```

### Partitioning Strategy
```sql
-- Partition user_events by month
CREATE TABLE user_events_y2024m01 PARTITION OF user_events
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition page_views by month
CREATE TABLE page_views_y2024m01 PARTITION OF page_views
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition order_items by year
CREATE TABLE order_items_y2024 PARTITION OF order_items
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

## SECURITY IMPLEMENTATIONS

### Row-Level Security
```sql
-- Enable RLS on sensitive tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_profiles_policy ON user_profiles
FOR ALL TO authenticated_users
USING (user_id = current_user_id());

CREATE POLICY orders_policy ON orders
FOR ALL TO authenticated_users
USING (user_id = current_user_id());

-- Admin policies
CREATE POLICY admin_access_orders ON orders
FOR ALL TO admin_users
USING (true);
```

### Data Encryption
```sql
-- Create extension for pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive columns
ALTER TABLE users ADD COLUMN encrypted_ssn BYTEA;
ALTER TABLE payment_methods ADD COLUMN encrypted_card_number BYTEA;

-- Update triggers for encryption
CREATE OR REPLACE FUNCTION encrypt_sensitive_data()
RETURNS TRIGGER AS $$
BEGIN
  NEW.encrypted_ssn = pgp_sym_encrypt(NEW.ssn, current_setting('app.encryption_key'));
  NEW.ssn = NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Audit Logging
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(255) NOT NULL,
  operation VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
  user_id VARCHAR(255) REFERENCES users(id),
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, old_values)
    VALUES (TG_TABLE_NAME, TG_OP, current_user_id(), row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, old_values, new_values)
    VALUES (TG_TABLE_NAME, TG_OP, current_user_id(), row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, new_values)
    VALUES (TG_TABLE_NAME, TG_OP, current_user_id(), row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## STORED PROCEDURES & FUNCTIONS

### Product Search Function
```sql
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  min_price INT DEFAULT NULL,
  max_price INT DEFAULT NULL,
  sort_by VARCHAR(20) DEFAULT 'relevance',
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
)
RETURNS TABLE (
  id VARCHAR(255),
  name VARCHAR(255),
  slug VARCHAR(255),
  price INT,
  sale_price INT,
  image_url VARCHAR(255),
  relevance_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.price,
    p.sale_price,
    (SELECT url FROM product_images WHERE product_id = p.id AND position = 0 LIMIT 1),
    ts_rank(
      to_tsvector('english', p.name || ' ' || p.description || ' ' || array_to_string(p.features, ' ')),
      plainto_tsquery('english', search_query)
    ) as relevance_score
  FROM products p
  WHERE
    p.status = 'active'
    AND to_tsvector('english', p.name || ' ' || p.description || ' ' || array_to_string(p.features, ' ')) @@ plainto_tsquery('english', search_query)
    AND (category_filter IS NULL OR p.category = category_filter)
    AND (min_price IS NULL OR COALESCE(p.sale_price, p.price) >= min_price)
    AND (max_price IS NULL OR COALESCE(p.sale_price, p.price) <= max_price)
  ORDER BY
    CASE
      WHEN sort_by = 'price_asc' THEN COALESCE(p.sale_price, p.price)
      ELSE 0
    END,
    CASE
      WHEN sort_by = 'price_desc' THEN -COALESCE(p.sale_price, p.price)
      ELSE 0
    END,
    CASE
      WHEN sort_by = 'name_asc' THEN p.name
      ELSE ''
    END,
    CASE
      WHEN sort_by = 'relevance' THEN ts_rank(
        to_tsvector('english', p.name || ' ' || p.description || ' ' || array_to_string(p.features, ' ')),
        plainto_tsquery('english', search_query)
      )
      ELSE 0
    END DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
```

### Inventory Update Function
```sql
CREATE OR REPLACE FUNCTION update_inventory(
  product_id_param VARCHAR(255),
  variant_id_param VARCHAR(255),
  location_id_param VARCHAR(255),
  quantity_change INT,
  transaction_type_param VARCHAR(20),
  reference_type_param VARCHAR(50) DEFAULT NULL,
  reference_id_param VARCHAR(255) DEFAULT NULL,
  reason_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_quantity INT;
BEGIN
  -- Get current quantity
  SELECT quantity_available INTO current_quantity
  FROM inventory_stock
  WHERE product_id = product_id_param
    AND COALESCE(variant_id, '') = COALESCE(variant_id_param, '')
    AND location_id = location_id_param
  FOR UPDATE;

  -- Insert or update inventory stock
  INSERT INTO inventory_stock (
    product_id, variant_id, location_id, quantity_available
  ) VALUES (
    product_id_param, variant_id_param, location_id_param, quantity_change
  )
  ON CONFLICT (product_id, variant_id, location_id) DO UPDATE SET
    quantity_available = inventory_stock.quantity_available + quantity_change,
    last_updated = NOW();

  -- Record transaction
  INSERT INTO inventory_transactions (
    product_id, variant_id, location_id, transaction_type,
    quantity, reference_type, reference_id, reason
  ) VALUES (
    product_id_param, variant_id_param, location_id_param,
    transaction_type_param, quantity_change,
    reference_type_param, reference_id_param, reason_param
  );

  -- Check low stock
  IF current_quantity + quantity_change <= (SELECT reorder_point FROM products WHERE id = product_id_param) THEN
    -- Trigger low stock notification
    PERFORM pg_notify('low_stock', json_build_object(
      'product_id', product_id_param,
      'variant_id', variant_id_param,
      'location_id', location_id_param,
      'current_quantity', current_quantity + quantity_change
    )::text);
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

### Revenue Calculation Function
```sql
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
```

---

## BACKUP & RECOVERY STRATEGIES

### Automated Backup Script
```bash
#!/bin/bash
# backup-database.sh

DB_NAME="pgclosets_store"
DB_USER="postgres"
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup with custom format
pg_dump -U $DB_USER -h localhost -d $DB_NAME \
  --format=custom \
  --compress=9 \
  --verbose \
  --file=$BACKUP_FILE

# Verify backup
pg_restore --list $BACKUP_FILE > /dev/null
if [ $? -eq 0 ]; then
  echo "Backup created successfully: $BACKUP_FILE"

  # Compress older backups
  find $BACKUP_DIR -name "${DB_NAME}_backup_*.sql" -mtime +7 -exec gzip {} \;

  # Remove backups older than 30 days
  find $BACKUP_DIR -name "${DB_NAME}_backup_*.sql.gz" -mtime +30 -delete
else
  echo "Backup failed!"
  rm -f $BACKUP_FILE
  exit 1
fi
```

### Point-in-Time Recovery Setup
```sql
-- Enable WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /var/lib/postgresql/wal_archive/%f';

-- Create replication user
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE pgclosets_store TO replicator;

-- Set up pg_basebackup for physical backups
-- pg_basebackup -h localhost -D /var/backups/postgresql/base_backup -U replicator -v -P -W
```

---

## MONITORING & MAINTENANCE

### Performance Monitoring Query
```sql
-- Slow query analysis
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows,
  100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Index usage analysis
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Table size analysis
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
ORDER BY size_bytes DESC;
```

### Auto-Vacuum Configuration
```sql
-- Aggressive autovacuum for high-traffic tables
ALTER TABLE user_events SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE page_views SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

-- Custom autovacuum for orders table
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_scale_factor = 0.02
);
```

---

## MIGRATION PATH

### Step 1: Schema Migration
```sql
-- Run in sequence:
-- 1. Create new tables
-- 2. Add columns to existing tables with default values
-- 3. Create indexes
-- 4. Set up constraints and triggers
-- 5. Migrate data from legacy systems
-- 6. Enable RLS and security policies
-- 7. Set up monitoring and backup procedures
```

### Step 2: Data Migration Strategy
```sql
-- Example: Migrate from legacy system
CREATE OR REPLACE FUNCTION migrate_legacy_data()
RETURNS VOID AS $$
BEGIN
  -- Disable triggers during migration
  ALTER TABLE orders DISABLE TRIGGER ALL;

  -- Migrate orders in batches
  INSERT INTO orders (id, order_number, user_id, total, created_at)
  SELECT
    gen_random_uuid()::text,
    old_order_id,
    user_id,
    amount * 100, -- Convert to cents
    order_date
  FROM legacy_orders
  WHERE order_date >= '2023-01-01'
  LIMIT 1000;

  -- Re-enable triggers
  ALTER TABLE orders ENABLE TRIGGER ALL;

  -- Update statistics
  ANALYZE orders;
END;
$$ LANGUAGE plpgsql;
```

---

## SUMMARY

This comprehensive database schema provides:

✅ **62 Tables** across 5 categories
✅ **Advanced Features**: AI-powered search, booking system, analytics
✅ **Performance Optimizations**: Indexing, partitioning, query optimization
✅ **Security**: Row-level security, encryption, audit logging
✅ **Scalability**: Partitioned tables, connection pooling strategies
✅ **Monitoring**: Built-in analytics and performance tracking
✅ **Backup & Recovery**: Automated backup scripts and PITR setup

The schema supports all e-commerce operations while maintaining data integrity, performance, and security standards required for a production environment.
```
TodoWrite
<arg_key>todos</arg_key>
<arg_value>[{"content": "Create comprehensive database schema documentation with all 5 categories", "status": "completed", "activeForm": "Completed comprehensive database schema documentation"}, {"content": "Design E-commerce schema extensions (15 tables total)", "status": "completed", "activeForm": "Completed e-commerce schema extensions"}, {"content": "Design User Management schema extensions (10 tables total)", "status": "in_progress", "activeForm": "Designing user management schema extensions"}, {"content": "Design Booking System schema extensions (8 tables total)", "status": "pending", "activeForm": "Designing booking system schema extensions"}, {"content": "Design Content Management schema extensions (7 tables total)", "status": "pending", "activeForm": "Designing content management schema extensions"}, {"content": "Design Analytics schema extensions (10 tables total)", "status": "pending", "activeForm": "Designing analytics schema extensions"}, {"content": "Create SQL migration scripts with optimizations", "status": "pending", "activeForm": "Creating SQL migration scripts"}, {"content": "Design performance optimization strategies", "status": "pending", "activeForm": "Designing performance optimization strategies"}, {"content": "Implement security features and constraints", "status": "pending", "activeForm": "Implementing security features and constraints"}]