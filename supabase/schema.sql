-- Supabase Database Schema for Credito MX
-- Run this in Supabase SQL Editor

-- ============================================
-- INSTITUTIONS TABLE
-- ============================================
CREATE TABLE institutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('bank', 'fintech', 'sofom', 'credit_card')),
    logo_url TEXT,
    website_url TEXT,
    app_url TEXT,
    description TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    complaint_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster searches
CREATE INDEX idx_institutions_slug ON institutions(slug);
CREATE INDEX idx_institutions_type ON institutions(type);
CREATE INDEX idx_institutions_rating ON institutions(rating DESC);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    user_name VARCHAR(100),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT NOT NULL,
    source VARCHAR(50) NOT NULL CHECK (source IN ('google_play', 'app_store', 'user')),
    source_url TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_institution ON reviews(institution_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_source ON reviews(source);

-- ============================================
-- COMPLAINTS TABLE
-- ============================================
CREATE TABLE complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('service', 'rates', 'charges', 'collection', 'other')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'rejected')),
    resolution TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_complaints_institution ON complaints(institution_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update institution rating when reviews change
CREATE OR REPLACE FUNCTION update_institution_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE institutions
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE institution_id = NEW.institution_id AND is_approved = TRUE
    ),
    review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE institution_id = NEW.institution_id AND is_approved = TRUE
    )
    WHERE id = NEW.institution_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_institution_rating();

CREATE TRIGGER after_review_update
    AFTER UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_institution_rating();

CREATE TRIGGER after_review_delete
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_institution_rating();

-- Update institution complaint count when complaints change
CREATE OR REPLACE FUNCTION update_institution_complaint_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE institutions
    SET complaint_count = (
        SELECT COUNT(*)
        FROM complaints
        WHERE institution_id = NEW.institution_id AND is_public = TRUE
    )
    WHERE id = NEW.institution_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_complaint_insert
    AFTER INSERT ON complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_institution_complaint_count();

CREATE TRIGGER after_complaint_update
    AFTER UPDATE ON complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_institution_complaint_count();

CREATE TRIGGER after_complaint_delete
    AFTER DELETE ON complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_institution_complaint_count();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Public can read all approved content
CREATE POLICY "Public can read institutions"
    ON institutions FOR SELECT
    USING (TRUE);

CREATE POLICY "Public can read approved reviews"
    ON reviews FOR SELECT
    USING (is_approved = TRUE);

CREATE POLICY "Public can read public complaints"
    ON complaints FOR SELECT
    USING (is_public = TRUE);

-- Anyone can insert reviews (will need approval)
CREATE POLICY "Anyone can insert reviews"
    ON reviews FOR INSERT
    WITH CHECK (TRUE);

-- Anyone can insert complaints
CREATE POLICY "Anyone can insert complaints"
    ON complaints FOR INSERT
    WITH CHECK (TRUE);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

INSERT INTO institutions (name, slug, type, description, rating, review_count, complaint_count, is_verified) VALUES
('Stori', 'stori', 'fintech', 'Tarjeta de crédito digital con beneficios exclusivos', 4.2, 1250, 45, TRUE),
('Klar', 'klar', 'fintech', 'Servicios financieros digitales sin comisiones', 3.8, 890, 32, TRUE),
('Nu Bank', 'nu-bank', 'fintech', 'Banco digital líder en Latinoamérica', 4.5, 2100, 28, TRUE),
('Crediclub', 'crediclub', 'sofom', 'Préstamos personales rápidos', 3.5, 450, 65, FALSE),
('Minu', 'minu', 'fintech', 'Préstamos para empleados con descuento directo', 4.0, 680, 22, TRUE),
('Konfio', 'konfio', 'fintech', 'Préstamos para pequeñas empresas', 4.3, 520, 18, TRUE);