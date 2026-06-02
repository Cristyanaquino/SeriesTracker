-- Migration: Adicionar coluna email na tabela profiles
-- Execute isto se a tabela profiles já foi criada sem a coluna email

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
