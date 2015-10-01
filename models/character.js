/**
 * Creates a new character.
 * @constructor
 */
var Character = function(platform, accountId, id) {
    this.id = id;
    this.accountId = accountId;
    this.platform = platform;
    
    this.arms = null;
    this.chest = null;
    this.helmet = null;
    this.legs = null;
    this.classItem = null;
    this.artifact = null;
    this.ghost = null;
};

module.exports = Character;