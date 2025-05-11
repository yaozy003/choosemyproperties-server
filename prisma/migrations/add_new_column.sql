-- Add new columns to houses table
ALTER TABLE houses
    ADD COLUMN IF NOT EXISTS "newColumn" VARCHAR(100),
    ADD COLUMN IF NOT EXISTS "anotherColumn" INTEGER;

-- Add comment to explain the new columns
COMMENT ON COLUMN houses."newColumn" IS 'Description of what this column is for';
COMMENT ON COLUMN houses."anotherColumn" IS 'Description of what this column is for';

-- If you need to set a default value for existing rows
UPDATE houses
SET "newColumn" = 'default value'
WHERE "newColumn" IS NULL;

-- If you need to add a NOT NULL constraint after setting default values
-- ALTER TABLE houses
--     ALTER COLUMN "newColumn" SET NOT NULL;

-- If you need to add an index for the new column
-- CREATE INDEX IF NOT EXISTS idx_houses_new_column ON houses("newColumn"); 