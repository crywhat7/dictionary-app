const COLORES = {
  mainBgColor: {
    light: '#fff',
    dark: '#181818',
  },
  titlePrimaryColor: {
    light: '#000',
    dark: '#fff',
  },
  primaryPurple: {
    light: '#a645eb',
    dark: '#a645eb',
  },
  secondaryPurple: {
    light: '#eacff9',
    dark: '#eacff9',
  },
  tertiaryPurple: {
    light: '#9e6ecb',
    dark: '#9e6ecb',
  },
  primaryGrey: {
    light: '#e2e2e2',
    dark: '#1b1b1b',
  },
  secondaryGrey: {
    light: '#d6d6d6',
    dark: '#2b2b2b',
  },
  fontFamily: {
    light: "'Lora', serif",
    dark: "'Lora', serif",
  },
};

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const validator = /^[a-zA-Z]+$/;

let firstResult;
let error = false;
let res;

const formulario = document.querySelector('.busqueda');
const btnSearch = document.querySelector('.busqueda i');

const wordTitle = document.querySelector('.title-phonetics .primary-title');
const phonetic = document.querySelector('.title-phonetics .phonetic');
const btnReproducir = document.querySelector('.sound-titles .btn-reproducir');
const audio = document.querySelector('.sound-titles .audio');

formulario?.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(formulario);

  const word = formData?.get('word');
  if (!word) return;

  if (!validator.test(word)) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Solo se permiten letras',
    }).then((result) => {
      if (result.isConfirmed) {
        formulario.reset();
      }
    });
    return;
  }

  getMeaning(word);
});

btnSearch?.addEventListener('click', () => {
  formulario?.dispatchEvent(new Event('submit'));
});

btnReproducir?.addEventListener('click', () => {
  toogleAudio();
});

function getMeaning(word = 'hello') {
  const url = `${API_URL}${word}`;
  fetch(url)
    .then((response) => {
      if (response.status !== 200) {
        error = true;
        console.error(
          `Looks like there was a problem. Status Code: ${response.status}`
        );
        return;
      }
      response.json().then((data) => {
        if (!data[0]) return;
        [firstResult] = data;
        error = false;
        mapearResultados(firstResult);
      });
    })
    .catch((error) => {
      console.error({ error });
    });
}

function mapearResultados(result) {
  const { word, phonetics, meanings } = result;
  const phonetic = phonetics.find((p) => p.text);
  const audio = phonetics.find((p) => p.audio);
  res = {
    word,
    phonetic: phonetic?.text ?? '',
    audio: audio?.audio ?? '',
    meanings: meanings ?? [],
  };
  render();
}

function render() {
  phonetic.textContent = res.phonetic;
  wordTitle.textContent = res.word;
  audio.src = res.audio;
}

function toogleAudio() {
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    return;
  }
  audio.pause();
}

function toggleDarkMode() {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log({ darkMode });

  changeVariables(darkMode);

  // Cambiar las variables
}
function changeVariables(darkMode) {
  const root = document.querySelector(':root');
  const color = darkMode ? 'dark' : 'light';
  const variables = Object.keys(COLORES);
  variables.forEach((variable) => {
    root.style.setProperty(`--${variable}`, COLORES[variable][color]);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getMeaning();
  toggleDarkMode();
});

window.matchMedia('(prefers-color-scheme: dark)')?.addListener(function (e) {
  toggleDarkMode();
});
