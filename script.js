
//index page variables
const searchInput = document.getElementById('search-countries');
const countriesEl = document.getElementById('countries');
const countriesBox = document.querySelector('.country-box');
const filterBtn = document.getElementById('filter-countries');
const sessionInfo = JSON.parse(sessionStorage.getItem('country') ) || ''
const countriesList = [];
var bodyTypeLight = false;
//functions index page

window.onload = function () {
  filterBtn.selectIndex = 0;
  searchInput.value = '';

 if( sessionInfo != ''){
  bodyTypeLight = sessionInfo.light
  toggleLightMode()
 }

};

const createCountryElement = () => {
  const formatNumber = number => number.toLocaleString('en');


  countriesList[0].forEach((val, index) => {
    countriesEl.innerHTML += `<div id="${index}" class="country-box ${
      val.region
    } " onclick="location.href='/details/details.html';"><img src="${
      val.flags.svg
    }" alt="${val.flags.alt}"/><div class="country-details"><h3>${
      val.name
    }</h3><p>Population: <span>${formatNumber(
      val.population
    )}</span></p> <p>Region: <span>${val.region}</span></p> <p>Capital: <span>${
      val.capital
    }</span></p></div></div>`;

  });
};

const filterOptions = () => {
  const options = countriesList[0].map(val => val.region);

  const newOptions = options.filter((i, n) => options.indexOf(i) === n);

  filterBtn.innerHTML += newOptions
    .map(val => `<option value="${val}">${val}</option>`)
    .join('');
};

const getCountries = async () => {
  const resp = await fetch('./data.json');
  const data = await resp.json();

  countriesList.push(data);
  createCountryElement();
  filterOptions();
};



const toggleLightMode = (toggle) => {
  const body = document.querySelector('body');
  const button = document.getElementById('page-mode');
  const elements = document.querySelectorAll(
    'header, input, select, country-box'
  );


  if(toggle === 'toggle'){
    bodyTypeLight = !bodyTypeLight
    sessionStorage.setItem(
      'country',
      JSON.stringify({ id: sessionInfo.id ? sessionInfo.id : 0, light: bodyTypeLight })
    );
  }

  if(bodyTypeLight){
    body.classList.add('light-mode');
    button.classList.add('light-mode');


  for (let i of elements) {
    i.classList.add('light-mode');
  }
  }else{
    body.classList.remove('light-mode');
    button.classList.remove('light-mode');

    for (let i of elements) {
      i.classList.remove('light-mode');
    }
  }



  button.classList.contains('light-mode')
    ? (button.innerHTML = '<i class="fa-solid fa-moon"></i>Dark Mode')
    : (button.innerHTML = '<i class="fa-solid fa-sun"></i>Light Mode');

};

const filterCountries = value => {
  let countries = document.querySelectorAll('.country-box');

  countries.forEach(country => {
    if (value === 'all' || country.classList.contains(value)) {
      country.style.display = 'block';
    } else {
      country.style.display = 'none';
    }
  });
};

const getSearchCountry = search => {
  let countries = document.querySelectorAll('.country-box');
  let searchLowerCase = search.toLowerCase();

  countries.forEach(val => {
    let countryName = val.querySelector('h3').innerText.toLowerCase();

    val.style.display = 'block';

    if (!countryName.includes(searchLowerCase)) {
      val.style.display = 'none';
    }
  });
};

const savePageInfo = (id, bodyMode) => {
  sessionStorage.setItem(
    'country',
    JSON.stringify({ id: id, light: bodyMode })
  );
};

//Events index page

searchInput.addEventListener('input', e => {
  const search = e.target.value;

  getSearchCountry(search);
});

document.addEventListener('click', e => {
  const targetEl = e.target;
  const parentEl = targetEl.closest('div');


  if (parentEl && parentEl.classList.contains('country-box')) {
    const getChild = parentEl;
    const getId = getChild.id;

    savePageInfo(getId, bodyTypeLight);
  }
});

filterBtn.addEventListener('change', e => {
  const filterValue = e.target.value;

  filterCountries(filterValue);
});

getCountries();
