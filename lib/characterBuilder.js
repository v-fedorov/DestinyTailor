var Character = require('../models/character'),
    ItemParser = require('./itemParser');

/**
 * Creates a new character builder used to build and parse an external API response.
 * @constructor
 * @param {string} definitions The definitions for the character data.
 */
function CharacterBuilder(definitions) {
    var BungieService = require('./bungieService');
    
    this.bungieService = new BungieService();
    this.itemParser = new ItemParser();
    
    this.definitions = definitions;
}

/**
 * Gets the character for the given data.
 * @param {object} character The basic character information to update.
 * @param {object} data The characters data.
 * @param {function} callback The callback function executed when the character is loaded.
 */
CharacterBuilder.prototype.buildCharacter = function(character, data, callback) {
    // load the inventory
    var _this = this;
    this.bungieService.getInventory(character, function(err, result) {
        if (err) {
            return callback(err);
        };
        
        // loop through the character's inventory
        _this.setItems.call(_this, character, result.data.items[0], result.data.items.slice(1), callback);
    });
};

/**
 * Asynchronously sets the items for a character.
 * @param {object} character The character to set the items for.
 * @param {object} currentItem The current item being loaded.
 * @param {array} remainingItems The remaining items to load.
 * @param {function} callback The function called when all items have loaded.
 */
CharacterBuilder.prototype.setItems = function(character, currentItem, remainingItems, callback) {
    if (!currentItem) {
        // as we don't have an item, assume we're at the end
        callback(null, character);
    } else if (!ItemParser.ItemBucketHashType.hasOwnProperty(currentItem.bucketHash.toString())) {
        // if we don't care about the item, move on
        this.setItems(character, remainingItems[0], remainingItems.slice(1), callback);
    } else {
        // otherwise load the item
        var _this = this;
        this.bungieService.getInventoryItem(character, currentItem.itemId, function(err, result) {
            if (err) {
                return callback(err);
            };
            
            // set the item and continue and continue
            character[ItemParser.ItemBucketHashType[currentItem.bucketHash]] = result;
            _this.setItems.call(_this, character, remainingItems[0], remainingItems.slice(1), callback);
        });
    }
};

module.exports = CharacterBuilder;
