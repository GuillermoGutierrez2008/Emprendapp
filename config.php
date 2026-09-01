<?php
session_start();

// Si no hay sesión iniciada, asignamos usuario temporal
if (!isset($_SESSION['usuario_id'])) {
    $_SESSION['usuario_id'] = 1;
}

$host = 'localhost';
$dbname = 'emprendapp';
$username = 'root';
$password = '';

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos']);
    exit;
}