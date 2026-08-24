<?php
session_start();
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'emprendapp';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Traemos el precio sugerido del último producto modificado/guardado
    $sql = "SELECT id, precio_sugerido FROM productos ORDER BY id DESC LIMIT 1";
    $stmt = $pdo->query($sql);
    $producto = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($producto) {
        echo json_encode([
            'status' => 'success',
            'precio_sugerido' => $producto['precio_sugerido']
        ]);
    } else {
        echo json_encode(['status' => 'empty']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>