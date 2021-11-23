const dropdown = document.querySelector(".dropdown");
const clear = document.getElementById("clear");
const countryElm = document.querySelector('.countries');

callCountryAll();


dropdown.addEventListener("click", displayCountryNeighbours);
clear.addEventListener("click", clearFunction);





function clearFunction() {
    countryElm.innerHTML = "";
}

function displayCountryNeighbours(e) {
    e.preventDefault();
    let countryName = e.target.innerText;
    console.log(countryName)
    showCountryWithNeighboars(countryName);
}

async function callCountryAll() {
    let response = await fetch("https://restcountries.com/v3.1/all");
    let countryName = await response.json()

    countryName
        .map(array => array.name.common)
        .forEach(country => {
            dropdown.innerHTML += `<li><a class="dropdown-item" href="#">${country}</a></li>`
        });

}



const renderCountry = (data, className = '') => {
    const {
        name: { common: countryName },
        region,
        capital,
        flags: { svg: countryFlag },
        population,
        languages,
        currencies,
    } = data;
    const countryElm = document.querySelector('.countries');
    const htmlContent = `
  <div class="country ${className}">
    <img class="country__img" src="${countryFlag}" />
    <div class="country__data">
      <h3 class="country__name">${countryName}</h3>
      <h4 class="country__region">${region}</h4>
      <p class="country__row">
              <span><i class="fas fa-2x fa-landmark"></i></span>${capital}</p>
      <p class="country__row"> <span><i class="fas fa-lg fa-users"></i></span>${(
        +population / 1_000_000
      ).toFixed(1)}M People</p>
      <p class="country__row"><span><i class="fas fa-lg fa-comments"></i></span>${
        Object.values(languages)[0]
      }</p>
      <p class="country__row"><span><i class="fas fa-lg fa-money-bill-wave"></i></span>${
        Object.values(currencies)[0].name
      } <strong>${Object.values(currencies)[0].symbol}</strong>
      </p>
    </div>
  </div>
  `;
    countryElm.insertAdjacentHTML('beforeend', htmlContent);
    countryElm.style.opacity = 1;
};





//---------------ASYNC--------------------


const getCountryDataByName = async countryName => {

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        if (!response.ok) throw new Error(`Something is wrong!  ${response.status}`);
        const data = await response.json();
        //const [countryData] = data;
        return data[0];

    } catch (error) {
        console.log(error.message)
        renderError(error.message)

    } finally {
        console.log("teknik bir sorun oluştu tekrar deneyin");
    }

}
const showCountry = async(countryName) => {
    try {
        const countryData = await getCountryDataByName(countryName);
        renderCountry(countryData);
    } catch (error) {
        console.log(error.message)
        renderError(error.message)
    }


}

//---------------API-CODE------------

const getCountryDataByCode = async countryCode => {

    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        if (!response.ok) throw new Error(`Something is wrong!  ${response.status}`);
        const data = await response.json();
        //const [countryData] = data;
        return data[0];

    } catch (error) {
        console.log(error.message)
        renderError(error.message)

    } finally {
        console.log("teknik bir sorun oluştu tekrar deneyin");
    }

}
const renderError = (message) => {
    const countryElm = document.querySelector('.countries');
    countryElm.insertAdjacentText('beforeend', message);
    countryElm.style.opacity = 1;
};



const showCountryWithNeighboars = async(countryName) => {
    try {
        const countryData = await getCountryDataByName(countryName);

        renderCountry(countryData);
        const neighboars = countryData.borders;
        if (!neighboars) {
            throw new Error('No neighbours 🤷‍♀️');

        }
        neighboars.forEach(async neighbour => {
            const neighbourData = await getCountryDataByCode(neighbour);
            renderCountry(neighbourData, "neighbour");

        });



    } catch (error) {
        renderError(error.message);
    }


}