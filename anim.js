document.addEventListener('DOMContentLoaded', () => {
  const titulo = document.querySelector('#titulo');
  const tituloTextos = [
    "En este día especial, te obsequiamos estas flores amarillas. Cada una representa alegría, gratitud y nuevos comienzos.",
    "¡Gracias por ser parte de esta institución e inspirarnos todos los días con tu energía y dedicación!",
    "¡Que sigas floreciendo en cada reto!\n\n¡Feliz 21 de Septiembre!\n\nTe desea la U.E. ANZOÁTEGUI."
  ];

  let tituloIndice = 0;
  let tituloRetraso;

  function mostrarTitulo(indice) {
    if (!titulo) return;

    titulo.classList.remove('visible');
    clearTimeout(tituloRetraso);
    tituloRetraso = setTimeout(() => {
      titulo.textContent = tituloTextos[indice];
      titulo.classList.add('visible');
    }, 600);
  }

  if (titulo) {
    titulo.textContent = tituloTextos[0];
    setInterval(() => {
      tituloIndice = (tituloIndice + 1) % tituloTextos.length;
      mostrarTitulo(tituloIndice);
    }, 8000);
  }

  const audio = document.querySelector('audio');
  const lyrics = document.querySelector('#lyrics');

  if (!audio || !lyrics) {
    console.error('Faltan elementos en el DOM:', { audio: !!audio, lyrics: !!lyrics });
    return;
  }

  console.log('[main.js] listo');

  // 🔊 Iniciar audio tras primer clic (evita bloqueo de autoplay)
  document.addEventListener('click', () => {
    audio.play().catch(err => console.warn('No se pudo reproducir aún:', err));
  }, { once: true });

  // Tus datos (OK)
  const lyricsData = [
    { text: "Él la estaba esperando con una flor amarilla", time: 17 },
    { text: "Ella lo estaba soñando con la luz en su pupila", time: 25 },
    { text: "Y el amarillo del sol iluminaba la esquina", time: 32 },
    { text: "Lo sentía tan cercano, lo sentía desde niña", time: 41 },
    { text: "Ella sabía que él sabía, que algún día pasaría", time: 47 },
    { text: "Que vendría a buscarla, con sus flores amarillas", time: 52 },
    { text: "No te apures no detengas, el instante del encuentro", time: 60 },
    { text: "Está dicho que es un hecho, no la pierdas no hay derecho", time: 63 },
    { text: "No te olvides, que la vida", time: 68 },
    { text: "Casi nunca está dormida", time: 71 },
  ];

  // Estado: índice de la línea actual para no buscar desde el inicio siempre
  let idx = -1;
  const windowSeconds = 6;       // ventana durante la que se muestra una línea
  const fadeInSeconds = 0.3;     // fade-in realista
  let currentLine = null;

  function pickLine(t) {
    // Avanza el índice si ya pasaste a la siguiente línea
    if (idx + 1 < lyricsData.length && t >= lyricsData[idx + 1].time) {
      idx++;
      currentLine = lyricsData[idx];
      // Reinicia opacidad en el DOM para que el fade-in sea perceptible
      lyrics.style.opacity = 0;
      lyrics.textContent = currentLine.text;
    }
    // Si te saliste de la ventana de la línea actual, oculta
    if (currentLine && t > currentLine.time + windowSeconds) {
      currentLine = null;
      lyrics.style.opacity = 0;
      lyrics.textContent = '';
    }
  }

  function render(t) {
    if (!currentLine) return;
    const dt = t - currentLine.time;
    if (dt >= 0 && dt <= fadeInSeconds) {
      // Progreso de fade-in de 0 a 1 en 'fadeInSeconds'
      const p = Math.min(1, dt / fadeInSeconds);
      lyrics.style.opacity = p.toFixed(3);
    } else if (dt > fadeInSeconds) {
      lyrics.style.opacity = 1;
    }
  }

  // 🎯 Usa el evento timeupdate (preciso y eficiente)
  audio.addEventListener('timeupdate', () => {
    const t = audio.currentTime;          // NO usar Math.floor
    pickLine(t);
    render(t);
  });

  // ✅ Señal inicial
  lyrics.style.opacity = 0;
  lyrics.textContent = '';

  // 🕒 (Opcional) Ocultar título con JS, pero asegúrate de tener @keyframes fadeOut en CSS
  setTimeout(() => {
    const titulo = document.querySelector('.titulo');
    if (titulo) {
      titulo.style.animation = 'fadeOut 3s ease-in-out forwards';
      setTimeout(() => titulo.style.display = 'none', 3000);
    }
  }, 216000); // 3.6 min
});