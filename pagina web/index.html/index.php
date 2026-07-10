<?php
include ("send.php");
?>

<!DOCTYPE html>
<html lang="es">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    NOVABOOK | Reseñas de Libros
  </title>

  <!-- CSS PRINCIPAL -->
  <link
    rel="stylesheet"
    href="./index.css"
  />

  <link
    rel="stylesheet"
    href="./chatbot.css"
  />

</head>

<body>

  <!-- VIDEO OCULTO PARA WEBCAM -->
  <video id="webcam" autoplay playsinline style="display:none"></video>
  <div id="cursor"></div>
  <div id="camera-permission-message" class="camera-permission-message hidden"></div>

  <!-- VIDEO DE FONDO -->
  <video
    autoplay
    muted
    loop
    playsinline
    class="video-fondo"
  >

    <source
      src="./imagenes/video libros.mp4"
      type="video/mp4"
    />

    Tu navegador no soporta videos HTML5.

  </video>

  <!-- CAPA OSCURA -->
  <div class="overlay"></div>

  <!-- NAVBAR -->
  <header class="navbar">

    <div class="logo">
      📚 Novabook
    </div>

    <nav>

      <a href="./index.php">
        Inicio
      </a>

      <a href="./libros.html">
        Libros
      </a>

      <a href="./comentarios.html">
        Comentarios
      </a>

      <a href="./contactanos.html">
        Contacto
      </a>

      <a href="./favoritos.html">
        Favoritos
      </a>

      <a href="./para_leer_despues.html">
        Para leer después
      </a>

      <a href="#libros-venta">
        libros a la venta
      </a>

      <a href="./iniciar sesion.html">
        iniciar sesion
      </a>

      <a href="./registrarse.html">
        registrarse
      </a>

    </nav>

  </header>

  <!-- HERO -->
  <section
    class="hero"
    id="inicio"
  >

    <div class="hero-content">

      <h1>
        Los mejores libros a la palma de tu mano
      </h1>

      <p>
        Reseñas, recomendaciones y acceso a libros gratuitos en un solo lugar.
      </p>

      <a
        href="./libros.html"
        class="btn-principal"
      >
        Explorar libros
      </a>

    </div>

  </section>

  <!-- LIBROS -->
  <section
    class="seccion libros"
    id="libros"
  >

    <h2>
      📖 Reseñas Destacadas
    </h2>

    <div class="contenedor-libros">

      <!-- LIBRO 1 -->
      <div class="card-libro">

        <img
          src="./imagenes/principito.jpg"
          alt="El Principito"
        />

        <button
          class="fav-btn"
          type="button"
          aria-label="Agregar a favoritos"
          data-titulo="El Principito"
          data-autor="Antoine de Saint-Exupéry"
          data-img="./imagenes/principito.jpg"
          data-link="https://google.com"
        >☆</button>

        <div class="contenido-card">

          <h3>
            El Principito
          </h3>

          <p class="autor">
            Antoine de Saint-Exupéry
          </p>

          <p class="reseña">
            Un clásico corto pero lleno de reflexiones sobre la vida, la amistad y el corazón.
          </p>

          <div class="estrellas">
            ⭐⭐⭐⭐⭐
          </div>

          <a
            href="https://google.com"
            target="_blank"
            class="btn-secundario"
          >
            Leer gratis
          </a>

        </div>

      </div>

      <!-- LIBRO 2 -->
      <div class="card-libro">

        <img
          src="./imagenes/don-quijote.jpg"
          alt="Don Quijote"
        />

        <button
          class="fav-btn"
          type="button"
          aria-label="Agregar a favoritos"
          data-titulo="Don Quijote de la Mancha"
          data-autor="Miguel de Cervantes"
          data-img="./imagenes/don-quijote.jpg"
          data-link="https://url-shortener.me"
        >☆</button>

        <div class="contenido-card">

          <h3>
            Don Quijote de la Mancha
          </h3>

          <p class="autor">
            Miguel de Cervantes
          </p>

          <p class="reseña">
            Una obra legendaria que mezcla humor, locura y crítica social de una forma brutal.
          </p>

          <div class="estrellas">
            ⭐⭐⭐⭐☆
          </div>

          <a
            href="https://url-shortener.me"
            target="_blank"
            class="btn-secundario"
          >
            Leer gratis
          </a>

        </div>

      </div>

      <!-- LIBRO 3 -->
      <div class="card-libro">

        <img
          src="./imagenes/dracula.jpg"
          alt="Drácula"
        />

        <button
          class="fav-btn"
          type="button"
          aria-label="Agregar a favoritos"
          data-titulo="Drácula"
          data-autor="Bram Stoker"
          data-img="./imagenes/dracula.jpg"
          data-link="https://dn720707.ca.archive.org/0/items/Dracula_243/DraculaDeBramStoker.pdf"
        >☆</button>

        <div class="contenido-card">

          <h3>
            Drácula
          </h3>

          <p class="autor">
            Bram Stoker
          </p>

          <p class="reseña">
            Terror gótico del bueno. Una historia oscura, intensa y demasiado icónica.
          </p>

          <div class="estrellas">
            ⭐⭐⭐⭐⭐
          </div>

          <a
            href="https://suneo.mx"
            target="_blank"
            class="btn-secundario"
          >
            Leer gratis
          </a>

        </div>

      </div>

    </div>

  </section>

  <!-- FORMULARIO -->
  <div class="formulario-comentario">

    <h3>
      Dejá tu comentario
    </h3>

    <form>

      <input
        type="text"
        placeholder="Tu nombre"
        required
      />

      <textarea
        placeholder="Escribí tu comentario..."
        rows="5"
        required
      ></textarea>

      <button type="submit">
        Publicar comentario
      </button>

    </form>

  </div>

  <!-- CONTACTO -->
  <section
    class="seccion contacto"
    id="contacto"
  >

    <h2>
      📩 Contacto
    </h2>

    <p>
      ¿Querés recomendar un libro o colaborar con la página?
    </p>

    <a
      href="mailto:novabooks.contact@gmail.com"
      class="btn-principal"
    >
      Escribime
    </a>

  </section>

  <!-- FOOTER -->
  <footer class="footer">

    <p>
      © 2026 Novabooks |
      Diseñado por Sofia Castillo y Kevin Granados 📚
    </p>

  </footer>

  <?php
  include ("send.php");
  ?>

  <script>
    function myFunction() {
      window.location.href = "http://localhost/pagina web";
    }
  </script>
  <script src="./chatbot-data.js"></script>
  <script src="./chatbot.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.5.0/dist/tf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/webgazer/dist/webgazer.min.js"></script>
  <script src="./gestos-ocular.js?v=2"></script>
  <script>
    console.log('gestos-ocular.js cargado');
  </script>
</body>
</html>





