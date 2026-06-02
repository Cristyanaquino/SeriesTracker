# 📺 Series Tracker

Um aplicativo web para rastrear suas séries favoritas. Acompanhe temporadas, episódios e organize tudo em um único lugar.

## 🚀 Recursos

- ✅ **Autenticação segura** com Supabase Auth
- 📊 **Dashboard intuitivo** com resumo de séries
- 🎬 **Gerenciamento de séries** - adicione, edite e delete suas séries
- 📈 **Controle de progresso** - acompanhe temporadas e episódios
- 🏷️ **Filtros por status** - Assistindo, Pausada, Finalizada
- 🔍 **Busca por nome ou plataforma**
- 🔒 **Segurança RLS** - seus dados protegidos com Row Level Security
- 🎨 **Interface moderna** com Tailwind CSS e componentes customizados

## 🛠️ Tecnologias

- **Frontend:** React 18 + TypeScript
- **Estilização:** Tailwind CSS
- **Roteamento:** React Router v6
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Build:** Vite
- **Validação:** Zod
- **UI Components:** shadcn/ui
- **Toast Notifications:** Sonner
- **Forms:** React Hook Form

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Conta Supabase

## ⚙️ Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/Cristyanaquino/SeriesTracker.git
cd SeriesTracker
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

Obtenha essas credenciais em: https://app.supabase.com/project/[seu-id]/settings/api

4. **Configure o banco de dados:**

Execute o SQL em `database.sql` no SQL Editor do Supabase:
- Vá em: https://app.supabase.com
- SQL Editor → New Query
- Cole o conteúdo de `database.sql`
- Clique em Run

**Ou use a migration:**
Se a tabela `profiles` já existe, execute apenas:
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
```

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

Acesse: http://localhost:5173

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── dashboard/      # Componentes do dashboard
│   ├── layout/         # Layout e navegação
│   ├── series/         # Componentes de séries
│   └── ui/             # Componentes base (buttons, inputs, etc)
├── pages/              # Páginas principais
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   └── ResetPassword.tsx
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   └── useSupabase.ts
├── lib/                # Utilitários e configurações
│   ├── supabaseClient.ts
│   ├── validations.ts
│   └── utils.ts
├── types/              # Type definitions
└── utils/              # Funções auxiliares
```

## 🔐 Autenticação

### Registrar
1. Clique em "Criar Conta"
2. Preencha nome, email e senha
3. Você será redirecionado para o dashboard

### Fazer Login
1. Acesse a página de login
2. Digite seu email e senha
3. Você será redirecionado para o dashboard

### Recuperar Senha
1. Clique em "Esqueceu a senha?"
2. Digite seu email
3. Verifique seu email para o link de redefinição
4. Clique no link e defina uma nova senha

## 📊 Funcionalidades da Dashboard

### Adicionar Série
1. Clique em "+ Nova Série"
2. Preencha os dados:
   - Nome da série
   - Plataforma de streaming
   - Temporada atual
   - Episódio atual
   - Status (Assistindo, Pausada, Finalizada)
3. Clique em "Salvar"

### Editar Série
1. Clique no ícone de edição na série
2. Modifique os dados
3. Clique em "Atualizar"

### Incrementar Episódio/Temporada
1. Na série, clique em:
   - "Próximo episódio" para incrementar o episódio
   - "Próxima temporada" para incrementar a temporada

### Marcar como Finalizada
Clique no botão "Finalizar série" para marcar como concluída

### Filtrar Séries
- Use os filtros por status na lateral
- Pesquise por nome ou plataforma

### Deletar Série
Clique no ícone de lixeira para remover uma série

## 🗄️ Banco de Dados

### Tabela: profiles
```sql
- id (UUID) - ID do usuário
- email (TEXT) - Email do usuário
- full_name (TEXT) - Nome completo
- created_at (TIMESTAMP) - Data de criação
```

### Tabela: series
```sql
- id (UUID) - ID único da série
- user_id (UUID) - ID do proprietário
- name (TEXT) - Nome da série
- platform (TEXT) - Plataforma de streaming
- season (INTEGER) - Temporada atual
- episode (INTEGER) - Episódio atual
- status (TEXT) - Status (watching, paused, finished)
- created_at (TIMESTAMP) - Data de criação
- updated_at (TIMESTAMP) - Data da última atualização
```

## 🛡️ Segurança

- **Row Level Security (RLS):** Cada usuário só acessa suas próprias séries
- **Autenticação OAuth:** Via Supabase Auth
- **Variáveis de ambiente:** Credenciais protegidas no `.env`
- **Validação de dados:** Schemas Zod em todas as requisições

## 📝 Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint do código
npm run lint
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Faça push para o GitHub
2. Conecte seu repositório no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

### Outras plataformas
- Netlify
- Railway
- Render

## 🐛 Troubleshooting

### "Email não confirmado"
Se precisar confirmar email antes de fazer login:
- No Supabase, vá em: Authentication → Providers → Email
- Desabilite "Confirm email" para ambiente de desenvolvimento

### "Usuário não aparece no banco"
Verifique:
1. Se a policy de INSERT existe em `profiles`
2. Se a coluna `email` existe
3. Se o RLS está habilitado

### Erro de conexão com banco
- Verifique as variáveis de ambiente em `.env`
- Certifique-se que o projeto Supabase está ativo
- Teste a conexão no SQL Editor

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma [issue](https://github.com/Cristyanaquino/SeriesTracker/issues)
- Verifique a documentação do Supabase: https://supabase.com/docs

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Cristyan Aquino

---

**Aproveite o Series Tracker! Organize suas séries com facilidade! 🎬📺**
