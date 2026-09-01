<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Debes iniciar sesión para realizar esta acción.']);
    exit;
}

// Sanitización de todas las entradas del formulario
$nombre = trim(filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_SPECIAL_CHARS));
$descripcion = trim(filter_input(INPUT_POST, 'descripcion', FILTER_SANITIZE_SPECIAL_CHARS));
$precio = filter_input(INPUT_POST, 'precio', FILTER_VALIDATE_FLOAT);
$stock_actual = filter_input(INPUT_POST, 'stock_actual', FILTER_VALIDATE_INT);
$stock_minimo = filter_input(INPUT_POST, 'stock_minimo', FILTER_VALIDATE_INT);

$tipo_cuero = trim(filter_input(INPUT_POST, 'tipo_cuero', FILTER_SANITIZE_SPECIAL_CHARS));
$color = trim(filter_input(INPUT_POST, 'color', FILTER_SANITIZE_SPECIAL_CHARS));
$tamano = trim(filter_input(INPUT_POST, 'tamano', FILTER_SANITIZE_SPECIAL_CHARS));

if (!$nombre || $precio === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Datos obligatorios faltantes o inválidos']);
    exit;
}

try {
    $pdo->beginTransaction();

    $sqlProducto = "INSERT INTO productos (id_usuario, nombre, descripcion, precio, stock_actual, stock_minimo) 
                    VALUES (:id_usuario, :nombre, :descripcion, :precio, :stock_actual, :stock_minimo)";
    
    $stmtProducto = $pdo->prepare($sqlProducto);
    $stmtProducto->execute([
        ':id_usuario' => $_SESSION['usuario_id'],
        ':nombre' => $nombre,
        ':descripcion' => $descripcion,
        ':precio' => $precio,
        ':stock_actual' => $stock_actual,
        ':stock_minimo' => $stock_minimo
    ]);

    $id_producto = $pdo->lastInsertId();

    $sqlVariante = "INSERT INTO variantes_marroquineria (id_producto, tipo_cuero, color, tamano) 
                    VALUES (:id_producto, :tipo_cuero, :color, :tamano)";
    
    $stmtVariante = $pdo->prepare($sqlVariante);
    $stmtVariante->execute([
        ':id_producto' => $id_producto,
        ':tipo_cuero' => $tipo_cuero,
        ':color' => $color,
        ':tamano' => $tamano
    ]);

    $pdo->commit();

    echo json_encode(['status' => 'success', 'message' => 'Producto registrado correctamente']);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error crítico al intentar guardar en la base de datos']);
}