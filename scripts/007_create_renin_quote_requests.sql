-- Migration: Create Renin Quote Requests Table
-- Description: Ottawa-specific Renin product quote requests with pricing calculations
-- Created: 2025-09-27

-- Create enum types for better data integrity
CREATE TYPE customer_type_enum AS ENUM ('residential', 'contractor', 'senior');
CREATE TYPE project_type_enum AS ENUM ('new-construction', 'renovation', 'replacement');
CREATE TYPE timeline_enum AS ENUM ('immediate', '1-3months', '3-6months', '6plus-months');
CREATE TYPE contact_method_enum AS ENUM ('email', 'phone', 'both');
CREATE TYPE quote_status_enum AS ENUM ('pending', 'contacted', 'quoted', 'converted', 'declined');

-- Create the renin_quote_requests table
CREATE TABLE renin_quote_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Quote identification
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    quote_type VARCHAR(20) DEFAULT 'renin_ottawa',
    status quote_status_enum DEFAULT 'pending',

    -- Timestamps
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    contacted_at TIMESTAMP WITH TIME ZONE,
    quoted_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Customer information
    customer_data JSONB NOT NULL,

    -- Products and pricing data
    products_data JSONB NOT NULL,
    quote_calculation JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Project details
    project_details JSONB,
    preferred_contact contact_method_enum NOT NULL DEFAULT 'both',
    include_financing BOOLEAN DEFAULT FALSE,

    -- Communication tracking
    contact_attempts INTEGER DEFAULT 0,
    last_contact_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,

    -- System metadata
    metadata JSONB,

    -- Constraints
    CONSTRAINT valid_total_amount CHECK (total_amount >= 0),
    CONSTRAINT valid_contact_attempts CHECK (contact_attempts >= 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_renin_quotes_quote_number ON renin_quote_requests(quote_number);
CREATE INDEX idx_renin_quotes_status ON renin_quote_requests(status);
CREATE INDEX idx_renin_quotes_received_at ON renin_quote_requests(received_at);
CREATE INDEX idx_renin_quotes_total_amount ON renin_quote_requests(total_amount);
CREATE INDEX idx_renin_quotes_customer_email ON renin_quote_requests USING GIN ((customer_data->>'email'));
CREATE INDEX idx_renin_quotes_customer_type ON renin_quote_requests USING GIN ((customer_data->>'customerType'));
CREATE INDEX idx_renin_quotes_postal_code ON renin_quote_requests USING GIN ((customer_data->>'postalCode'));

-- Create a partial index for pending quotes
CREATE INDEX idx_renin_quotes_pending ON renin_quote_requests(received_at) WHERE status = 'pending';

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_renin_quote_requests_updated_at
    BEFORE UPDATE ON renin_quote_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for easy reporting
CREATE VIEW renin_quotes_summary AS
SELECT
    quote_number,
    status,
    customer_data->>'firstName' || ' ' || customer_data->>'lastName' AS customer_name,
    customer_data->>'email' AS customer_email,
    customer_data->>'postalCode' AS postal_code,
    customer_data->>'customerType' AS customer_type,
    total_amount,
    array_length(products_data, 1) AS product_count,
    preferred_contact,
    include_financing,
    received_at,
    contacted_at,
    quoted_at,
    converted_at,
    contact_attempts,
    last_contact_at
FROM renin_quote_requests
ORDER BY received_at DESC;

-- Add comments for documentation
COMMENT ON TABLE renin_quote_requests IS 'Ottawa-specific Renin product quote requests with detailed pricing calculations';
COMMENT ON COLUMN renin_quote_requests.quote_number IS 'Unique quote identifier (format: REN-timestamp-random)';
COMMENT ON COLUMN renin_quote_requests.customer_data IS 'JSON object containing customer information (name, email, phone, postal code, type)';
COMMENT ON COLUMN renin_quote_requests.products_data IS 'JSON array of requested products with specifications and pricing';
COMMENT ON COLUMN renin_quote_requests.quote_calculation IS 'JSON object containing detailed price breakdown and calculations';
COMMENT ON COLUMN renin_quote_requests.total_amount IS 'Final total amount including all fees, discounts, and taxes';
COMMENT ON COLUMN renin_quote_requests.project_details IS 'JSON object containing project type, timeline, and additional notes';
COMMENT ON COLUMN renin_quote_requests.metadata IS 'System metadata including user agent, IP address, and referrer';

-- Insert some sample data for testing (optional)
INSERT INTO renin_quote_requests (
    quote_number,
    received_at,
    customer_data,
    products_data,
    quote_calculation,
    total_amount,
    project_details,
    preferred_contact,
    include_financing,
    metadata
) VALUES (
    'REN-SAMPLE-001',
    NOW(),
    '{"firstName": "John", "lastName": "Smith", "email": "john.smith@example.com", "phone": "(613) 555-1234", "postalCode": "K1A 0A6", "customerType": "residential"}',
    '[{"productId": "1", "productName": "Test Barn Door", "productCategory": "barn-doors", "msrpPrice": 899, "width": 36, "height": 84, "quantity": 1, "includeInstallation": true, "doorType": "barn-door"}]',
    '{"total": 1247.50, "hst": 162.18, "installation": 450, "delivery": 75, "subtotal": 1085.32}',
    1247.50,
    '{"projectType": "renovation", "timeline": "1-3months", "additionalNotes": "For master bedroom renovation"}',
    'both',
    false,
    '{"userAgent": "Test Browser", "ip": "127.0.0.1", "referer": "https://pgclosets.com"}'
);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON renin_quote_requests TO authenticated;
GRANT SELECT ON renin_quotes_summary TO authenticated;