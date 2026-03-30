DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'games'
          AND column_name = 'description'
          AND data_type = 'bytea'
    ) THEN
        ALTER TABLE games
            ALTER COLUMN description TYPE TEXT
            USING CASE
                WHEN description IS NULL THEN NULL
                ELSE convert_from(description, 'UTF8')
            END;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'games'
          AND column_name = 'cover_url'
          AND data_type = 'bytea'
    ) THEN
        ALTER TABLE games
            ALTER COLUMN cover_url TYPE TEXT
            USING CASE
                WHEN cover_url IS NULL THEN NULL
                ELSE convert_from(cover_url, 'UTF8')
            END;
    END IF;
END $$;
