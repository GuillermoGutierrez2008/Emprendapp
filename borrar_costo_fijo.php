<?php
session_start();
$_SESSION['usuario_id'] = 1;

header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'emprendapp';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $id = $_POST['id'] ?? null;

        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM costos_fijos WHERE id = :id AND id_usuario = :id_usuario");
            $stmt->execute([':id' => $id, ':id_usuario' => $_SESSION['usuario_id']]);
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'ID no proporcionado']);
        }
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>