const API_KEY = 'AIzaSyCO2q_6Fka3EIjpLX4vng2UO2aYLc1CB-8';

document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const fetchDataBtn = document.getElementById('fetchDataBtn');
  const videoInfo = document.getElementById('videoInfo');
  const thumbnail = document.getElementById('thumbnail');
  const title = document.getElementById('title');
  const duration = document.getElementById('duration');
  const downloadMp3 = document.getElementById('downloadMp3');
  const downloadMp4 = document.getElementById('downloadMp4');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const success = document.getElementById('success');

  fetchDataBtn.addEventListener('click', fetchVideoData);

  async function fetchVideoData() {
    const videoUrl = urlInput.value;
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      showError('URL de video inválida. Por favor, ingresa una URL de YouTube válida.');
      return;
    }

    showLoading();

    try {
      const videoData = await getVideoData(videoId);
      displayVideoInfo(videoData);
    } catch (err) {
      showError('Error al obtener la información del video. Por favor, intenta de nuevo.');
    }

    hideLoading();
  }

  function extractVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }

  async function getVideoData(videoId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`);
    const data = await response.json();

    if (data.items.length === 0) {
      throw new Error('Video no encontrado');
    }

    const videoInfo = data.items[0];
    return {
      title: videoInfo.snippet.title,
      thumbnail: videoInfo.snippet.thumbnails.medium.url,
      duration: formatDuration(videoInfo.contentDetails.duration)
    };
  }

  function formatDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }

  function displayVideoInfo(videoData) {
    thumbnail.src = videoData.thumbnail;
    thumbnail.alt = `Miniatura de ${videoData.title}`;
    title.textContent = videoData.title;
    duration.textContent = `Duración: ${videoData.duration}`;
    videoInfo.classList.remove('hidden');

    // Configurar los botones de descarga
    const videoId = extractVideoId(urlInput.value);
    downloadMp3.onclick = () => initiateDownload(videoId, 'mp3');
    downloadMp4.onclick = () => initiateDownload(videoId, 'mp4');
  }

  function initiateDownload(videoId, format) {
    // Aquí normalmente redirigirías a un servicio de conversión/descarga
    // Por razones legales y de TOS de YouTube, no proporcionaremos enlaces de descarga directa
    showSuccess(`Iniciando descarga de ${format.toUpperCase()}...`);
    console.log(`Descarga de ${format.toUpperCase()} para el video ${videoId}`);
  }

  function showLoading() {
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    success.classList.add('hidden');
  }

  function hideLoading() {
    loading.classList.add('hidden');
  }

  function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    success.classList.add('hidden');
  }

  function showSuccess(message) {
    success.textContent = message;
    success.classList.remove('hidden');
    error.classList.add('hidden');
  }
});

