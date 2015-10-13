var definitions = require('../lib/definitions'),
    util = require('util');

/**
 * Creates a new character.
 * @constructor
 * @param {object} data The data containing information about the character.
 */
var Character = function(data) {
    this.characterId = data.characterBase.characterId;

    // set the character aesthetics
    this.race = definitions.RACE_TYPE[data.characterBase.raceHash];
    this.gender = definitions.GENDER_TYPE[data.characterBase.genderHash];
    this.class = definitions.CLASS_TYPE[data.characterBase.classHash];

    // set their light level
    this.level = data.characterLevel;
    this.lightLevel = data.characterBase.powerLevel;

    // set their emblem
    this.emblemPath = data.emblemPath;
    this.backgroundPath = data.backgroundPath;

    this.inventoryPath = util.format('/api/%s/%s/%s/', data.characterBase.membershipType, data.characterBase.membershipId, this.characterId);
};

module.exports = Character;