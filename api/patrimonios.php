<?php
require_once '../src/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$slug = $_GET['slug'] ?? '';

if ($slug) {
    $stmt = $pdo->prepare("SELECT * FROM patrimonios WHERE slug = ? AND status = 'aprovado'");
    $stmt->execute([$slug]);
    $item = $stmt->fetch();
    echo json_encode($item ?: null);
} else {
    $stmt = $pdo->query("SELECT * FROM patrimonios WHERE status = 'aprovado'");
    echo json_encode($stmt->fetchAll());
}
?>
