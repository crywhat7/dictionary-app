const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const validator = /^[a-zA-Z]+$/;

let firstResult;
let error = false;
let res;

const formulario = document.querySelector('.busqueda');
const btnSearch = document.querySelector('.busqueda i');

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
  console.log(res);
}

document.addEventListener('DOMContentLoaded', () => {
  getMeaning();
});
