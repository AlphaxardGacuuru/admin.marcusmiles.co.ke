import _ from "lodash"
import $ from "jquery"
import "bootstrap/dist/js/bootstrap.bundle"
import CryptoJS from "crypto-js"
import axios from "axios"

window._ = _

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
	window.$ = window.jQuery = $
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

// Function for checking local storage
const getLocalStorage = (state) => {
	if (typeof window !== "undefined" && localStorage.getItem(state)) {
		return JSON.parse(localStorage.getItem(state))
	} else {
		return []
	}
}

// Decrypt Sanctum Token
const decryptedToken = () => {
	const secretKey = "MarcusMilesAuthorizationToken"

	// Decrypt
	var bytes = CryptoJS.AES.decrypt(getLocalStorage("sanctumToken"), secretKey)

	return bytes.toString(CryptoJS.enc.Utf8)
}

window.Axios = axios

// window.Axios.defaults.baseURL = import.meta.env.VITE_APP_URL

window.Axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"

window.Axios.defaults.headers.common[
	"Authorization"
] = `Bearer ${decryptedToken()}`

Axios.defaults.withCredentials = true

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from "laravel-echo"

// window.Pusher = require("pusher-js")

// window.Echo = new Echo({
// 	broadcaster: "pusher",
// 	key: import.meta.env.VITE_PUSHER_APP_KEY,
// 	cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
// 	wsHost: window.location.hostname,
// 	wsPort: 6004,
// 	forceTLS: false,
// 	disableStats: true,
// 	authorizer: (channel, options) => {
// 		return {
// 			authorize: (socketId, callback) => {
// 				window.Axios.post("/api/broadcasting/auth", {
// 					socket_id: socketId,
// 					channel_name: channel.name,
// 				})
// 					.then((res) => callback(null, res.data))
// 					.catch((error) => callback(error))
// 			},
// 		}
// 	},
// })