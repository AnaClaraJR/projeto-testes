<?php
require_once '../src/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$acao = $_GET['acao'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($acao === 'login') {
        $email = $data['email'] ?? '';
        $senha = $data['senha'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && $user['senha'] === $senha) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_nome'] = $user['nome'];
            $_SESSION['user_is_admin'] = (bool)$user['is_admin'];

            echo json_encode([
                'ok' => true,
                'usuario' => [
                    'email' => $user['email'],
                    'nome' => $user['nome'],
                    'isAdmin' => (bool)$user['is_admin']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['ok' => false, 'error' => 'E-mail ou senha inválidos.']);
        }
    } elseif ($acao === 'register') {
        $nome = $data['nome'] ?? '';
        $email = $data['email'] ?? '';
        $senha = $data['senha'] ?? '';

        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'E-mail já cadastrado.']);
        } else {
            $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
            if ($stmt->execute([$nome, $email, $senha])) {
                echo json_encode(['ok' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['ok' => false, 'error' => 'Erro ao cadastrar.']);
            }
        }
    }
} elseif ($acao === 'sessao') {
    $sessao = getSessao();
    echo json_encode(['sessao' => $sessao]);
} elseif ($acao === 'logout') {
    session_destroy();
    echo json_encode(['ok' => true]);
}
?>
