-- FIX: Adicionar coluna email e policies de INSERT em profiles
-- Execute isto no SQL Editor do Supabase se a tabela profiles já foi criada

-- 1. Adicionar coluna email se não existir
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Criar policy de INSERT se não existir
CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Verificar se as policies estão ativas
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
