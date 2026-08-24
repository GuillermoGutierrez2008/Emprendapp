<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=emprendapp;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nombre = $_POST['nombre'] ?? '';
        $precio = $_POST['precio'] ?? 0;

        if (!empty($nombre)) {
            $stmt = $pdo->prepare("INSERT INTO insumos (nombre, precio) VALUES (:nombre, :precio)");
            $stmt->execute([':nombre' => $nombre, ':precio' => $precio]);

            echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
            exit;
        }
    }
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>