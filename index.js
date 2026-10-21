// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

// Step 1: Fetch the data
function fetchWeatherAlerts(state) {
  const url = `https://api.weather.gov/alerts/active?area=${state}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}. Check the state code.`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // for testing
      return data;
    });
}

// Step 2: Display the data
function displayAlerts(data) {
  alertsDisplay.textContent = ''; // remove any previous data

  const summary = document.createElement('p');
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  const list = document.createElement('ul');
  data.features.forEach(alert => {
    const li = document.createElement('li');
    li.textContent = alert.properties.headline;
    list.appendChild(li);
  });
  alertsDisplay.appendChild(list);
}

// Step 4: Error helpers
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  alertsDisplay.textContent = '';
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

// Click handler ties everything together
fetchButton.addEventListener('click', () => {
  const state = stateInput.value.trim().toUpperCase();

  // Step 5: input validation (also covers empty input)
  if (!/^[A-Z]{2}$/.test(state)) {
    showError('Please enter a valid two-letter state abbreviation (e.g. MN).');
    return;
  }

  // Step 5: loading indicator
  alertsDisplay.textContent = 'Loading...';
  clearError();

  fetchWeatherAlerts(state)
    .then(data => {
      displayAlerts(data);
      clearError();            // hide the error div on success
      stateInput.value = '';   // Step 3: clear the input field
    })
    .catch(error => {
      console.log(error.message);
      showError(error.message);
    });
});