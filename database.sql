-- Criar tabela profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Criar tabela series
CREATE TABLE IF NOT EXISTS series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  season INTEGER NOT NULL DEFAULT 1,
  episode INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'watching',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT series_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT series_status_check CHECK (status IN ('watching', 'paused', 'finished'))
);

-- Criar índices para melhor performance
CREATE INDEX idx_series_user_id ON series(user_id);
CREATE INDEX idx_series_status ON series(status);
CREATE INDEX idx_series_user_status ON series(user_id, status);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies para series
CREATE POLICY "Users can view their own series" ON series
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own series" ON series
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own series" ON series
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own series" ON series
  FOR DELETE USING (auth.uid() = user_id);

-- Function para atualizar updated_at
CREATE OR REPLACE FUNCTION update_series_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_series_updated_at
BEFORE UPDATE ON series
FOR EACH ROW
EXECUTE FUNCTION update_series_timestamp();
