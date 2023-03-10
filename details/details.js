const container = document.querySelector('.container-detail');
var ligthMode;
//https://restcountries.com/v3.1/name/{name}?fullText=true

const getLocalStorageInfo = () => {
  let country;
  let body = document.querySelector('body');
  const info = JSON.parse(sessionStorage.getItem('country')) || {};

  country = info.country;
  ligthMode = info.light;

  ligthMode
    ? body.classList.add('light-mode')
    : body.classList.remove('light-mode');

  getCountry(country);
};

const saveLocalStoragePageInfo = value => {
  localStorage.setItem(
    'country',
    JSON.stringify({ country: value, light: ligthMode })
  );
};

const getCountry = async name => {
  const resp = await fetch(`https://restcountries.com/v2/name/${name}`);
  const data = await resp.json();

  showInfoCountry(data[0]);
};

const getCountryByCode = async code => {
  const resp = await fetch(`https://restcountries.com/v2/alpha/${code}`);
  const data = await resp.json();

  showInfoCountry(data);
  saveLocalStoragePageInfo(data.name);
};

const showInfoCountry = list => {
  const getCurrencies = () => {
    let currenciesListName = [];
    let currenciesListSymbol = [];
    for (let i of list.currencies) {
      currenciesListSymbol.push(i.symbol);
      currenciesListName.push(i.name);
    }

    let formatName = currenciesListName.join(', ');
    let formatSymbol = currenciesListSymbol.join(', ');

    let format = formatSymbol + '  ' + formatName;

    return format;
  };

  const getLanguages = () => {
    let languagesList = [];
    for (let i of list.languages) {
      languagesList.push(i.name);
    }

    return languagesList.join(', ');
  };

  const formatNumber = number => number.toLocaleString('en');

  container.innerHTML = `
  <div class="flag-details">
    <img src="${list.flags.svg == '' ? list.flags.png : list.flags.svg}" alt="${
    !'undefined ' ? list.flags.alt : ''
  }"/>
  </div>
  <div class="box-detail-details">
  <div class="country-detail-details">
    <h3>${list.name.length > 20 ? list.nativeName : list.name}</h3>
    <div class="details-p">
    <p>Native Name: <span>${list.nativeName}</span></p>
    <p>Population: <span>${formatNumber(list.population)}</span></p>
    <p>Region: <span>${list.region}</span></p>
    <p>Sub Region: <span>${list.subregion}</span></p>
    <p>Capital: <span>${list.capital}</span></p>
    <p>Top Level Domain: <span>${list.topLevelDomain[0]}</span></p>
    <p>Currencies: <span>${getCurrencies()}</span></p>
    <p>Languages: <span>${getLanguages()}</span></p>
    </div>
    </div>
    <div class="border-details">
    <p >Border Countries: </p>
    </div>
  </div>
  `;

  let countriesList = [];
  let buttonDiv = document.querySelector('.border-details');

  if (list.borders != undefined) {
    for (let i of list.borders) {
      countriesList.push(i);
    }

    if (countriesList.length > 4) {
      countriesList.length = 4;
    }
    for (let i of countriesList) {
      let button = document.createElement('button');
      button.innerHTML = i;
      buttonDiv.appendChild(button);

      button.addEventListener('click', () => {
        getCountryByCode(i);
      });
    }
  }
};
getLocalStorageInfo();
