
let default_locale = "EN"

let site_strings = {
  "EN" : {
    "site-title" : "cryyptor"
  }
}

module.exports.getString = function(string_key, user_locale) {
  var loc = default_locale
  if (typeof(user_locale) == 'string' && user_locale !== "" && site_strings.hasOwnProperty(user_locale)) {
    loc = user_locale
  }
  if (site_strings[loc].hasOwnProperty(string_key)) {
    return site_strings[loc][string_key]
  }
  return `${loc}:${string_key} undefined`
}