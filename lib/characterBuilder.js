var bungieService = require('./bungieService'),
    Character = require('../models/character'),
    ItemParser = require('./itemParser');

/**
 * Creates a new character builder used to build and parse an external API response.
 * @constructor
 * @param {string} data The raw character data.
 * @param {string} definitions The definitions for the character data.
 */
function characterBuilder(definitions) {
    this.definitions = definitions;   
    this.itemParser = new ItemParser();
}

/**
 * Gets the character for the given data.
 * @param {object} character The basic character information to update.
 * @param {object} data The characters data.
 * @param {function} next The next function executed when the character is loaded.
 */
characterBuilder.prototype.buildCharacter = function(character, data, next) {
    // load the inventory
    bungieService.getInventory(character, function(err, result) {
        if (err) {
            return next(err);
        };
        
        // loop through the character's inventory
        this.setItems(character, result.data.items[0], result.data.items.splice(0, 1), next);
    });
};

/**
 * Asynchronously sets the items for a character.
 * @param {object} character The character to set the items for.
 * @param {object} currentItem The current item being loaded.
 * @param {array} remainingItems The remaining items to load.
 * @param {function} next The function called when all items have loaded.
 */
characterBuilder.prototype.setItems = function(character, currentItem, remainingItems, next) {
    if (!currentItem) {
        // as we don't have an item, assume we're at the end
        next(null, character);
    } else if (!ItemParser.ItemBucketHashType.hasOwnProperty(currentItem.itemHash)) {
        // if we don't care about the item, move on
        this.setItems(character, remainingItems[0], remainingItems.splice(1, 0), next);
    } else {
        // otherwise load the item
        bungieService.getInventoryItem(character, currentItem.itemId, function(err, result) {
            if (err) {
                return next(err);
            };
            
            // set the item and continue and continue
            character[ItemParser.ItemBucketHashType[currentItem.itemHash]] = result;
            this.setItems(character, remainingItems[0], remainingItems.splice(0, 1), next);
        });
    }
};

module.exports = characterBuilder;
