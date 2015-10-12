var async = require('async');

/**
 * Constructs a new inventory object used to store items owned by a character.
 * @constructor
 */
function Inventory() {
    // weapons
    this.primaryWeapon = null;
    this.specialWeapon = null;
    this.heavyWeapon = null;

    // main
    this.ghost = null;
    this.helmet = null;
    this.gauntlets = null;
    this.chest = null;
    this.legs = null;

    // sub
    this.artifact = null;
    this.classItem = null;
};

/**
 * Expands the inventory to fully load the items currently set.
 * @param {function} callback The callback triggered when the inventory's items have been fully loaded.
 */
Inventory.prototype.expand = function(callback) {
    // expand all of the items we require stats for
    async.each([this.ghost, this.helmet, this.gauntlets, this.chest, this.legs, this.artifact, this.classItem], function(item, next) {
        if (item) {
            item.expand(next);
        } else {
            next(null, item);
        };
    }, function(err) {
        callback(err, this);
    }.bind(this));
};

/**
 * Sets the item based on it's bucket hash.
 * @param {object} item The item to set.
 * @returns The modified inventory for chaining.
 */
Inventory.prototype.setItem = function(item) {
    // set the item when we recognise the bucket hash)
    if (Inventory.ItemBucketHashType.hasOwnProperty(item.bucketHash)) {
        this[Inventory.ItemBucketHashType[item.bucketHash]] = item;
    };

    return this;
};

/**
 * Enumeration for item categories, cross referenced with Bungie.
 */
var ItemBucketHashType = Inventory.ItemBucketHashType = {
      '434908299':  'artifact',
      '14239492':   'chest',
      '1585787867': 'classItem',
      '3551918588': 'gauntlets',
      '4023194814': 'ghost',
      '953998645':  'heavyWeapon',
      '3448274439': 'helmet',
      '20886954':   'legs',
      '1498876634': 'primaryWeapon',
      '2465295065': 'specialWeapon',
};

module.exports = Inventory;