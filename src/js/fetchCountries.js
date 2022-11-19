const Url_Countries = 'https://restcountries.com/v3.1/name/';

const fetchCountries = name => {
  return fetch(`
    ${Url_Countries}${name}?fields=name,capital,population,flags,languages`)
    .then(response => {
      console.log(response.ok);
      return response.json();
    })
    .catch(error => {
      // alert('Я не знаю такої країни');
    });
};
export { fetchCountries };
