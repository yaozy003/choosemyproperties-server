-- Create houses table
CREATE TABLE IF NOT EXISTS houses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    "zipCode" VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    "propertyType" VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    features TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on commonly searched fields
CREATE INDEX IF NOT EXISTS idx_houses_city ON houses(city);
CREATE INDEX IF NOT EXISTS idx_houses_price ON houses(price);
CREATE INDEX IF NOT EXISTS idx_houses_status ON houses(status);

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt
CREATE TRIGGER update_houses_updated_at
    BEFORE UPDATE ON houses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 