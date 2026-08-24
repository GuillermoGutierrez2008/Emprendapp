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

    $stmt = $pdo->prepare("SELECT * FROM costos_fijos WHERE id_usuario = :id_usuario ORDER BY id DESC");
    $stmt->execute([':id_usuario' => $_SESSION['usuario_id']]);
    $costos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($costos);
} catch (PDOException $e) {
    echo json_encode([]);
}
?>