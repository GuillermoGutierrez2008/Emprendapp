<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM costos_fijos WHERE id_usuario = :id_usuario ORDER BY id DESC");
    $stmt->execute([':id_usuario' => $_SESSION['usuario_id']]);
    $costos = $stmt->fetchAll();

    echo json_encode(['status' => 'success', 'data' => $costos]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al cargar los costos fijos']);
}