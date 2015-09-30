var Character = require('../models/character'),
    ItemParser = require('./itemParser');

/**
 * Creates a new character parser used to parse an external API response.
 * @constructor
 * @param {string} data The raw character data.
 * @param {string} definitions The definitions for the character data.
 */
function CharacterParser(definitions)
{
    this.definitions = definitions;   
    this.itemParser = new ItemParser(this.definitions);
}

/**
 * Gets the character for the given data.
 * @param {object} data The characters data.
 */
CharacterParser.prototype.getCharacter = function(data) {
    var character = new Character();
    /*data.characterBase.peerView.equipment.forEach(function(item) {
        console.log(item.itemHash);
    });*/
    

    console.log(this.itemParser.getItem(317533173));
    
    return character;
};

module.exports = CharacterParser;
