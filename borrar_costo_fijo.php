<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Si falla el JSON, intentamos por POST tradicional
$id = filter_var($data['id'] ?? $_POST['id'] ?? null, FILTER_VALIDATE_INT);

if (!$id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID no proporcionado o inválido']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM costos_fijos WHERE id = :id AND id_usuario = :id_usuario");
    $stmt->execute([':id' => $id, ':id_usuario' => $_SESSION['usuario_id']]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'El costo fijo no existe']);
        exit;
    }
    
    echo json_encode(['status' => 'success', 'message' => 'Costo fijo eliminado']);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el costo fijo']);
}