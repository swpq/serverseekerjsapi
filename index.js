const fetch = require("node-fetch");
const BASE_API_URL = "https://api.serverseeker.net/";

const ENDPOINTS = Object.freeze({
	USER_INFO: BASE_API_URL + "user_info",
	WHEREIS: BASE_API_URL + "whereis",
	SERVERS: BASE_API_URL + "servers",
	SERVER_INFO: BASE_API_URL + "server_info"
});

class ServerSeekerAPI {
	constructor(API_KEY) {
		this.API_KEY = API_KEY;
	}

	WHEREIS_MODE = Object.freeze({
		NAME: 0,
		UUID: 1
	});

	/**
	 * Gives you information about your account (user id, username, avatar url). Also gives you information about your rate limits. Rate limits reset at midnight UTC.
	 * @returns {{user_id: string, username: string, avatar_url: string, requests_per_day_server_info: number, requests_per_day_servers: number, requests_per_day_whereis: number, requests_made_server_info: number, requests_made_servers: number, requests_made_whereis: number}} 
	 */
	async getUserInfo() {
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"api_key": this.API_KEY,
			}),
		};

		try {
			const response = await fetch(ENDPOINTS.USER_INFO, requestOptions);

			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Gives you a list of servers where a player was. Limited to 1000 results.
	 * @param {WHEREIS_MODE} mode - WHEREIS_MODE.NAME/WHEREIS_MODE.UUID
	 * @param {string} searchQuery - Username or UUID goes here.
	 * @returns {Array<{server: string, uuid: string, name: string, last_seen: number}>}
	 */
	async whereIs(mode, searchQuery) {
		let requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		};

		if (mode !== this.WHEREIS_MODE.NAME && mode !== this.WHEREIS_MODE.UUID) {
			throw new Error("whereIs mode provided was invalid.");
		}

		let requestBody = {
			api_key: this.API_KEY
		};
		requestBody[mode === this.WHEREIS_MODE.NAME ? 'name' : 'uuid'] = searchQuery;
		requestOptions.body = JSON.stringify(requestBody);

		try {
			const response = await fetch(ENDPOINTS.WHEREIS, requestOptions);

			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}

			const data = await response.json();
			return data.data;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Allows you to filter servers, does NOT give you list of players.
	 * @param {Object} filters
	 * @param {Array<number|string>} filters.online_players - The amount of online players you want. Type is a range of numbers [min, max] or a single number for exact match. max can be 'inf' to indicate no upper bound.
	 * @param {number} filters.max_players - The max amount of players players the server should be able to hold. Type is a range of numbers [min, max] or a single number for exact match. max can be 'inf' to indicate no upper bound.
	 * @param {boolean} filters.cracked - Whether the server is cracked (true/false).
	 * @param {number} filters.protocol - The server protocol version. (https://wiki.vg/Protocol_version_numbers)
	 * @param {string} filters.software - The software the server is running on. (any, vanilla, paper, spigot, bukkit).
	 * @param {string} filters.description - The description of the server. The server description will include this string.
	 * @param {string} filters.online_after - The server should have been online after this unix timestamp. Defaults to showing all servers which were online at last ping. Set to 0 to show all servers
	 * @param {string} filters.country_code - The country code of the server. (see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
	 * @param {number} filters.asn - The AS number of the server. (use ipinfo.io)
	 * @returns {Array<{cracked: boolean, description: string, last_seen: number, max_players: number, online_players: number, protocol: number, server: string, version: string}>} 
	 */
	async servers(filters) {
		let requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		};

		if ("asn" in filters && "country_code" in filters) {
			throw new Error("Cannot use both asn and country_code in servers function.");
		}

		requestOptions.body = JSON.stringify({
			...filters,
			api_key: this.API_KEY
		});

		try {
			const response = await fetch(ENDPOINTS.SERVERS, requestOptions);

			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}

			const data = await response.json();
			return data.data;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Allows you to see a servers data, and history of players.
	 * @param {string} ip - IP Address
	 * @param {number} port - Port (Defaults to 25565)
	 * @returns {{cracked: boolean, description: string, server: string, last_seen: number, max_players: number, online_players: number, protocol: number, version: string, players: Array<{name: string, uuid: string, last_seen: number}>}} 
	 */
	async serverInfo(ip, port = 25565) {
		let requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		};

		requestOptions.body = JSON.stringify({
			ip,
			"port": parseInt(port),
			api_key: this.API_KEY
		});

		try {
			const response = await fetch(ENDPOINTS.SERVER_INFO, requestOptions);

			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = {
	ServerSeekerAPI
};