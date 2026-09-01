<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

try {
    $sql = "SELECT id, precio_sugerido FROM productos ORDER BY id DESC LIMIT 1";
    $stmt = $pdo->query($sql);
    $producto = $stmt->fetch();

    if ($producto) {
        echo json_encode([
            'status' => 'success',
            'precio_sugerido' => $producto['precio_sugerido']
        ]);
    } else {
        echo json_encode(['status' => 'empty', 'message' => 'No hay productos guardados']);
    }
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener el cálculo']);
}