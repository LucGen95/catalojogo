ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role VARCHAR(20);

UPDATE users
SET role = 'USER'
WHERE role IS NULL;

UPDATE users
SET role = 'ADMIN'
WHERE id = (
    SELECT id
    FROM users
    ORDER BY created_at ASC, id ASC
    LIMIT 1
)
AND NOT EXISTS (
    SELECT 1
    FROM users
    WHERE role = 'ADMIN'
);

ALTER TABLE users
    ALTER COLUMN role SET DEFAULT 'USER';

ALTER TABLE users
    ALTER COLUMN role SET NOT NULL;
