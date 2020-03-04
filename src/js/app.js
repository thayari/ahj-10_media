const container = document.querySelector('.container');
const inputText = document.getElementById('input-text');
const modal = document.querySelector('.modal');
// const messages = [];
const currentMessage = {};

function post() {
  const newPost = `<article class="post">
    <div class="post-text">
      ${currentMessage.text}
    </div>
    <footer class="coords">
      [${currentMessage.coordinates[0]}, ${currentMessage.coordinates[1]}]
    </footer>
  </article>`;
  container.insertAdjacentHTML('afterbegin', newPost);
}

// параметры геолокации
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;
  currentMessage.coordinates = [crd.latitude, crd.longitude];
  post();
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  modal.classList.remove('hidden');
}

inputText.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && inputText.value !== '') {
    navigator.geolocation.getCurrentPosition(success, error, options);
    currentMessage.text = inputText.value;
    inputText.value = '';
  }
});
