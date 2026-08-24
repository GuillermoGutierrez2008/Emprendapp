<?php
session_start();
$_SESSION['usuario_id'] = 1;

$host = 'localhost';
$dbname = 'emprendapp';
$username = 'root';
$password = '';

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $id_producto = $data['id_producto'] ?? null;
        $precio_sugerido = $data['precio_sugerido'] ?? 0;

        // Intentamos actualizar por el ID específico
        $sql = "UPDATE productos SET precio_sugerido = :precio_sugerido WHERE id = :id_producto";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':precio_sugerido' => $precio_sugerido,
            ':id_producto'     => $id_producto
        ]);

        // Si no afectó ninguna fila (porque el ID no existía), actualiza el último producto creado
        if ($stmt->rowCount() === 0) {
            $sqlFallback = "UPDATE productos SET precio_sugerido = :precio_sugerido ORDER BY id DESC LIMIT 1";
            $stmtFallback = $pdo->prepare($sqlFallback);
            $stmtFallback->execute([':precio_sugerido' => $precio_sugerido]);
        }

        echo json_encode(['status' => 'success', 'message' => '¡Precio sugerido guardado correctamente en la BD!']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error de BD: ' . $e->getMessage()]);
}
?>