var Character = require('./character');

/**
 * Constructs a new account.
 * @constructor
 * @param {object} data The account's data.
 */
function Account(data) {
    // set the identifiers
    this.membershipType = data.membershipType;
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
    this.characters = {};

    // bind the characters
    dataArray.forEach(function(data) {
        var character = new Character(data);
        this.characters[character.characterId] = character;
    }.bind(this));
};

module.exports = Account;