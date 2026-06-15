# Acervo Rondoniense - Testes Automatizados (Playwright E2E)

Este repositório contém a suite de testes de ponta a ponta (E2E) desenvolvida com **Playwright** e **TypeScript** para validar os fluxos críticos do sistema Acervo Rondoniense, incluindo rotinas de utilizadores comuns e do painel administrativo.

---

## 📋 Requisitos do Sistema

Antes de configurar e rodar os testes, certifique-se de ter os seguintes componentes instalados na sua máquina:

1. **Servidor Local (Ambiente PHP/Apache):**
   * **XAMPP** ou similar ativo.
   * O projeto base do sistema deve estar mapeado na pasta: `C:\xampp\htdocs\projeto`.
   * No navegador, para visualizar o projeto é necessário colar o link `http://localhost/projeto/public/index.html`.
   * Os módulos **Apache** e **MySQL/SQLite** do XAMPP devem estar em execução (`Start`).

2. **Ambiente de Desenvolvimento:**
   * **Node.js** (Versão 18 ou superior recomendada).
   * **npm** (Gerenciador de pacotes do Node).
   * **VS Code** (ou editor de código de sua preferência).

---

## 🚀 Instalação e Configuração

Como os testes estão isolados numa subpasta dedicada, todos os comandos devem ser executados a partir do diretório do ecossistema de testes.

1. **Abra o terminal e aceda à pasta correta do projeto de testes:**
   ```bash
   cd c:\xampp\htdocs\projeto\testes-playwright

    ```

2. **Instale as dependências do projeto, incluindo os navegadores nativos do Playwright e as definições de tipo do Node.js:**
```bash
npm install
npm i --save-dev @types/node
npx playwright install

```


3. **Verifique as Configurações de Compilação do TypeScript (`tsconfig.json`):**
Garante que o ficheiro `tsconfig.json` está localizado estritamente dentro da pasta `testes-playwright` (e não na raiz do XAMPP) com a resolução de módulos moderna para evitar conflitos de variáveis globais como o `process`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"]
  },
  "include": ["tests/**/*", "playwright.config.ts"]
}

```



---

## ⚙️ Execução dos Testes

Certifique-se de que está posicionado na pasta `testes-playwright` antes de rodar qualquer um dos comandos abaixo:

* **Executar todos os testes em modo silencioso (Headless):**
```bash
npx playwright test

```


* **Executar os testes forçando a exibição do relatório visual HTML:**
```bash
npx playwright test --reporter=html

```


* **Abrir a Interface Interativa (UI Mode):**
Ideal para depurar os testes passo a passo através de uma linha do tempo visual completa (Timeline/Screenshots):
```bash
npx playwright test --ui

```


* **Exibir o último relatório gerado:**
```bash
npx playwright show-report

```



---

## 🔑 Credenciais para Homologação e Testes

Para validar os fluxos de permissões e as operações de CRUD das solicitações no sistema, utilize as seguintes contas mapeadas na base de dados:

### 1. Perfil Administrador (CRUD Administrativo / Aprovar e Rejeitar)

Utilizado para aceder ao painel de gestão (`admin.html`) e auditar as sugestões enviadas.

* **E-mail:** `admin@acervo.ro`
* **Senha:** `Admin@123`

### 2. Perfil Utilizador Comum (Apenas Sugerir)

Utilizado para simular a navegação pública e o envio de novos patrimónios para avaliação.

* **E-mail:** `usuario@acervo.ro`
* **Senha:** `Senha@123`