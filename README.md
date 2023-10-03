# ServerSeekerAPI

## Installing & Requiring the package

`npm i serverseekerapi`
```js
const srv = require("serverseekerapi");
```

## Getting the API Key
[Click Here](https://discord.com/api/oauth2/authorize?client_id=1087083964432404590&redirect_uri=https%3A%2F%2Fapi.serverseeker.net%2Fdiscord_callback&response_type=code&scope=identify) and copy the value of `api_key`
<br>
In your code define a constant variable called `ServerSeekerAPI` and input your `API_KEY`
```js
const ServerSeekerAPI = new srv.ServerSeekerAPI("API_KEY_GOES_HERE");
```

## getUserInfo
Allows you to see your Discord data, alongside your current ratelimit status.
```js
const res = await ServerSeekerAPI.getUserInfo();
console.log(res);
```
```json
{
  "discord_avatar_url": null,
  "discord_id": "xxxxxxxxxxxxxxxxxx",
  "discord_username": "xxxxxxxx",
  "requests_made_server_info": 0,
  "requests_made_servers": 8,
  "requests_made_whereis": 14,
  "requests_per_day_server_info": 200,
  "requests_per_day_servers": 25,
  "requests_per_day_whereis": 200
}
```

## whereIs
Allows you to find a Minecraft user based on their UUID / Username.
```js
ServerSeekerAPI.WHEREIS_MODE.UUID; // Use this when passing a UUID as the 2nd parameter
ServerSeekerAPI.WHEREIS_MODE.NAME; // Use this when passing a Username as the 2nd parameter
```
```js
const res = await ServerSeekerAPI.whereIs(ServerSeekerAPI.WHEREIS_MODE.NAME, "DAMCraft");
console.log(res);
```

```json
[
  ...,
  {
    "last_seen": 1684873448,
    "name": "DAMcraft",
    "server": "193.35.18.165:14682",
    "uuid": "68af4d98-24a2-41b6-96bc-a9c2ef9b397b"
  },
  ...
]
```

## servers
Allows you to filter through servers to find specific ones.</br>
<b>DOES NOT CONTAIN PLAYER LIST INFO</b>

```js
const res = await ServerSeekerAPI.servers({ cracked: true, software: "paper", online_players: 5 });
console.log(res);
```
```json
[
  ...,
  {
    "cracked": true,
    "description": "§rsample description",
    "last_seen": 1695830091,
    "max_players": 100,
    "online_players": 5,
    "protocol": 763,
    "server": "199.127.60.223:25565",
    "version": "Paper 1.20.1"
  },
  ...
]
```

## serverInfo
Allows you to see info <b>AND</b> player history of a server.

```js
const res = await ServerSeekerAPI.serverInfo("199.127.60.223", 25565); // 2nd parameter defaults to 25565
console.log(res);
```
```json
{
  "cracked": true,
  "description": "§rsample description",
  "last_seen": 1695831549,
  "max_players": 100,
  "online_players": 4,
  "players": [
    {
      "last_seen": 1695831549,
      "name": ".david99L",
      "uuid": "00000000-0000-0000-0009-01f17a03d9f4"
    },
    {
      "last_seen": 1695831549,
      "name": ".Julieta_2327607",
      "uuid": "00000000-0000-0000-0009-01febc1c4707"
    }
  ],
  "protocol": 763,
  "server": "199.127.60.223:25565",
  "version": "Paper 1.20.1"
}
```
