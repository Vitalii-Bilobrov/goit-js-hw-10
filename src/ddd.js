import './css/styles.css';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inpValue = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const clearHtmlMarcup = ref => {
  ref.innerHTML = '';
};

const onInputValue = e => {
  let inpValue = e.target.value.trim();

  if (!inpValue) {
    clearHtmlMarcup(countryList);
    clearHtmlMarcup(countryInfo);
    return;
  }
  fetchCountries(inpValue)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      renderCountriesMarcup(data);
    })
    .catch(err => {
      clearHtmlMarcup(countryList);
      clearHtmlMarcup(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderCountriesMarcup = country => {
  if (country.length === 1) {
    clearHtmlMarcup(countryList);
    countryInfo.innerHTML = createInfoCountries(country);
  } else {
    clearHtmlMarcup(countryInfo);
    countryList.innerHTML = createListCountries(country);
  }
};
const createListCountries = country => {
  return country
    .map(
      ({ name, flags }) => `
      <li class="list__item"><img src="${flags.png}" alt="${name.official}" width=60 height=50> ${name.official}</li>
    `
    )
    .join('');
};

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

inpValue.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY));
