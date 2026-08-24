<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['id'])) {
    $id = $_POST['id'];

    try {
        // Tu conexión exacta con PDO
        $pdo = new PDO("mysql:host=localhost;dbname=emprendapp;charset=utf8", "root", "");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Preparamos la orden de borrar
        $stmt = $pdo->prepare("DELETE FROM insumos WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(['status' => 'success']);

    } catch (PDOException $e) {
        // Si hay error, nos avisa qué pasó
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se recibió un ID válido']);
}
?>