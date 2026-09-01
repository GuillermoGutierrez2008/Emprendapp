<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$nombre = trim(filter_var($data['nombre'] ?? $_POST['nombre'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
$monto = filter_var($data['monto'] ?? $_POST['monto'] ?? null, FILTER_VALIDATE_FLOAT);

if (empty($nombre) || $monto === false || $monto <= 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Campos inválidos']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO costos_fijos (id_usuario, nombre, monto) VALUES (:id_usuario, :nombre, :monto)");
    $stmt->execute([
        ':id_usuario' => $_SESSION['usuario_id'],
        ':nombre' => $nombre,
        ':monto' => $monto
    ]);

    echo json_encode([
        'status' => 'success', 
        'message' => 'Costo fijo guardado',
        'id' => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar el costo fijo']);
}