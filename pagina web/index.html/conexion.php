<?php
// Intentar conexión con diferentes configuraciones
$conex = null;

// Primero intenta sin contraseña
$conex = @mysqli_connect("127.0.0.1", "root", "");

// Si falla, intenta con localhost
if (!$conex) {
    $conex = @mysqli_connect("localhost", "root", "");
}

// Si aún falla, muestra error detallado
if (!$conex) {
    error_log("Error de conexión MySQL: " . mysqli_connect_error());
    die("❌ Error de conexión a MySQL: " . mysqli_connect_error() . 
        "<br><br><strong>Solución:</strong> Asegúrate que MySQL esté corriendo en XAMPP.<br>" .
        "<a href='../diagnostico.php'>Ver diagnóstico</a>");
}

// Verificar/crear base de datos comentarios
$sql = "CREATE DATABASE IF NOT EXISTS comentarios";
if (!mysqli_query($conex, $sql)) {
    error_log("Error al crear BD: " . mysqli_error($conex));
}

// Seleccionar la base de datos
if (!mysqli_select_db($conex, "comentarios")) {
    error_log("Error al seleccionar BD: " . mysqli_error($conex));
    die("Error al seleccionar base de datos comentarios");
}

mysqli_set_charset($conex, "utf8mb4");
?>