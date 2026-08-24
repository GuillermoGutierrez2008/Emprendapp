<!-- registrar_marroquineria.php -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registrar Producto - Marroquinería</title>
</head>
<body>
    <h2>Registrar Nuevo Producto de Marroquinería</h2>
    <form action="procesar_producto.php" method="POST">
        <!-- Datos del Producto Base -->
        <fieldset>
            <legend>Datos Generales del Producto</legend>
            <label for="nombre">Nombre del Producto:</label>
            <input type="text" id="nombre" name="nombre" required placeholder="Ej: Bolso Matero">
            
            <label for="descripcion">Descripción:</label>
            <textarea id="descripcion" name="descripcion" required></textarea>
        </fieldset>

        <!-- Datos de la Variante -->
        <fieldset>
            <legend>Especificaciones (Variante)</legend>
            <label for="tipo_cuero">Tipo de Cuero:</label>
            <select id="tipo_cuero" name="tipo_cuero" required>
                <option value="Vaca">Vaca</option>
                <option value="Oveja">Oveja</option>
                <option value="Sintético">Sintético (PU)</option>
                <option value="Gamuza">Gamuza</option>
            </select>

            <label for="color">Color:</label>
            <input type="text" id="color" name="color" required placeholder="Ej: Suela, Negro, Rojo">

            <label for="tamano">Tamaño:</label>
            <input type="text" id="tamano" name="tamano" required placeholder="Ej: Chico, Mediano, 30x40cm">

            <label for="precio">Precio de esta variante:</label>
            <input type="number" step="0.01" id="precio" name="precio" required>
            
            <label for="stock">Stock inicial:</label>
            <input type="number" id="stock" name="stock" required>
        </fieldset>

        <button type="submit">Guardar Producto y Variante</button>
    </form>
</body>
</html>