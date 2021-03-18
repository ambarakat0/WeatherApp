/** @format */

//------------------------------ variable ------------------------------------//
const KEY = 'fdcfe6b729dd6dbb081e284e73f72985';
const apiKey = '&appid=fdcfe6b729dd6dbb081e284e73f72985&units=imperial';
const baseURL = `https://api.openweathermap.org/data/2.5/weather?zip=`;

const generate = document.querySelector('#generate');
const zipCodeInput = document.querySelector('#zip');
const userFeelingInput = document.querySelector('#feelings');
const entryHolder = document.querySelector('#entryHolder');
const OldentryHolder = document.querySelector('#entryHolder');
const date = document.querySelector('#date');
const temp = document.querySelector('#temp');
const content = document.querySelector('#content');

let wrongZipMsg = 'Wrong zip code, try again please!';
let NoDataMsg = 'There is no data saved!';

let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

let zipCode;
let userFeeling;

//------------------------------ function ------------------------------------//
// handle user input
const getUserInput = () => {
	zipCodeInput.addEventListener('change', (e) => {
		zipCode = e.target.value;
	});
	userFeelingInput.addEventListener('change', (e) => {
		userFeeling = e.target.value;
	});
};

// fetch data from local server from saved data
const fetchStoragetData = async () => {
	const req = await fetch('/data');
	try {
		const data = await req.json();
		if (data.temp !== undefined) {
			date.innerHTML = `Date: ${data.date}`;
			temp.innerHTML = `Temp: ${data.temp}`;
			content.innerHTML = `Feelings: ${data.feelings}`;
		} else incorrect(NoDataMsg);
	} catch (err) {
		incorrect(NoDataMsg);
		console.log(err);
	}
};

// fetch data from OpenWeatherMap, (using zip and usa as default)
const getData = async (url, zip, key) => {
	try {
		const URL = `${url}${zip},us${key}`;
		const res = await fetch(URL);
		const data = await res.json();
		return {
			temp: data.main.temp,
			date: newDate,
			feelings: userFeeling,
		};
	} catch (err) {
		console.log(err);
	}
};

// post data to local server
const postData = async (path, data) => {
	try {
		const fetchData = await fetch(path, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		const d = await fetchData.json();
		return d;
	} catch (err) {
		console.log(err);
	}
};

// display msg if input user is incorrect
const incorrect = (typeOfMsg) => {
	const el = document.createElement('P');
	el.setAttribute('id', 'wrong');
	el.innerHTML = typeOfMsg;
	entryHolder.appendChild(el);
};

// update UI after recieving data
const updateUI = async (data) => {
	const el = document.querySelector('#wrong');
	if (el) entryHolder.removeChild(el);
	date.innerHTML = `Date: ${data.date}`;
	temp.innerHTML = `Temp: ${data.temp}`;
	content.innerHTML = `Feelings: ${data.feelings}`;
};

// callback function which called after click on generte btn
const callBack = async () => {
	try {
		const data = await getData(baseURL, zipCode, apiKey);
		if (data) {
			const changedData = await postData('./add', data);
			updateUI(changedData.user);
		} else {
			const el = document.querySelector('#wrong');
			entryHolder.removeChild(el);
			incorrect(wrongZipMsg);
		}
	} catch (err) {
		console.log(err);
	}
};

generate.addEventListener('click', callBack);

// init function called at the begining of app
const init = () => {
	getUserInput();
	fetchStoragetData();
};

init();
