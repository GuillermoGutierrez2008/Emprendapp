<?php
session_start();
$_SESSION['usuario_id'] = 1; // ID de prueba por ahora

header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'emprendapp';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $nombre = $_POST['nombre'] ?? '';
        $monto = $_POST['monto'] ?? 0;
        $id_usuario = $_SESSION['usuario_id'];

        if (empty($nombre) || $monto <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'Campos inválidos']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO costos_fijos (id_usuario, nombre, monto) VALUES (:id_usuario, :nombre, :monto)");
        $stmt->execute([
            ':id_usuario' => $id_usuario,
            ':nombre' => $nombre,
            ':monto' => $monto
        ]);

        echo json_encode(['status' => 'success']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>