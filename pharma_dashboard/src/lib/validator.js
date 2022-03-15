
function isPhonenumber(inputtxt) {
    const integer = parseInt(inputtxt, 10);
    const pattern = RegExp(/^(?:(?:\+|0{0,2})91(\s*|[-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/    );
    if(pattern.test(integer)) {
      return true;
    }
    else {
      return false;
    }
}

function isAddress(inputtxt) {
    let address = inputtxt.trim()
    const pattern = RegExp(/^(\w*\s*[\#\-\,\/\.\(\)\&]*)+/);
    if(pattern.test(inputtxt) && address.length > 5) {
      return true;
    }
    else {
      return false;
    }
}

function isAadhar(inputtxt) {
    const pattern = RegExp(/^[01]\d{3}[\s-]?\d{4}[\s-]?\d{4}$/);
    if(pattern.test(inputtxt)) {
      return true;
    }
    else {
      return false;
    }
}

function isPassword(inputtxt) {
    if(inputtxt.length >= 6) {
      return true;
    }
    else {
      return false;
    }
}

function isGstNo(inputtxt) {
    const pattern = RegExp(/[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/);
    if(pattern.test(inputtxt)) {
      return true;
    }
    else {
      return false;
    }
}

function isBankAccNo(inputtxt) {
    if(inputtxt >= 9 || inputtxt <= 18) {
      return true;
    }
    else {
      return false;
    }
}

function isIfsc(inputtxt) {
    const pattern = RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/);
    if(pattern.test(inputtxt)) {
      return true;
    }
    else {
      return false;
    }
}


function isName(inputtxt) {
    const pattern = RegExp(/^[A-Za-z0-9]+(?: +[A-Za-z0-9]+)*$/);
    // if (inputtxt.trim() === ""){
    //   return false
    // }
    if(pattern.test(inputtxt)) {
      return true;
    }
    else {
      return false;
    }
}

function isEmail(inputtxt) {
  const pattern = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if(pattern.test(inputtxt)) {
    return true;
  }
  else {
    return false;
  }
}


function isDescription(inputtxt) {
  const pattern = RegExp(/^(.|\s)*[a-zA-Z]+(.|\s)*$/);
  if(pattern.test(inputtxt)) {
    return true;
  }
  else {
    return false;
  }
}


export {isPhonenumber , isAddress, isAadhar, isPassword, isGstNo, isBankAccNo, isIfsc, isName, isEmail , isDescription}