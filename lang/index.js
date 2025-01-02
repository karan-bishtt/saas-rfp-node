const en = require("./en");

const languages = { en };

function getMessage(key, lang = "en") {
  const keys = key.split(".");
  let message = languages[lang];

  for (const k of keys) {
    if (!message[k]) return key; // Fallback to key if message is not found
    message = message[k];
  }

  return message;
}

module.exports = { getMessage };
