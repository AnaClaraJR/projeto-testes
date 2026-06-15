import { expect, test, Page, Route } from '@playwright/test';

const usuario = {
  email: 'usuario@acervo.ro',
  senha: 'Senha@123',
};

const patrimonioMock = {
  id: 1,
  slug: 'estrada-ferro-madeira',
  nome: 'Estrada de Ferro Madeira-Mamore',
  cidade: 'Porto Velho',
  descricao_historica: 'Patrimonio historico de Rondonia.',
  categoria: 'Histórico',
  destaque: 1,
  url_foto_principal: '',
  status: 'aprovado',
};

async function limparSessao(page: Page) {
  await page.goto('index.html');
  await page.evaluate(() => localStorage.removeItem('user_sessao'));
}

async function mockarCdn(page: Page) {
  // Mantém o mock do Lucide
  await page.route(/^https:\/\/unpkg\.com\/lucide@latest/, async (route: Route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: 'window.lucide = { createIcons: () => {} };',
    });
  });

  /*
  await page.route('https://cdn.tailwindcss.com/', async (route: Route) => { ... });
  */

  // Mantém o mock de fontes limpo usando RegExp
  await page.route(/^https:\/\/fonts\.googleapis\.com/, async (route: Route) => {
    await route.fulfill({
      contentType: 'text/css',
      body: '',
    });
  });
}

async function autenticar(page: Page) {
  await page.goto('login.html');
  await page.getByTestId('login-email').fill(usuario.email);
  await page.getByTestId('login-password').fill(usuario.senha);
  await page.getByTestId('login-submit').click();
  await expect(page.locator('body')).toContainText(/Sess.o Autenticada|Sess..o Autenticada/);
}

async function mockarPatrimonios(page: Page) {
  await page.route('**/api/patrimonios.php**', async (route: Route) => {
    const url = new URL(route.request().url());
    const slug = url.searchParams.get('slug');
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(slug ? patrimonioMock : [patrimonioMock]),
    });
  });
}

test.beforeEach(async ({ page }) => {
  // Mostra no seu terminal qualquer erro de JavaScript que aconteça dentro da página HTML
  page.on('pageerror', exception => {
    console.log(`[Erro na Página HTML]: ${exception.message}`);
  });

  await mockarCdn(page);
  await limparSessao(page);
});

test('CT01 - deve permitir login com credenciais validas', async ({ page }) => {
  await autenticar(page);

  await expect(page.locator('body')).toContainText(usuario.email);
});

test('CT02 - deve exibir erro ao tentar login com senha incorreta', async ({ page }) => {
  await page.goto('login.html');

  await page.getByTestId('login-email').fill(usuario.email);
  await page.getByTestId('login-password').fill('senha-incorreta');
  await page.getByTestId('login-submit').click();

  await expect(page.locator('#mensagem')).toBeVisible();
  await expect(page.locator('#mensagem')).toContainText('E-mail ou senha');
});

test('CT03 - deve bloquear cadastro com e-mail invalido', async ({ page }) => {
  await page.goto('login.html?modo=cadastro');

  await page.locator('#reg-nome').fill('Usuario Teste');
  await page.locator('#reg-email').fill('emailinvalido');
  await page.locator('#reg-senha').fill('Senha@123');
  await page.locator('button:text("Cadastrar")').click();

  await expect(page.locator('#reg-email')).toHaveJSProperty('validity.valid', false);
  await expect(page.locator('#mensagem')).toBeHidden();
});

test('CT04 - deve cadastrar usuario com dados validos', async ({ page }) => {
  const email = `teste-${Date.now()}@acervo.ro`;

  await page.goto('login.html?modo=cadastro');
  await page.locator('#reg-nome').fill('Usuario Automatizado');
  await page.locator('#reg-email').fill(email);
  await page.locator('#reg-senha').fill('Senha@123');
  await page.locator('button:text("Cadastrar")').click();

  await expect(page.locator('#mensagem')).toContainText('Cadastro realizado');
  await expect(page.getByTestId('login-email')).toBeVisible();
});

test('CT05 - nao deve executar script digitado na busca', async ({ page }) => {
  let dialogoAberto = false;
  page.on('dialog', async dialog => {
    dialogoAberto = true;
    await dialog.dismiss();
  });

  await mockarPatrimonios(page);
  await page.goto('busca.html');
  await page.locator('#filter-q').fill('<script>alert(1)</script>');
  await page.waitForTimeout(300);

  expect(dialogoAberto).toBe(false);
  await expect(page.locator('#results-count')).toContainText('0 encontrado');
});

test('CT06 - deve redirecionar acesso ao painel sem login', async ({ page }) => {
  await page.goto('admin.html');

  await expect(page).toHaveURL(/index\.html$/);
});

test('CT07 - deve exibir acervo na pagina inicial', async ({ page }) => {
  await mockarPatrimonios(page);
  await page.goto('index.html');

  await expect(page.getByRole('heading', { name: 'Destaques' })).toBeVisible();
  await expect(page.locator('#destaques-grid')).toContainText(patrimonioMock.nome);
});

test('CT08 - deve filtrar patrimonio por texto, cidade e categoria', async ({ page }) => {
  await mockarPatrimonios(page);
  await page.goto('busca.html');

  await page.locator('#filter-q').fill('Madeira');
  await page.locator('#filter-cidade').selectOption('Porto Velho');
  await page.locator('#filter-cat').selectOption('Histórico');

  await expect(page.locator('#results-count')).toContainText('1 encontrado');
  await expect(page.locator('#results-grid')).toContainText(patrimonioMock.nome);
});

test('CT09 - deve abrir detalhe de um patrimonio existente', async ({ page }) => {
  await mockarPatrimonios(page);
  await page.goto('detalhe.html?slug=estrada-ferro-madeira');

  await expect(page.getByRole('heading', { name: patrimonioMock.nome })).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('Porto Velho');
  await expect(page.locator('aside')).toContainText('Histórico');
});

test('CT10 - deve enviar sugestao quando usuario estiver autenticado', async ({ page }) => {
  await autenticar(page);

  await page.getByTestId('sugestao-nome').fill('Museu de Teste Automatizado');
  await page.locator('#sug-cidade').selectOption('Porto Velho');
  await page.locator('#sug-desc').fill('Descricao criada pelo teste automatizado.');
  await page.locator('#sug-foto').fill('https://example.com/foto.jpg');
  await page.locator('#sug-cat').selectOption('Histórico');
  await page.getByTestId('enviar-sugestao').click();

  await expect(page.locator('#mensagem')).toContainText(/Sugest.o enviada/);
});