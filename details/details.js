const container = document.querySelector('.container-detail');
 const sessionStorageInfo = JSON.parse(sessionStorage.getItem('country')) || {};
var lightMode;

//https://restcountries.com/v3.1/name/{name}?fullText=true

const getSessionStorageInfo = () => {
  let countryId;
  let body = document.querySelector('body');

  countryId = sessionStorageInfo.id;
  lightMode = sessionStorageInfo.light;

  lightMode
    ? body.classList.add('light-mode')
    : body.classList.remove('light-mode');

  getCountryById(countryId);
};

const getCountryById = async id => {
  const resp = await fetch(`../data.json`);
  const data = await resp.json();

  showInfoCountry(data[id]);
};

const getCountryByCode = async code => {
  const resp = await fetch(`../data.json`);
  const data = await resp.json();

  const country = data.find(data => {
    return Object.values(data).some(val => val === code)
  })

  let countryId = Object.values(data).indexOf(country)

  sessionStorage.setItem('country',
    JSON.stringify({id: countryId, light: lightMode})
  )

  showInfoCountry(country)
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
getSessionStorageInfo();
