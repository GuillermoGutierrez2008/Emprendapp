<?php
session_start();
$_SESSION['usuario_id'] = 1;

$host = 'localhost';
$dbname = 'emprendapp'; 
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        if (!isset($_SESSION['usuario_id'])) {
            die("Error: Debes iniciar sesión para realizar esta acción.");
        }

        $id_usuario_logueado = $_SESSION['usuario_id'];

        $nombre = $_POST['nombre'];
        $descripcion = $_POST['descripcion'];
        $precio = $_POST['precio'];
        $stock_actual = $_POST['stock_actual'];
        $stock_minimo = $_POST['stock_minimo'];
        
        $tipo_cuero = $_POST['tipo_cuero'];
        $color = $_POST['color'];
        $tamano = $_POST['tamano'];
        
        $pdo->beginTransaction();

        $sqlProducto = "INSERT INTO productos (id_usuario, nombre, descripcion, precio, stock_actual, stock_minimo) 
                        VALUES (:id_usuario, :nombre, :descripcion, :precio, :stock_actual, :stock_minimo)";
        
        $stmtProducto = $pdo->prepare($sqlProducto);
        $stmtProducto->execute([
            ':id_usuario' => $id_usuario_logueado,
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

        // En vez de redireccionar, devolvemos una respuesta silenciosa para AJAX
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success']);
    exit();
    } else {
        echo "Acceso no válido. Debes enviar el formulario por POST.";
    }
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "Error crítico al intentar guardar en la base de datos: " . $e->getMessage();
}
?>