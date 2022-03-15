const PhoneValidator = require('phone');
const EmailValidator = require('email-validator')

exports.validatePhone = (phone) => {
    let rs = PhoneValidator(phone,"IND");
    if(rs.length == 0) return false;
    else return rs[0];
}

exports.validateEmail = (val) => {
    let rs = EmailValidator.validate(val);
    return rs;
}