-- ============================================
-- CREDITO MX - 数据库 schema
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- 1. institutions 表（机构）
CREATE TABLE IF NOT EXISTS institutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('fintech', 'sofom', 'bank', 'credit_card')),
    logo_url TEXT,
    website_url TEXT,
    app_url TEXT,
    description TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    complaint_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_institutions_slug ON institutions(slug);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions(type);
CREATE INDEX IF NOT EXISTS idx_institutions_rating ON institutions(rating DESC);

-- 2. reviews 表（评价）
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    user_id UUID,
    user_name VARCHAR(100) NOT NULL,
    user_avatar TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'user',
    source_url TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_institution ON reviews(institution_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);

-- 3. complaints 表（投诉）
CREATE TABLE IF NOT EXISTS complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    user_id UUID,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    resolution TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaints_institution ON complaints(institution_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);

-- 4. 触发器：自动更新机构的评论数和评分
CREATE OR REPLACE FUNCTION update_institution_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE institutions
    SET rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE institution_id = NEW.institution_id AND is_approved = TRUE),
        review_count = (SELECT COUNT(*) FROM reviews WHERE institution_id = NEW.institution_id AND is_approved = TRUE),
        updated_at = NOW()
    WHERE id = NEW.institution_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_rating ON reviews;
CREATE TRIGGER trigger_update_rating AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_institution_rating();

CREATE OR REPLACE FUNCTION update_institution_complaint_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE institutions
    SET complaint_count = (SELECT COUNT(*) FROM complaints WHERE institution_id = NEW.institution_id AND is_public = TRUE),
        updated_at = NOW()
    WHERE id = NEW.institution_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_complaint_count ON complaints;
CREATE TRIGGER trigger_update_complaint_count AFTER INSERT OR UPDATE OR DELETE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_institution_complaint_count();

-- 5. 启用 RLS（行级安全）
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- 6. RLS 策略：公开读，认证写
DROP POLICY IF EXISTS "Public read institutions" ON institutions;
CREATE POLICY "Public read institutions" ON institutions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Public read public complaints" ON complaints;
CREATE POLICY "Public read public complaints" ON complaints FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Public insert complaints" ON complaints;
CREATE POLICY "Public insert complaints" ON complaints FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert reviews" ON reviews;
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
