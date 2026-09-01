<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);

if (!$id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID de insumo inválido']);
    exit;
}

try {
    $sql = "DELETE FROM insumos WHERE id = :id AND usuario_id = :usuario_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'         => $id,
        ':usuario_id' => $_SESSION['usuario_id']
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'El insumo no existe o no te pertenece']);
        exit;
    }

    echo json_encode(['status' => 'success', 'message' => 'Insumo eliminado correctamente']);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al borrar el insumo']);
}