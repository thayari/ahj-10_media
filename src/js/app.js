/* eslint-disable prefer-destructuring */
import { checkCoordinates } from './checkCoordinates';

const moment = require('moment');

const container = document.querySelector('.container');
const inputText = document.getElementById('input-text');
const modalCoords = document.querySelector('.modal-coords');
const modalError = document.querySelector('.modal-error');
const buttonAudio = document.querySelector('.button-audio');
const buttonVideo = document.querySelector('.button-video');
const buttonRecOk = document.querySelector('.button-recording-ok');
const buttonRecCancel = document.querySelector('.button-recording-cancel');
const currentMessage = {};
const cancelButtons = document.querySelectorAll('.cancel');
const recTimer = document.querySelector('.recording-timer');
const recording = document.querySelector('.recording');

moment.locale('ru');

function post() {
  inputText.value = '';
  const newPost = document.createElement('article');
  newPost.classList.add('post');
  const postDate = document.createElement('div');
  postDate.classList.add('post-date');
  postDate.innerText = moment().format('LLL');
  const postText = document.createElement('div');
  postText.classList.add('post-text');
  postText.append(currentMessage.content);
  const coords = document.createElement('footer');
  coords.classList.add('coords');
  coords.innerText = `[${currentMessage.coordinates[0]}, ${currentMessage.coordinates[1]}]`;
  newPost.append(postDate);
  newPost.append(postText);
  newPost.append(coords);
  container.insertAdjacentElement('afterbegin', newPost);
}

function showErrorModal(errorText) {
  modalError.classList.remove('hidden');
  modalError.querySelector('.error-text').textContent = errorText;
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
  modalCoords.classList.remove('hidden');
  const coordsInput = modalCoords.querySelector('input');
  coordsInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      try {
        currentMessage.coordinates = checkCoordinates(coordsInput.value);
        modalCoords.classList.add('hidden');
        post();
      } catch (e) {
        showErrorModal(e);
      }
    }
  });
}

inputText.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && inputText.value !== '') {
    currentMessage.content = inputText.value;
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
});

cancelButtons.forEach((elem) => {
  elem.addEventListener('click', (event) => {
    event.target.closest('.modal').classList.add('hidden');
  });
});

function toggleControls() {
  buttonAudio.classList.toggle('hidden');
  buttonVideo.classList.toggle('hidden');
  recording.classList.toggle('hidden');
}

let minutes = 0;
let seconds = 0;
let minutesText = '00';
let secondsText = '00';
let timerStopped = true;

function timer() {
  if (!timerStopped) {
    seconds += 1;
    if (seconds < 10) {
      secondsText = `0${seconds}`;
    } else if (seconds < 60) {
      secondsText = seconds;
    } else if (seconds === 60) {
      seconds = 0;
      minutes += 1;
      if (minutes < 10) {
        minutesText = `0${minutes}`;
      } else {
        minutesText = minutes;
      }
    }
    recTimer.innerText = `${minutesText}:${secondsText}`;

    setTimeout(timer, 1000);
  }
}

function timerStart() {
  timerStopped = false;
  setTimeout(timer, 1000);
}

function timerStop() {
  timerStopped = true;
  minutes = 0;
  seconds = 0;
  recTimer.innerText = '00:00';
}

async function audioRec() {
  if (!navigator.mediaDevices) {
    return;
  }
  try {
    const audio = document.createElement('audio');
    audio.setAttribute('controls', null);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const recorder = new MediaRecorder(stream);

    let recOk;
    buttonRecOk.addEventListener('click', () => {
      recOk = true;
      recorder.stop();
    });

    buttonRecCancel.addEventListener('click', () => {
      recOk = false;
      recorder.stop();
    });

    const chunks = [];
    recorder.addEventListener('start', () => {
      console.log('recording started');
      toggleControls();
      timerStart();
    });
    recorder.addEventListener('dataavailable', (event) => {
      console.log('data available');
      chunks.push(event.data);
    });
    recorder.addEventListener('stop', () => {
      timerStop();
      toggleControls();
      console.log('recording stopped');
      if (recOk) {
        const blob = new Blob(chunks);
        audio.src = URL.createObjectURL(blob);
        navigator.geolocation.getCurrentPosition(success, error, options);
        currentMessage.content = audio;
      }
    });

    recorder.start();
  } catch (e) {
    showErrorModal(e);
    console.error(e);
  }
}

async function videoRec() {
  if (!navigator.mediaDevices) {
    return;
  }
  try {
    const video = document.createElement('video');
    video.setAttribute('controls', null);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const recorder = new MediaRecorder(stream);

    let recOk;
    buttonRecOk.addEventListener('click', () => {
      recOk = true;
      recorder.stop();
    });

    buttonRecCancel.addEventListener('click', () => {
      recOk = false;
      recorder.stop();
    });

    const chunks = [];
    recorder.addEventListener('start', () => {
      console.log('recording started');
      toggleControls();
      timerStart();
    });
    recorder.addEventListener('dataavailable', (event) => {
      console.log('data available');
      chunks.push(event.data);
    });
    recorder.addEventListener('stop', () => {
      timerStop();
      toggleControls();
      console.log('recording stopped');
      if (recOk) {
        const blob = new Blob(chunks);
        video.src = URL.createObjectURL(blob);
        navigator.geolocation.getCurrentPosition(success, error, options);
        currentMessage.content = video;
      }
    });
    recorder.start();
    setTimeout(() => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    }, 5000);
  } catch (e) {
    showErrorModal(e);
    console.error(e);
  }
}

buttonAudio.addEventListener('click', () => {
  console.log('start audio recording');
  audioRec();
});

buttonVideo.addEventListener('click', () => {
  console.log('start audio recording');
  videoRec();
});
