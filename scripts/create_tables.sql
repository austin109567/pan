-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create raids table
CREATE TABLE IF NOT EXISTS raids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    min_level INTEGER DEFAULT 1,
    max_players INTEGER NOT NULL,
    rewards JSONB,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create raid_participants table
CREATE TABLE IF NOT EXISTS raid_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raid_id UUID REFERENCES raids(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_creator BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(raid_id, user_id)
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    rarity TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_items table (inventory)
CREATE TABLE IF NOT EXISTS user_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_raids_status ON raids(status);
CREATE INDEX IF NOT EXISTS idx_raid_participants_raid_id ON raid_participants(raid_id);
CREATE INDEX IF NOT EXISTS idx_raid_participants_user_id ON raid_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_items_user_id ON user_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_items_item_id ON user_items(item_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_raids_updated_at
    BEFORE UPDATE ON raids
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE raids ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY users_select ON users
    FOR SELECT
    USING (true);

CREATE POLICY users_insert ON users
    FOR INSERT
    WITH CHECK (auth.uid()::text = wallet_address);

CREATE POLICY users_update ON users
    FOR UPDATE
    USING (auth.uid()::text = wallet_address)
    WITH CHECK (auth.uid()::text = wallet_address);

-- Raids policies
CREATE POLICY raids_select ON raids
    FOR SELECT
    USING (true);

CREATE POLICY raids_insert ON raids
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM users
        WHERE wallet_address = auth.uid()::text
        AND level >= min_level
    ));

CREATE POLICY raids_update ON raids
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM raid_participants
        WHERE raid_id = raids.id
        AND user_id = (SELECT id FROM users WHERE wallet_address = auth.uid()::text)
        AND is_creator = true
    ));

-- Raid participants policies
CREATE POLICY raid_participants_select ON raid_participants
    FOR SELECT
    USING (true);

CREATE POLICY raid_participants_insert ON raid_participants
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE wallet_address = auth.uid()::text
            AND id = user_id
        )
    );

-- Items policies
CREATE POLICY items_select ON items
    FOR SELECT
    USING (true);

CREATE POLICY items_insert ON items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE wallet_address = auth.uid()::text
            AND level >= 10  -- Require level 10 to create items
        )
    );

-- User items policies
CREATE POLICY user_items_select ON user_items
    FOR SELECT
    USING (
        user_id IN (
            SELECT id FROM users
            WHERE wallet_address = auth.uid()::text
        )
    );

CREATE POLICY user_items_insert ON user_items
    FOR INSERT
    WITH CHECK (
        user_id IN (
            SELECT id FROM users
            WHERE wallet_address = auth.uid()::text
        )
    );

CREATE POLICY user_items_update ON user_items
    FOR UPDATE
    USING (
        user_id IN (
            SELECT id FROM users
            WHERE wallet_address = auth.uid()::text
        )
    );
