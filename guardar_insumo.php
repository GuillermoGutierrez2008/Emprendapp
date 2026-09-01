<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$nombre = trim(filter_var($data['nombre'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
$precio = filter_var($data['precio'] ?? null, FILTER_VALIDATE_FLOAT);

if (empty($nombre) || $precio === false || $precio < 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Nombre o precio inválidos']);
    exit;
}

try {
    $sql = "INSERT INTO insumos (nombre, precio, usuario_id) VALUES (:nombre, :precio, :usuario_id)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre'     => $nombre,
        ':precio'     => $precio,
        ':usuario_id' => $_SESSION['usuario_id']
    ]);

    echo json_encode([
        'status'  => 'success',
        'message' => 'Insumo guardado correctamente',
        'id'      => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno al guardar el insumo']);
}