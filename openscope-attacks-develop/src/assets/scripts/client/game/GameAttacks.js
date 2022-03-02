import _isNil from 'lodash/isNil';
import EventBus from '../lib/EventBus';
import EventTracker from '../EventTracker';
import { GAME_ATTACK_VALUES } from '../constants/gameAttackConstants';
import { TRACKABLE_EVENT } from '../constants/trackableEvents';

/**
 * Set, store and retrieve game attacks.
 *
 * @class GameAttacks
 */
export default class GameAttacks {
    /**
     * @for GameAttacks
     * @constructor
     */
    constructor() {
        /**
         * @property _eventBus
         * @type EventBus
         * @private
         */
        this._eventBus = EventBus;

        /**
         * @property _attacks
         * @type {Object}
         * @default {}
         * @private
         */
        this._attacks = {};

        /**
         * Model properties will be added for each game attack
         * dynamically via `.addGameAttacks()`
         *
         * @property {*}
         * @type {string}
         *
         * this[ATTACK_NAME] = ATTACK_VALUE;
         */

        this.addGameAttacks();
    }

    /**
     * Add available game attacks to `_attacks` dictionary
     *
     * @for GameAttacks
     * @method addGameAttacks
     */
    addGameAttacks() {
        for (let i = 0; i < GAME_ATTACK_VALUES.length; i++) {
            const attack = GAME_ATTACK_VALUES[i];

            this.addAttack(attack);
        }
    }

    /**
     * @for GameAttacks
     * @method addAttack
     * @param attackProps {object}
     */
    addAttack(attackProps) {
        const attackStorageKey = this.buildStorageName(attackProps.name);
        const storedAttackValue = global.localStorage.getItem(attackStorageKey);
        this._attacks[attackProps.name] = attackProps;
        let attackValue = attackProps.defaultValue;


        this[attackProps.name] = attackValue;
    }

    /**
     * @for GameAttacks
     * @method getDescriptions
     * @return {object}
     */
    getDescriptions() {
        return this._attacks;
    }

    /**
     * Gets the value of a given game attack
     *
     * @for GameAttacks
     * @method getAttackByName
     * @param name {string}
     * @return {object}
     */
    getAttackByName(name) {
        return this[name];
    }

    /**
     * Sets a game attack to a given value
     *
     * will fire an event with the `EventBus` is one is registered
     *
     * @for GameAttacks
     * @method setAttackByName
     * @param name {string} name of the attack to change
     * @param value {string} value to set the attack to
     */
    setAttackByName(name, value) {
        this[name] = value;
        const attackStorageKey = this.buildStorageName(name);

        global.localStorage.setItem(attackStorageKey, value);
        EventTracker.recordEvent(TRACKABLE_EVENT.SETTINGS, name, value);

        if (this._attacks[name].onChangeEventHandler) {
            this._eventBus.trigger(this._attacks[name].onChangeEventHandler, value);
        }

        return value;
    }

    /**
     * Build a string that can be used as a key for localStorage data
     *
     * @for GameAttacks
     * @method buildStorageName
     * @param attackName {string}
     * @return {string}
     */
    buildStorageName(attackName) {
        return `zlsa.atc.attack.${attackName}`;
    }
}
