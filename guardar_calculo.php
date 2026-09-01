<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id_producto = filter_var($data['id_producto'] ?? null, FILTER_VALIDATE_INT);
$precio_sugerido = filter_var($data['precio_sugerido'] ?? null, FILTER_VALIDATE_FLOAT);

if ($id_producto === false || $id_producto === null || $precio_sugerido === false || $precio_sugerido < 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Datos de entrada inválidos']);
    exit;
}

try {
    $sql = "UPDATE productos SET precio_sugerido = :precio_sugerido WHERE id = :id_producto";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':precio_sugerido' => $precio_sugerido,
        ':id_producto'     => $id_producto
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'El producto no existe o el precio es el mismo']);
        exit;
    }

    echo json_encode(['status' => 'success', 'message' => '¡Precio sugerido guardado correctamente!']);
} catch (PDOException $e) {
    error_log($e->getMessage()); // Guarda el error real en el server de manera privada
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el precio']);
}