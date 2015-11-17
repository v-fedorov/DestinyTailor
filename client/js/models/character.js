(function(app) {
    'use strict';

    /**
     * Defines the Character model.
     * @param {Object} DEFINITIONS Constant containing Bungie definitions.
     */
    function Model(DEFINITIONS) {
        /**
         * Provides information about a character.
         * @constructor
         * @param {Object} data The data containing the character information.
         * @param {Object} definitions The definitions for the data.
         */
        function Character(data, definitions) {
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
        }

        return Character;
    };

    Model.$inject = ['DEFINITIONS'];
    app.factory('Character', Model);
})(angular.module('main'));
