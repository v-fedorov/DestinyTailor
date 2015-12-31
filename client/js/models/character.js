(function() {
    'use strict';

    angular.module('main').factory('Character', Model);
    Model.$inject = ['DEFINITIONS', 'PLATFORMS'];

    /**
     * Defines the Character model.
     * @param {Object} DEFINITIONS Constant containing Bungie definitions.
     * @param {Object} PLATFORMS Constant containing the platforms.
     * @returns {Function} The character constructor.
     */
    function Model(DEFINITIONS, PLATFORMS) {
        /**
         * Provides information about a character.
         * @constructor
         * @param {Object} account The account.
         * @param {Object} data The data containing the character information.
         */
        function Character(account, data) {
            // set the basic information
            this.membershipType = account.membershipType;
            this.membershipId = account.membershipId;
            this.characterId = data.characterBase.characterId;

            // set the character aesthetics
            this.race = DEFINITIONS.raceType[data.characterBase.raceHash];
            this.gender = DEFINITIONS.genderType[data.characterBase.genderHash];
            this.class = DEFINITIONS.classType[data.characterBase.classHash];

            // set their light level
            this.level = data.characterLevel;
            this.lightLevel = data.characterBase.powerLevel;

            // set their emblem
            this.emblemPath = data.emblemPath;
            this.backgroundPath = data.backgroundPath;

            // set the url state parameters
            this.membershipTypeName = PLATFORMS[account.membershipType];
            this.displayName = account.displayName;
            this.slugUrl = '';
        }

        return Character;
    }
})();
