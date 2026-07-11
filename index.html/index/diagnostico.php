<?php
echo "<h2>🔧 Diagnóstico de MySQL - XAMPP</h2>";
echo "<hr>";

// Verificar si la extensión mysqli está disponible
echo "<p><strong>✓ Extensión mysqli:</strong> ";
if (extension_loaded('mysqli')) {
    echo "✅ Cargada</p>";
} else {
    echo "❌ NO CARGADA - Revisa php.ini</p>";
}

// Intentar conexión
echo "<p><strong>Intentando conectar a MySQL...</strong></p>";

$conexiones = [
    "127.0.0.1 sin contraseña" => ["127.0.0.1", "root", ""],
    "localhost sin contraseña" => ["localhost", "root", ""],
    "127.0.0.1 con contraseña vacía" => ["127.0.0.1", "root", "", "comentarios"],
];

$conectado = false;
foreach ($conexiones as $nombre => $config) {
    echo "<p>Probando: <strong>$nombre</strong> ... ";
    
    if (count($config) == 3) {
        $conex = @mysqli_connect($config[0], $config[1], $config[2]);
    } else {
        $conex = @mysqli_connect($config[0], $config[1], $config[2], $config[3]);
    }
    
    if ($conex) {
        echo "✅ ÉXITO</strong></p>";
        $conectado = true;
        
        // Información del servidor
        $version = mysqli_get_server_info($conex);
        echo "<p>Versión MySQL/MariaDB: <strong>$version</strong></p>";
        
        // Crear/Verificar base de datos
        $result = mysqli_query($conex, "CREATE DATABASE IF NOT EXISTS comentarios");
        if ($result) {
            echo "<p>✅ Base de datos 'comentarios' lista</p>";
            
            // Seleccionar y crear tabla
            mysqli_select_db($conex, "comentarios");
            $sql = "CREATE TABLE IF NOT EXISTS comentarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                opinion TEXT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )";
            if (mysqli_query($conex, $sql)) {
                echo "<p>✅ Tabla 'comentarios' lista</p>";
            }
        }
        
        mysqli_close($conex);
        break;
    } else {
        echo "❌ " . mysqli_connect_error() . "</p>";
    }
}

if (!$conectado) {
    echo "<hr>";
    echo "<p style='color: red;'><strong>⚠️ No se pudo conectar a MySQL</strong></p>";
    echo "<p><strong>Soluciones:</strong></p>";
    echo "<ol>";
    echo "<li>Abre XAMPP Control Panel</li>";
    echo "<li>Haz clic en 'Start' en la fila de MySQL</li>";
    echo "<li>Espera a que aparezca 'Running'</li>";
    echo "<li>Recarga esta página</li>";
    echo "</ol>";
} else {
    echo "<hr>";
    echo "<p style='color: green;'><strong>✅ Todo está listo. Tu página web debería funcionar correctamente.</strong></p>";
    echo "<p><a href='./index.php'>Ir a la página principal</a></p>";
}
?>
