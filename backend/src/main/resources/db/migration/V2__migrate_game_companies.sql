CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'games'
    ) THEN
        ALTER TABLE games ADD COLUMN IF NOT EXISTS developer_id BIGINT;
        ALTER TABLE games ADD COLUMN IF NOT EXISTS publisher_id BIGINT;

        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'games'
              AND column_name = 'developer'
        ) THEN
            INSERT INTO companies (name)
            SELECT DISTINCT btrim(developer)
            FROM games
            WHERE developer IS NOT NULL
              AND btrim(developer) <> ''
            ON CONFLICT (name) DO NOTHING;

            UPDATE games g
            SET developer_id = c.id
            FROM companies c
            WHERE g.developer_id IS NULL
              AND g.developer IS NOT NULL
              AND btrim(g.developer) = c.name;
        END IF;

        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'games'
              AND column_name = 'publisher'
        ) THEN
            INSERT INTO companies (name)
            SELECT DISTINCT btrim(publisher)
            FROM games
            WHERE publisher IS NOT NULL
              AND btrim(publisher) <> ''
            ON CONFLICT (name) DO NOTHING;

            UPDATE games g
            SET publisher_id = c.id
            FROM companies c
            WHERE g.publisher_id IS NULL
              AND g.publisher IS NOT NULL
              AND btrim(g.publisher) = c.name;
        END IF;

        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = 'fk_games_developer'
        ) THEN
            ALTER TABLE games
            ADD CONSTRAINT fk_games_developer
            FOREIGN KEY (developer_id) REFERENCES companies(id);
        END IF;

        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = 'fk_games_publisher'
        ) THEN
            ALTER TABLE games
            ADD CONSTRAINT fk_games_publisher
            FOREIGN KEY (publisher_id) REFERENCES companies(id);
        END IF;

        CREATE INDEX IF NOT EXISTS idx_games_developer_id ON games(developer_id);
        CREATE INDEX IF NOT EXISTS idx_games_publisher_id ON games(publisher_id);

        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'games'
              AND column_name = 'developer'
        ) THEN
            ALTER TABLE games DROP COLUMN developer;
        END IF;

        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'games'
              AND column_name = 'publisher'
        ) THEN
            ALTER TABLE games DROP COLUMN publisher;
        END IF;
    END IF;
END $$;
