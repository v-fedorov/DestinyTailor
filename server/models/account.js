var Character = require('./character');

/**
 * Constructs a new account.
 * @constructor
 * @param {number} platform The platform the account is on.
 * @param {object} data The account's data.
 */
function Account(platform, data) {
    // set the identifiers
    this.platform = platform;
    this.membershipId = data.membershipId;

    // set the account aesthetics
    this.displayName = data.displayName;
    this.iconPath = data.iconPath;
}

/**
 * Sets the characters based on the array of data from an API request.
 * @param {object[]} dataArray The data for the characters.
 */
Account.prototype.setCharacters = function(dataArray) {
    // bind the characters
    this.characters = dataArray.map(function(data) {
        return new Character(data);
    });
};

module.exports = Account;