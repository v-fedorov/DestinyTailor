var Character = require('../../models/character'),
    ItemFormatter = require('./itemFormatter');

/**
 * Creates a new character Formatter used to build and parse an external API response.
 * @constructor
 * @param {string} definitions The definitions for the character data.
 */
function CharacterFormatter(definitions) {
    var Bungie = require('../bungie');
    
    this.bungie = new Bungie();
    this.itemFormatter = new ItemFormatter();
    
    this.definitions = definitions;
}

/**
 * Gets the character for the given data.
 * @param {object} data The characters data.
 * @param {function} callback The callback function executed when the character is loaded.
 */
CharacterFormatter.prototype.buildCharacter = function(data, callback) {
    var _this = this,
        params = {
            platform: data.characterBase.membershipType,
            accountId: data.characterBase.membershipId,
            characterId: data.characterBase.characterId
        };
            
    // load the inventory
    this.bungie.getInventory(params, function(err, result) {
        if (err) {
            return callback(err);
        };
        
        // loop through the character's inventory
        var character = new Character(params.platform, params.accountId, params.characterId);
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
CharacterFormatter.prototype.setItems = function(character, currentItem, remainingItems, callback) {
    if (!currentItem) {
        // as we don't have an item, assume we're at the end
        callback(null, character);
    } else if (!ItemFormatter.ItemBucketHashType.hasOwnProperty(currentItem.bucketHash.toString())) {
        // if we don't care about the item, move on
        this.setItems(character, remainingItems[0], remainingItems.slice(1), callback);
    } else {
        // set the params for requesting the item
        var _this = this,
            params = {
                platform: character.platform,
                accountId: character.accountId,
                characterId: character.id,
                lightLevel: currentItem.primaryStat ? currentItem.primaryStat.value : undefined,
                itemId: currentItem.itemId
            };
            
        // get the item
        this.bungie.getInventoryItem(params, function(err, result) {
            if (err) {
                return callback(err);
            };
            
            // set the item and continue and continue
            character[ItemFormatter.ItemBucketHashType[currentItem.bucketHash]] = result;
            _this.setItems.call(_this, character, remainingItems[0], remainingItems.slice(1), callback);
        });
    }
};

module.exports = CharacterFormatter;
