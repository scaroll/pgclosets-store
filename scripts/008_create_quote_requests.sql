-- Migration: Create Quote Requests Table
-- Description: General quote requests table for all product inquiries
-- Created: 2025-12-22

-- Create the quote_requests table
CREATE TABLE quote_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Quote identification
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'pending',

    -- Timestamps
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    contacted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Customer information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),

    -- Project details
    project_type VARCHAR(100),
    room_dimensions VARCHAR(255),
    timeline VARCHAR(100),
    product_interest VARCHAR(255),
    additional_details TEXT,

    -- Product information
    product_name VARCHAR(255),
    product_price DECIMAL(10, 2),
    product_options JSONB,

    -- Communication tracking
    notes TEXT,

    -- System metadata
    metadata JSONB,

    -- Constraints
    CONSTRAINT valid_product_price CHECK (product_price IS NULL OR product_price >= 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_quote_requests_quote_number ON quote_requests(quote_number);
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
CREATE INDEX idx_quote_requests_customer_email ON quote_requests(customer_email);
CREATE INDEX idx_quote_requests_received_at ON quote_requests(received_at);

-- Create a partial index for pending quotes
CREATE INDEX idx_quote_requests_pending ON quote_requests(received_at) WHERE status = 'pending';

-- Add updated_at trigger (reuse function if it exists, otherwise create it)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quote_requests_updated_at
    BEFORE UPDATE ON quote_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for quote summaries
CREATE VIEW quote_requests_summary AS
SELECT
    id,
    quote_number,
    status,
    customer_name,
    customer_email,
    customer_phone,
    project_type,
    product_name,
    product_price,
    timeline,
    received_at,
    contacted_at,
    CASE
        WHEN contacted_at IS NOT NULL THEN
            EXTRACT(EPOCH FROM (contacted_at - received_at)) / 3600
        ELSE NULL
    END AS hours_to_contact,
    CASE
        WHEN status = 'pending' AND contacted_at IS NULL THEN
            EXTRACT(EPOCH FROM (NOW() - received_at)) / 3600
        ELSE NULL
    END AS hours_pending
FROM quote_requests
ORDER BY received_at DESC;

-- Add comments for documentation
COMMENT ON TABLE quote_requests IS 'General quote requests table for all product inquiries and customer quotes';
COMMENT ON COLUMN quote_requests.quote_number IS 'Unique quote identifier (format varies by source)';
COMMENT ON COLUMN quote_requests.customer_name IS 'Full name of the customer requesting the quote';
COMMENT ON COLUMN quote_requests.customer_email IS 'Email address for customer communication';
COMMENT ON COLUMN quote_requests.customer_phone IS 'Phone number for customer contact';
COMMENT ON COLUMN quote_requests.project_type IS 'Type of project (e.g., new-construction, renovation, replacement)';
COMMENT ON COLUMN quote_requests.room_dimensions IS 'Dimensions or size specifications for the project';
COMMENT ON COLUMN quote_requests.timeline IS 'Customer timeline or urgency for the project';
COMMENT ON COLUMN quote_requests.product_interest IS 'Products or categories the customer is interested in';
COMMENT ON COLUMN quote_requests.additional_details IS 'Additional notes or requirements from customer';
COMMENT ON COLUMN quote_requests.product_name IS 'Specific product name if applicable';
COMMENT ON COLUMN quote_requests.product_price IS 'Quoted or estimated price for the product/service';
COMMENT ON COLUMN quote_requests.product_options IS 'JSON object containing product configuration options';
COMMENT ON COLUMN quote_requests.status IS 'Current status of the quote (pending, contacted, quoted, etc.)';
COMMENT ON COLUMN quote_requests.contacted_at IS 'Timestamp when customer was first contacted';
COMMENT ON COLUMN quote_requests.notes IS 'Internal notes and communication history';
COMMENT ON COLUMN quote_requests.metadata IS 'System metadata including user agent, IP address, referrer, and source';

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Policy: Allow authenticated users to view all quotes
CREATE POLICY "Allow authenticated users to view quote requests"
    ON quote_requests
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to insert quotes
CREATE POLICY "Allow authenticated users to create quote requests"
    ON quote_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update quotes
CREATE POLICY "Allow authenticated users to update quote requests"
    ON quote_requests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow service role to do everything
CREATE POLICY "Allow service role full access to quote requests"
    ON quote_requests
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON quote_requests TO authenticated;
GRANT SELECT ON quote_requests_summary TO authenticated;
GRANT ALL ON quote_requests TO service_role;
