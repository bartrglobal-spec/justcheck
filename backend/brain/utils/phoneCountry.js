const COUNTRY_CODES = {
  "1": "United States / Canada",
  "7": "Russia / Kazakhstan",
  "20": "Egypt",
  "27": "South Africa",
  "30": "Greece",
  "31": "Netherlands",
  "32": "Belgium",
  "33": "France",
  "34": "Spain",
  "36": "Hungary",
  "39": "Italy",
  "40": "Romania",
  "41": "Switzerland",
  "43": "Austria",
  "44": "United Kingdom",
  "45": "Denmark",
  "46": "Sweden",
  "47": "Norway",
  "48": "Poland",
  "49": "Germany",
  "52": "Mexico",
  "54": "Argentina",
  "55": "Brazil",
  "60": "Malaysia",
  "61": "Australia",
  "62": "Indonesia",
  "63": "Philippines",
  "64": "New Zealand",
  "65": "Singapore",
  "66": "Thailand",
  "81": "Japan",
  "82": "South Korea",
  "84": "Vietnam",
  "86": "China",
  "90": "Turkey",
  "91": "India",
  "92": "Pakistan",
  "93": "Afghanistan",
  "94": "Sri Lanka",
  "95": "Myanmar",
  "98": "Iran",
  "212": "Morocco",
  "213": "Algeria",
  "216": "Tunisia",
  "218": "Libya",
  "220": "Gambia",
  "221": "Senegal",
  "222": "Mauritania",
  "223": "Mali",
  "224": "Guinea",
  "225": "Ivory Coast",
  "226": "Burkina Faso",
  "227": "Niger",
  "228": "Togo",
  "229": "Benin",
  "230": "Mauritius",
  "231": "Liberia",
  "232": "Sierra Leone",
  "233": "Ghana",
  "234": "Nigeria",
  "235": "Chad",
  "236": "Central African Republic",
  "237": "Cameroon",
  "238": "Cape Verde",
  "239": "São Tomé and Príncipe",
  "240": "Equatorial Guinea",
  "241": "Gabon",
  "242": "Congo",
  "243": "DR Congo",
  "244": "Angola",
  "245": "Guinea-Bissau",
  "248": "Seychelles",
  "249": "Sudan",
  "250": "Rwanda",
  "251": "Ethiopia",
  "252": "Somalia",
  "253": "Djibouti",
  "254": "Kenya",
  "255": "Tanzania",
  "256": "Uganda",
  "257": "Burundi",
  "258": "Mozambique",
  "260": "Zambia",
  "261": "Madagascar",
  "263": "Zimbabwe",
  "264": "Namibia",
  "265": "Malawi",
  "266": "Lesotho",
  "267": "Botswana",
  "268": "Eswatini"
};

export function detectPhoneCountry(phone) {

  if (!phone) return null;

  const digits = phone.replace(/\D/g, "");

  for (let i = 1; i <= 3; i++) {

    const prefix = digits.slice(0, i);

    if (COUNTRY_CODES[prefix]) {

      return {
        code: prefix,
        country: COUNTRY_CODES[prefix]
      };

    }

  }

  return null;

}