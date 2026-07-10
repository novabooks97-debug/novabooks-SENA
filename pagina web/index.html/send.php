<?php
include ("conexion.php");
if(isset($_POST['send'])) {
    if ( 
    strlen($_POST['nombre']) >= 1 &&
    strlen($_POST['email']) >= 1 &&
    strlen($_POST['opinion']) >= 1
    ) {
       $name = trim($_POST['nombre']);
       $email = trim($_POST['email']);
       $opinion = trim($_POST['opinion']);

         $consulta = "INSERT INTO comentarios(nombre, email, opinion)
          VALUES ('$name','$email','$opinion')";
            $resultado = mysqli_query($conex, $consulta);
    }
}

?>