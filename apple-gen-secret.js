// apple-gen-secret.js
const nJwt = require("njwt");
const dotenv = require("dotenv");
const { createPrivateKey } = require("crypto");

dotenv.config({ path: ".env.local" });

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

const privateKey = createPrivateKey(``);
const now = Math.ceil(Date.now() / 1000);
const expires = now + MONTH * 3;

const claims = {
  iss: process.env.APPLE_TEAM_ID,
  iat: now,
  exp: expires,
  aud: "https://appleid.apple.com",
  sub: process.env.APPLE_CLIENT_ID,
};

const jwt = nJwt.create(claims, privateKey, "ES256");
jwt.header.kid = "7LUWTU3G7Y";

console.log(jwt.compact());
