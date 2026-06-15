# Plano de Testes - Acervo Rondoniense

| ID | Funcionalidade | Tipo | Entrada | Resultado esperado |
| --- | --- | --- | --- | --- |
| CT01 | Login | Funcional / E2E | E-mail e senha validos | Usuario acessa o sistema e visualiza sessao autenticada |
| CT02 | Login | Negativo | Senha incorreta | Sistema exibe mensagem de erro |
| CT03 | Cadastro | Validacao | E-mail invalido | Navegador bloqueia o envio do cadastro |
| CT04 | Cadastro | Funcional / E2E | Nome, e-mail unico e senha validos | Sistema cadastra o usuario e retorna para tela de login |
| CT05 | Busca | Seguranca / XSS | `<script>alert(1)</script>` | Sistema nao executa script e nao abre alerta |
| CT06 | Painel admin | Seguranca / Sessao | URL interna sem login | Sistema redireciona para a pagina inicial |
| CT07 | Acervo | Funcional / E2E | Acesso a pagina inicial | Sistema lista os destaques do acervo |
| CT08 | Busca avancada | Funcional / Filtro | Texto, cidade e categoria | Sistema mostra somente os patrimonios compatíveis |
| CT09 | Detalhe do patrimonio | Funcional / E2E | Slug de patrimonio existente | Sistema exibe nome, cidade e categoria do patrimonio |
| CT10 | Sugestao | Funcional / E2E | Usuario logado e dados validos da sugestao | Sistema registra sugestao e exibe mensagem de sucesso |

