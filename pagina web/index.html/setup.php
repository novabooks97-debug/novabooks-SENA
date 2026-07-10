<?php
// Conexión sin especificar base de datos
$conex = mysqli_connect("localhost", "root", "");

if (!$conex) {
    die("Error de conexión: " . mysqli_connect_error());
}

// Crear la base de datos si no existe
$sql_db = "CREATE DATABASE IF NOT EXISTS comentarios";
if (mysqli_query($conex, $sql_db)) {
    echo "✓ Base de datos 'comentarios' verificada/creada.\n";
} else {
    die("Error al crear la base de datos: " . mysqli_error($conex));
}

// Seleccionar la base de datos
mysqli_select_db($conex, "comentarios");

// Crear la tabla si no existe
$sql_table = "CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    opinion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (mysqli_query($conex, $sql_table)) {
    echo "✓ Tabla 'comentarios' verificada/creada.\n";
    echo "¡Configuración completada exitosamente!\n";
} else {
    die("Error al crear la tabla: " . mysqli_error($conex));
}

mysqli_close($conex);
?>
