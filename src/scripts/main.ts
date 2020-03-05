/** @license
 * Copyright (c) 2020 Jakub Koralewski MIT
 */

import { ShareButton, StateInterface } from "./interfaces";
import "../styles/style.scss";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const p = urlParams.get("p");

const STATE: StateInterface = {
	year: { i: 1, data: "2020" },
	licenser: { i: 0, data: "Jakub Koralewski" },
	option: { i: 2, data: 0 },
	i: 0,
	on: true,
};

const shareButton: ShareButton = document.querySelector("#share");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const encodeURL = () =>
	encodeURI(
		`${window.location.origin}/${STATE.licenser.data}/${STATE.year.data}/${STATE.option.data}`
	);
/* elem.data -> URL */
function setURL(): void {
	console.log("set url in", this);
	const paths = window.location.pathname.split("/");
	if (this.element) {
		this.data = this.element.value;
	}
	paths[STATE.i + this.i] = this.data;
	window.history.replaceState(
		null,
		"",
		window.location.origin + paths.join("/")
	);
	if (shareButton.isShareText) {
		shareButton.textContent = encodeURL();
	}
}

/* URL -> elem.data */
function getURL(): void {
	console.log("get url in", this);
	this.element.value = this.data;
}

STATE.year.setURL = setURL.bind(STATE.year);
STATE.licenser.setURL = setURL.bind(STATE.licenser);
STATE.option.setURL = setURL.bind(STATE.option);

STATE.year.getURL = getURL.bind(STATE.year);
STATE.licenser.getURL = getURL.bind(STATE.licenser);

if (p != null) {
	window.location.href = window.location.origin + p;
	STATE.on = false;
} else {
	const path = window.location.pathname;
	console.log("path: ", path);
	const paths = path.split("/");

	if (paths[0].trim() === "") STATE.i = 1;

	if (paths.length - STATE.i !== 3) {
		console.warn("incorrect number of arguments in ", paths);
		STATE.on = false;
	} else {
		STATE.licenser.data = decodeURI(
			paths[STATE.i + STATE.licenser.i].trim()
		);
		STATE.year.data = paths[STATE.i + STATE.year.i];
		STATE.option.data = parseInt(paths[STATE.i + STATE.option.i]);
		console.log("STATE", STATE);
	}
}

const subtitle = document.querySelector("#subtitle");

STATE.year.element = subtitle.querySelector("#year");
STATE.licenser.element = subtitle.querySelector("#licenser");

if (STATE.on) {
	// Has properties in URL
	for (const elem of [STATE.year, STATE.licenser]) {
		elem.getURL();
		elem.element.addEventListener("input", elem.setURL);
	}
} else {
	// Empty properties in URL.
	// Requires being bound to itself for some reason for `this` to work.
	const offFunc = function offFunc(elem) {
		// Create function that will set URL of each elem
		// despite even only one being written to.
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		return () => {
			[STATE.year, STATE.licenser, STATE.option].forEach(x => x.setURL());
			if (!STATE.on) {
				// Remove this function, and add.
				console.log("elem", elem);
				console.log("this", this);
				elem.element.removeEventListener("input", this);
				elem.element.addEventListener("input", elem.setURL);
			}
		};
	};

	for (const elem of [STATE.year, STATE.licenser]) {
		elem.data = elem.element.value;
		elem.element.addEventListener("input", offFunc.bind(offFunc)(elem));
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).share = function share(shareButton): void {
	console.log("Share", shareButton);
	if (shareButton.isShareText === true) {
		shareButton.textContent = shareButton.dataset.text;
		shareButton.isShareText = false;
	} else {
		shareButton.dataset.text = shareButton.textContent;
		shareButton.textContent = encodeURL();
		shareButton.isShareText = true;
	}
};
