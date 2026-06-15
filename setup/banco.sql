-- ============================================================
-- SCHEMA DO BANCO DE DADOS — Acervo Rondoniense
-- Banco: SQLite  |  Arquivo: data/sistema.db
-- ============================================================
-- Este arquivo documenta a estrutura do banco.
-- O banco é criado automaticamente ao iniciar o servidor (server/db.ts).
-- ============================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,        -- unicidade garante sem duplicatas
  senha      TEXT    NOT NULL,               -- em produção real usaria bcrypt
  is_admin   INTEGER NOT NULL DEFAULT 0,    -- 0 = usuário comum, 1 = admin
  criado_em  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Tabela de patrimônios aprovados
CREATE TABLE IF NOT EXISTS patrimonios (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                TEXT    NOT NULL UNIQUE,   -- URL amigável ex: "estrada-ferro-madeira"
  nome                TEXT    NOT NULL,
  cidade              TEXT    NOT NULL,
  bairro              TEXT,
  descricao_historica TEXT    NOT NULL,
  categoria           TEXT    NOT NULL,
  destaque            INTEGER NOT NULL DEFAULT 0,       -- 0/1 booleano
  url_foto_principal  TEXT,
  estado_conservacao  TEXT,
  visitacao_aberta    INTEGER NOT NULL DEFAULT 1,
  referencias         TEXT,
  status              TEXT    NOT NULL DEFAULT 'aprovado',
  criado_em           TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Tabela de sugestões enviadas pelos usuários
CREATE TABLE IF NOT EXISTS sugestoes (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  nome                TEXT    NOT NULL,
  cidade              TEXT    NOT NULL,
  descricao_historica TEXT    NOT NULL,
  categoria           TEXT    NOT NULL,
  url_foto_principal  TEXT,
  referencias         TEXT,
  usuario_sugeriu     TEXT    NOT NULL,   -- e-mail do usuário que sugeriu
  status              TEXT    NOT NULL DEFAULT 'pendente',  -- pendente | aprovado | rejeitado
  destaque            INTEGER NOT NULL DEFAULT 0,
  criado_em           TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- CONSULTAS ÚTEIS PARA DEMONSTRAÇÃO
-- ============================================================

-- Ver todos os usuários cadastrados:
-- SELECT id, nome, email, is_admin, criado_em FROM usuarios;

-- Ver todos os patrimônios aprovados:
-- SELECT id, nome, cidade, categoria, destaque FROM patrimonios WHERE status = 'aprovado';

-- Ver sugestões pendentes:
-- SELECT id, nome, cidade, usuario_sugeriu, status, criado_em FROM sugestoes WHERE status = 'pendente';

-- Ver sugestões aprovadas:
-- SELECT id, nome, cidade, usuario_sugeriu, status FROM sugestoes WHERE status = 'aprovado';

-- Contar registros de cada tabela:
-- SELECT 'usuarios' as tabela, COUNT(*) as total FROM usuarios
-- UNION ALL
-- SELECT 'patrimonios', COUNT(*) FROM patrimonios
-- UNION ALL
-- SELECT 'sugestoes', COUNT(*) FROM sugestoes;
