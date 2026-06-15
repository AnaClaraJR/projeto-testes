<?php
require_once '../src/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$user = getSessao();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!$user || !$user['isAdmin']) {
        http_response_code(403);
        echo json_encode(['error' => 'Acesso negado']);
        exit;
    }
    $stmt = $pdo->query("SELECT * FROM sugestoes ORDER BY criado_em DESC");
    echo json_encode($stmt->fetchAll());
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['action']) || isset($data['destaque'])) {
        // Atualização (Admin)
        if (!$user || !$user['isAdmin']) {
            http_response_code(403);
            echo json_encode(['error' => 'Acesso negado']);
            exit;
        }
        $id = $data['id'];
        if (isset($data['action'])) {
            $status = $data['action'];
            if ($status === 'aprovado') {
                $stmt = $pdo->prepare("SELECT * FROM sugestoes WHERE id = ?");
                $stmt->execute([$id]);
                $s = $stmt->fetch();
                if ($s) {
                    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $s['nome'])));
                    $stmt = $pdo->prepare("INSERT INTO patrimonios (slug, nome, cidade, categoria, descricao_historica, url_foto_principal, referencias) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$slug, $s['nome'], $s['cidade'], $s['categoria'], $s['descricao_historica'], $s['url_foto_principal'], $s['referencias']]);
                }
            }
            $stmt = $pdo->prepare("UPDATE sugestoes SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
        }
        echo json_encode(['ok' => true]);
    } else {
        // Nova sugestão
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Login necessário']);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO sugestoes (nome, cidade, categoria, descricao_historica, url_foto_principal, referencias, usuario_sugeriu) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $res = $stmt->execute([
            $data['nome'],
            $data['cidade'],
            $data['categoria'],
            $data['descricao_historica'],
            $data['url_foto_principal'],
            $data['referencias'] ?? '',
            $user['email']
        ]);
        echo json_encode(['ok' => $res]);
    }
}
?>
