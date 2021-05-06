// FormData conversion module
export class FormConverter {
  convertFormDataToJSON(formToConvert) {
    let json = {};
    for (const pair of formToConvert.entries()) {
      json[pair[0]] = pair[1];
    }
    return json;
  }


  convertFormDataToQueryString(formToConvert) {
    let qString = [];
    for (const pair of formToConvert.entries()) {
      let key = encodeURIComponent(pair[0]),
          value = encodeURIComponent(pair[1]);
      qString.push(`${key}=${value}`);
    }
    return qString.join('&');
  }
}
