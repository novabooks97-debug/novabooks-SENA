// gestos-ocular.js
// Control por gestos faciales y seguimiento ocular global para toda la página.

const videoElement = document.getElementById('webcam');
const cursorEl = document.getElementById('cursor');
const permissionMessage = document.getElementById('camera-permission-message');
const header = document.querySelector('header.navbar');

let lastScrollY = window.scrollY;
let scrollVelocity = 0;
let lastBlinkTime = 0;
let gazeX = window.innerWidth / 2;
let gazeY = window.innerHeight / 2;
let smoothedX = gazeX;
let smoothedY = gazeY;
let gestureActive = false;

const SMILE_THRESHOLD = 2.2; // Ratio ancho/boca altura más alto = sonrisa.
const HARD_BLINK_THRESHOLD = 0.20; // Valor aproximado de parpadeo fuerte.
const HEAD_UP_THRESHOLD = -0.018; // Mover cabeza hacia arriba detectado por cambio relativo de nariz.
const BLINK_COOLDOWN_MS = 1200;
const SMOOTHING = 0.18;

function showPermissionMessage(text) {
  permissionMessage.textContent = text;
  permissionMessage.classList.remove('hidden');
}

function hidePermissionMessage() {
  permissionMessage.classList.add('hidden');
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalizeViewport(point) {
  return {
    x: Math.min(Math.max(point.x * window.innerWidth, 0), window.innerWidth),
    y: Math.min(Math.max(point.y * window.innerHeight, 0), window.innerHeight)
  };
}

function computeEyeAspectRatio(landmarks, left, right, top, bottom) {
  const horizontal = distance(landmarks[left], landmarks[right]);
  const vertical = distance(landmarks[top], landmarks[bottom]);
  return vertical / horizontal;
}

function simulateClick(x, y) {
  const element = document.elementFromPoint(x, y);
  if (!element || element.id === 'cursor') return;
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y
  });
  element.dispatchEvent(event);
}

function updateHeaderOnScroll() {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScrollY) {
    header.classList.add('navbar-hidden');
  } else {
    header.classList.remove('navbar-hidden');
  }
  lastScrollY = currentScroll;
}

window.addEventListener('scroll', updateHeaderOnScroll);

function startScrollLoop() {
  if (scrollVelocity !== 0) {
    window.scrollBy(0, scrollVelocity);
  }
  requestAnimationFrame(startScrollLoop);
}

function updateCursor() {
  smoothedX += (gazeX - smoothedX) * SMOOTHING;
  smoothedY += (gazeY - smoothedY) * SMOOTHING;
  cursorEl.style.left = `${smoothedX}px`;
  cursorEl.style.top = `${smoothedY}px`;
  requestAnimationFrame(updateCursor);
}

function handleFaceGestures(landmarks) {
  if (!landmarks) return;

  const leftMouth = landmarks[61];
  const rightMouth = landmarks[291];
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  const mouthRatio = distance(leftMouth, rightMouth) / Math.max(distance(upperLip, lowerLip), 0.01);

  const leftEAR = computeEyeAspectRatio(landmarks, 33, 133, 159, 145);
  const rightEAR = computeEyeAspectRatio(landmarks, 362, 263, 386, 374);
  const averageEAR = (leftEAR + rightEAR) / 2;

  const noseTip = landmarks[1];
  const forehead = landmarks[10];
  const headPitch = noseTip.y - forehead.y;

  const isSmiling = mouthRatio > SMILE_THRESHOLD;
  const isHardBlink = averageEAR < HARD_BLINK_THRESHOLD;
  const isLookingUp = headPitch < HEAD_UP_THRESHOLD;

  if (isSmiling) {
    scrollVelocity = 3;
  } else if (isLookingUp) {
    scrollVelocity = -3;
  } else {
    scrollVelocity = 0;
  }

  if (isHardBlink && Date.now() - lastBlinkTime > BLINK_COOLDOWN_MS) {
    lastBlinkTime = Date.now();
    simulateClick(smoothedX, smoothedY);
  }

  gestureActive = true;
}

function onFaceMeshResults(results) {
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];
    handleFaceGestures(landmarks);
  }
}

async function initializeCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    videoElement.srcObject = stream;
    await videoElement.play();
    hidePermissionMessage();

    const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.65
    });
    faceMesh.onResults(onFaceMeshResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await faceMesh.send({ image: videoElement });
      },
      width: 640,
      height: 480
    });

    camera.start();
  } catch (error) {
    console.error('Error inicializando la cámara:', error);
    showPermissionMessage('Permite el acceso a la cámara para usar el control por gestos faciales. Revisa tu configuración de permisos.');
  }
}

function initializeWebGazer() {
  if (!window.webgazer) {
    showPermissionMessage('No se cargó WebGazer. Verifica la conexión CDN e intenta recargar la página.');
    return;
  }

  webgazer.setRegression('ridge')
    .setGazeListener((data) => {
      if (data) {
        gazeX = data.x;
        gazeY = data.y;
      }
    })
    .begin()
    .showVideo(false)
    .showFaceOverlay(false)
    .showFaceFeedbackBox(false)
    .showPredictionPoints(false);
}

window.addEventListener('load', () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showPermissionMessage('Tu navegador no soporta la cámara web necesaria para el control por gestos.');
    return;
  }
  initializeCamera();
  initializeWebGazer();
  updateCursor();
  startScrollLoop();
});
