<?php
// Configuração do banco de dados SQLite
$db_path = realpath(__DIR__ . '/../data/sistema.db');

try {
    $pdo = new PDO("sqlite:" . $db_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Erro ao conectar ao banco de dados: " . $e->getMessage());
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function getSessao() {
    if (isset($_SESSION['user_id'])) {
        return [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['user_email'],
            'nome' => $_SESSION['user_nome'],
            'isAdmin' => $_SESSION['user_is_admin']
        ];
    }
    return null;
}

const ADMIN_EMAIL = 'admin@acervo.ro';
?>
