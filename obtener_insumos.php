<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

try {
    $sql = "SELECT id, nombre, precio FROM insumos WHERE usuario_id = :usuario_id ORDER BY id DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':usuario_id' => $_SESSION['usuario_id']]);
    $insumos = $stmt->fetchAll();

    echo json_encode(['status' => 'success', 'data' => $insumos]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener los insumos']);
}