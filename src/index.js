import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const cleanField = field => {
  field.innerHTML = '';
};

const onInputFormType = event => {
  const dataInput = event.target.value.trim();

  if (!dataInput) {
    cleanField(countryList);
    cleanField(countryInfo);
    return;
  }
  fetchCountries(dataInput)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      createResult(data);
    })
    .catch(error => {
      cleanField(countryList);
      cleanField(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
};

function renderCountriesList(country) {
  return country
    .map(({ name, flags }) => {
      return `<li>
           <img src="${flags.png}" alt="${name.official}" width=70 height=40>
           ${name.official}
          </li>`;
    })
    .join('');
  // countryList.innerHTML = markup;
}
const createInfoCountries = country => {
  return country.map(({ name, capital, population, flags, languages }) => {
    return `
        <h1 class="headline"><img src="${flags.png}" alt="${
      name.official
    }" width=40 heigth=30> ${name.official}</h1>
        <p class="descrip">Capital: ${capital}</p>
        <p class="descrip">Population: ${population}</p>
        <p class="descrip">Languages: ${Object.values(languages)}</p>
      `;
  });
};
const createResult = country => {
  if (country.length === 1) {
    cleanField(countryList);
    countryInfo.innerHTML = createInfoCountries(country);
  } else {
    cleanField(countryInfo);
    countryList.innerHTML = renderCountriesList(country);
  }
};
inputField.addEventListener('input', debounce(onInputFormType, DEBOUNCE_DELAY));
