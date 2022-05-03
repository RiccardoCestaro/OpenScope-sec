import $ from 'jquery';
import _forEach from 'lodash/forEach';
import _has from 'lodash/has';
import EventBus from '../lib/EventBus';
import EventTracker from '../EventTracker';
import GameOptions from './GameOptions';
import GameAttacks from './GameAttacks';
import TimeKeeper from '../engine/TimeKeeper';
import { round } from '../math/core';
import { EVENT } from '../constants/eventNames';
import { GAME_OPTION_NAMES } from '../constants/gameOptionConstants';
import { TIME } from '../constants/globalConstants';
import { TRACKABLE_EVENT } from '../constants/trackableEvents';
import { SELECTORS } from '../constants/selectors';
import { THEME } from '../constants/themes';

// TODO: Remember to move me to wherever the constants end up being moved to
/**
 * Definitions of point values for given game events
 * @type {Object}
 */
const GAME_EVENTS_POINT_VALUES = {
    AIRSPACE_BUST: -200,
    ARRIVAL: 10,
    COLLISION: -1000,
    DEPARTURE: 10,
    EXTREME_CROSSWIND_OPERATION: -15,
    EXTREME_TAILWIND_OPERATION: -75,
    GO_AROUND: -50,
    HIGH_CROSSWIND_OPERATION: -5,
    HIGH_TAILWIND_OPERATION: -25,
    ILLEGAL_APPROACH_CLEARANCE: -10,
    LOCALIZER_INTERCEPT_ABOVE_GLIDESLOPE: -10,
    NOT_CLEARED_ON_ROUTE: -25,
    SEPARATION_LOSS: -200,
    NO_TAKEOFF_SEPARATION: -200
};

/**
 * List of game events
 * @type {Object}
 */
export const GAME_EVENTS = {
    AIRSPACE_BUST: 'AIRSPACE_BUST',
    ARRIVAL: 'ARRIVAL',
    COLLISION: 'COLLISION',
    DEPARTURE: 'DEPARTURE',
    EXTREME_CROSSWIND_OPERATION: 'EXTREME_CROSSWIND_OPERATION',
    EXTREME_TAILWIND_OPERATION: 'EXTREME_TAILWIND_OPERATION',
    GO_AROUND: 'GO_AROUND',
    HIGH_CROSSWIND_OPERATION: 'HIGH_CROSSWIND_OPERATION',
    HIGH_TAILWIND_OPERATION: 'HIGH_TAILWIND_OPERATION',
    ILLEGAL_APPROACH_CLEARANCE: 'ILLEGAL_APPROACH_CLEARANCE',
    /**
    * Aircraft is cleared for the approach, has just become fully established on the localizer,
    * but they are above the glideslope, and will have to chase it down
    *
    * This event is used to assess a penalty to the controller because they are required to have
    * aircraft at/below glideslope altitude when intercepting the localizer
    *
    * @memberof GAME_EVENTS
    * @property LOCALIZER_INTERCEPT_ABOVE_GLIDESLOPE
    * @type {string}
    */
    LOCALIZER_INTERCEPT_ABOVE_GLIDESLOPE: 'LOCALIZER_INTERCEPT_ABOVE_GLIDESLOPE',
    NOT_CLEARED_ON_ROUTE: 'NOT_CLEARED_ON_ROUTE',
    SEPARATION_LOSS: 'SEPARATION_LOSS',
    NO_TAKEOFF_SEPARATION: 'NO_TAKEOFF_SEPARATION'
};

/**
 * @class GameController
 */
class GameController {
    /**
     * @constructor
     */
    constructor() {
        // TODO: the below $elements _should_ be used instead of the inline vars currently in use but
        // take caution when implmenting these because it will break tests currently in place. This is
        // because of the use of $ within lifecycle methods and becuase this is a static class used
        // by many of the files under test.
        // this._$htmlElement = $('html');
        // this._$pauseToggleElement = null;
        // this._$fastForwardElement = null;
        // this._$scoreElement = null;
        this.game = {};
        this.game.focused = true;
        this.game.frequency = 1;
        this.game.events = {};
        this.game.timeouts = [];
        this.game.last_score = 0;
        this.game.score = 0;
        this.game.option = new GameOptions();
        this.game.attack = new GameAttacks();
        this.theme = THEME.DEFAULT;

        this.jRadius = 1;
        this.jProb = 2000;
        this.aRarity = 9999999;
        this.jRarity = 0; // Jump
        this.sRarity = 0; // Stand Still
        this.eRarity = 0; // Error
        this.RRarity = 0; // Response
        this.tRarity = 0; // Trajectory modification
        this.cRarity = 0; // Codes modification (false alarm)
        this.spRarity = 0; // id spoofing
        this.numberOfGhosts = 0; // ghost injection
        this.dRarity = 0; // message delay
        this.messageDelay = 0;
        this.showAttackAircraftVisibility = false;
        
        /**
        * for trajectory modification attack
        */
        this.vtmSlope = 2;
        this.vtmMaxChange = 0.0174533;
        this.numberOfSteps = 15;

        this.needUpdateOfRates = 1;

        this.numberOfFlooding = 0;

        this.rarities = {
            response: {
                rate: 0,
                attack: 1
            },
            jump: {
                rate: 0,
                attack: 2
            },
            falseInformation: {
                rate: 0,
                attack: 3
            },
            standStill: {
                rate: 0,
                attack: 4
            },
            trajectoryModification: {
                rate: 0,
                attack: 5
            },
            transponderCodeAlteration: {
                rate: 0,
                attack: 6
            },
            idSpoofing: {
                rate: 0,
                attack: 7
            },
            messageDelay: {
                rate: 0,
                attack: 9
            }
        };

        this.responsers = 0;
        this.jumpers = 0;
        this.stoppers = 0;
        this.errorers = 0;
        this.aircraft = 0;
        this.modifiedTrajectory = 0;
        this.alarmers = 0; // transponder code alteration
        this.spoofers = 0;
        this.ghosts = 0;
        this.delayers = 0;

        /**
        * for targeting a single aircraft ad attack it
        */
        this.targetAircraft = 'None';
        this.attackForTarget = 0;
        this.needUpdateOfTarget = 0;
        this.needUpdateOfAttack = 0;
        this.needUpdateOfTime = 1;

        this.attackTime = 0;

        this.log = 'Commands used while playing\nTimestamp (s):Aircraft:Command:Attacktype:\n';

        this.optionUpdate = 'Changes made through the game\nTimestamp (s): Changes made:\n';

        this._eventBus = EventBus;
    }

    /**
     * @for GameController
     * @method init_pre
     */
    init_pre() {
        return this.setupHandlers()
            .createChildren()
            .enable();
    }

    /**
    * Initialize blur functions used during game pausing
    *
    * @for GameController
    * @method setupHandlers
    * @chainable
    */
    setupHandlers() {
        this._onWindowBlurHandler = this._onWindowBlur.bind(this);
        this._onWindowFocusHandler = this._onWindowFocus.bind(this);

        return this;
    }

    /**
     * @for GameController
     * @method createChildren
     * @chainable
     */
    createChildren() {
        // see comment in constructor. tl;dr these props should be used but are not because they break tests
        // this._$pauseToggleElement = $(SELECTORS.DOM_SELECTORS.TOGGLE_PAUSE);
        // this._$fastForwardElement = $(SELECTORS.DOM_SELECTORS.FAST_FORWARDS);
        // this._$scoreElement = $(SELECTORS.DOM_SELECTORS.SCORE);

        return this;
    }

    /**
     * @for GameController
     * @method enable
     * @chainable
     */
    enable() {
        this._eventBus.on(EVENT.SET_THEME, this._setTheme);
        this._eventBus.on(EVENT.SET_JUMP_RARITY, this._setjRarity);
        this._eventBus.on(EVENT.SET_JUMP_RADIUS, this._setjRadius);
        this._eventBus.on(EVENT.SET_STOP_RARITY, this._setRRarity);
        this._eventBus.on(EVENT.SET_ERROR_RARITY, this._setERarity);
        this._eventBus.on(EVENT.SET_ATTACK_RARITY, this._setARarity);
        this._eventBus.on(EVENT.SET_TRAJECTORY_RARITY, this._setTRarity);
        this._eventBus.on(EVENT.SET_CODES_RARITY, this._setCRarity);
        this._eventBus.on(EVENT.SET_SPOOF_RARITY, this._setSPRarity);
        this._eventBus.on(EVENT.SET_GHOST_RARITY, this._setGRarity);
        this._eventBus.on(EVENT.SET_DELAY_RARITY, this._setDRarity);
        this._eventBus.on(EVENT.SET_DELAY, this._setDelay);
        this._eventBus.on(EVENT.SET_JUMP_PROB, this._setJProb);
        this._eventBus.on(EVENT.SET_STANDSTILL_RARITY, this._setSRarity);
        this._eventBus.on(EVENT.SET_ATTACK_AIRCRAFT_VISIBILITY, this._setAttackVisibility);
        this._eventBus.on(EVENT.SET_FLOODING_NON_RESPONSIVE, this._setFlooding);
        this._eventBus.on(EVENT.SET_SPECIFIC_AIRCRAFT, this._setSpecificAircraft);
        this._eventBus.on(EVENT.SET_SPECIFIC_ATTACK, this._setSpecificAttack);
        this._eventBus.on(EVENT.SET_INTERVAL_TIME, this._setTimeOfAttack);
        this._eventBus.on(EVENT.SET_TRAJ_SLOPE, this._setTrajSlope);
        this._eventBus.on(EVENT.SET_TRAJ_MAXCHANGE, this._setTrajMaxChange);

        window.addEventListener('blur', this._onWindowBlurHandler);
        window.addEventListener('focus', this._onWindowFocusHandler);
        // for when the browser window receives or looses focus
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                return this._onWindowBlurHandler();
            }

            return this._onWindowFocusHandler();
        });

        return this.initializeEventCount();
    }

    /**
     * @for GameController
     * @method disable
     * @chainable
     */
    disable() {
        this._eventBus.off(EVENT.SET_THEME, this._setTheme);
        this._eventBus.off(EVENT.SET_JUMP_RARITY, this._setjRarity);
        this._eventBus.off(EVENT.SET_JUMP_RADIUS, this._setjRadius);
        this._eventBus.off(EVENT.SET_STOP_RARITY, this._setRRarity);
        this._eventBus.off(EVENT.SET_ERROR_RARITY, this._setERarity);
        this._eventBus.off(EVENT.SET_SPOOF_RARITY, this._setSPRarity);
        this._eventBus.off(EVENT.SET_GHOST_RARITY, this._setGRarity);
        this._eventBus.off(EVENT.SET_DELAY_RARITY, this._setDRarity);
        this._eventBus.off(EVENT.SET_DELAY, this._setDelay);
        this._eventBus.off(EVENT.SET_ATTACK_RARITY, this._setARarity);
        this._eventBus.off(EVENT.SET_TRAJECTORY_RARITY, this._setTRarity);
        this._eventBus.off(EVENT.SET_CODES_RARITY, this._setCRarity);
        this._eventBus.off(EVENT.SET_JUMP_PROB, this._setJProb);
        this._eventBus.off(EVENT.SET_STANDSTILL_RARITY, this._setSRarity);
        this._eventBus.off(EVENT.SET_ATTACK_AIRCRAFT_VISIBILITY, this._setAttackVisibility);
        this._eventBus.off(EVENT.SET_FLOODING_NON_RESPONSIVE, this._setFlooding);
        this._eventBus.off(EVENT.SET_SPECIFIC_AIRCRAFT, this._setSpecificAircraft);
        this._eventBus.off(EVENT.SET_SPECIFIC_ATTACK, this._setSpecificAttack);
        this._eventBus.off(EVENT.SET_INTERVAL_TIME, this._setTimeOfAttack);
        this._eventBus.off(EVENT.SET_TRAJ_SLOPE, this._setTrajSlope);
        this._eventBus.off(EVENT.SET_TRAJ_MAXCHANGE, this._setTrajMaxChange);
        
        return this.destroy();
    }

    /**
     * Destroy instance properties
     *
     * @for GameController
     * @method destroy
     * @chainable
     */
    destroy() {
        // this._$htmlElement = $('html');
        // this._$pauseToggleElement = null;
        // this._$fastForwardElement = null;
        // this._$scoreElement = null;
        this.game = {};
        this.game.focused = true;
        // TODO: remove
        this.game.frequency = 1;
        this.game.events = {};
        this.game.timeouts = [];
        this.game.last_score = 0;
        this.game.score = 0;
        this.game.option = new GameOptions();
        this.game.attack = new GameAttacks();
        this.theme = THEME.DEFAULT;

        return this;
    }

    /**
     * Initialize `GameController.events` to contain appropriate properties with values of 0
     *
     * @for GameController
     * @method initializeEventCount
     */
    initializeEventCount() {
        _forEach(GAME_EVENTS, (gameEvent, key) => {
            this.game.events[key] = 0;
        });
    }

    // TODO: usages of this method should move to use EventBus
    /**
     * Record a game event to this.game.events, and update this.game.score
     *
     * @for GameController
     * @method events_recordNew
     * @param gameEvent {String} one of the events listed in GAME_EVENTS
     */
    events_recordNew(gameEvent) {
        if (!_has(GAME_EVENTS, gameEvent)) {
            throw new TypeError(`Expected a game event listed in GAME_EVENTS, but instead received ${gameEvent}`);
        }

        this.game.events[gameEvent] += 1;
        this.game.score += GAME_EVENTS_POINT_VALUES[gameEvent];

        this.game_updateScore();
    }


    /**
     * @for GameController
     * @method game_get_weighted_score
     */
    game_get_weighted_score() {
        const hoursPlayed = TimeKeeper.accumulatedDeltaTime / TIME.ONE_HOUR_IN_SECONDS;
        const scorePerHour = this.game.score / hoursPlayed;

        return scorePerHour;
    }

    /**
     * @for GameController
     * @method game_reset_score_and_events
     */
    game_reset_score_and_events() {
        // Reset events
        _forEach(this.game.events, (gameEvent, key) => {
            this.game.events[key] = 0;
        });

        // Reset score
        this.game.score = 0;

        this.game_updateScore();
    }

    /**
     *
     * @for GameController
     * @method updateTimescale
     * @param nextValue {number}
     */
    updateTimescale(nextValue) {
        if (nextValue === 0) {
            this.game_timewarp_toggle();

            return;
        }

        TimeKeeper.updateSimulationRate(nextValue);
    }

    /**
     * Update the visual state of the timewarp control button and call
     * `TimeKeeper.updateTimescalse` with the next timewarp value.
     *
     * This method is called as a result of a user interaction
     *
     * @for GameController
     * @method game_timewarp_toggle
     */
    game_timewarp_toggle() {
        const $fastForwards = $(SELECTORS.DOM_SELECTORS.FAST_FORWARDS);

        if (TimeKeeper.simulationRate >= 5) {
            TimeKeeper.updateSimulationRate(1);
            EventTracker.recordEvent(TRACKABLE_EVENT.OPTIONS, 'timewarp', '1');

            $fastForwards.removeClass(SELECTORS.CLASSNAMES.SPEED_5);
            $fastForwards.prop('title', 'Set time warp to 2');
        } else if (TimeKeeper.simulationRate === 1) {
            TimeKeeper.updateSimulationRate(2);
            EventTracker.recordEvent(TRACKABLE_EVENT.OPTIONS, 'timewarp', '2');

            $fastForwards.addClass(SELECTORS.CLASSNAMES.SPEED_2);
            $fastForwards.prop('title', 'Set time warp to 5');
        } else {
            TimeKeeper.updateSimulationRate(5);
            EventTracker.recordEvent(TRACKABLE_EVENT.OPTIONS, 'timewarp', '5');

            $fastForwards.removeClass(SELECTORS.CLASSNAMES.SPEED_2);
            $fastForwards.addClass(SELECTORS.CLASSNAMES.SPEED_5);
            $fastForwards.prop('title', 'Reset time warp');
        }
    }

    /**
     * @for GameController
     * @method game_pause
     */
    game_pause() {
        TimeKeeper.setPause(true);

        const $pauseToggleElement = $(SELECTORS.DOM_SELECTORS.TOGGLE_PAUSE);

        $pauseToggleElement.addClass(SELECTORS.CLASSNAMES.ACTIVE);
        $pauseToggleElement.attr('title', 'Resume simulation');
        $('html').addClass(SELECTORS.CLASSNAMES.PAUSED);
    }

    /**
     * @for GameController
     * @method game_unpause
     */
    game_unpause() {
        TimeKeeper.setPause(false);

        const $pauseToggleElement = $(SELECTORS.DOM_SELECTORS.TOGGLE_PAUSE);

        $pauseToggleElement.removeClass(SELECTORS.CLASSNAMES.ACTIVE);
        $pauseToggleElement.attr('title', 'Pause simulation');
        $('html').removeClass(SELECTORS.CLASSNAMES.PAUSED);
    }

    /**
     * @for GameController
     * @method game_pause_toggle
     */
    game_pause_toggle() {
        if (TimeKeeper.isPaused) {
            EventTracker.recordEvent(TRACKABLE_EVENT.OPTIONS, 'pause', 'false');
            this.game_unpause();

            return;
        }

        EventTracker.recordEvent(TRACKABLE_EVENT.OPTIONS, 'pause', 'true');
        this.game_pause();
    }

    /**
     * @for GameController
     * @method game_paused
     * @return {boolean}
     */
    game_paused() {
        return !this.game.focused || TimeKeeper.isPaused;
    }

    /**
     * @for GameController
     * @method game_speedup
     * @return {number}
     */
    game_speedup() {
        return !this.game_paused() ? TimeKeeper.simulationRate : 0;
    }

    /**
     * @for GameController
     * @method game_timeout
     * @param func {function} called when timeout is triggered
     * @param delay {number} in seconds
     * @param that
     * @param data
     * @return {array} gameTimeout
     */
    game_timeout(functionToCall, delay, that, data) {
        const timerDelay = TimeKeeper.accumulatedDeltaTime + delay;
        const gameTimeout = [functionToCall, timerDelay, data, delay, false, that];

        this.game.timeouts.push(gameTimeout);

        return gameTimeout;
    }

    /**
     * @for GameController
     * @method game_interval
     * @param func {function} called when timeout is triggered
     * @param delay {number} in seconds
     * @param that
     * @param data
     * @return {array} to
     */
    game_interval(func, delay, that, data) {
        const to = [func, TimeKeeper.accumulatedDeltaTime + delay, data, delay, true, that];

        this.game.timeouts.push(to);

        return to;
    }

    /**
     * Destroys a specific timer.
     *
     * @for GameController
     * @method destroyTimer
     * @param timer {array} the timer to destroy
     */
    destroyTimer(timer) {
        this.game.timeouts.splice(this.game.timeouts.indexOf(timer), 1);
    }

    /**
     * Destroy all current timers
     *
     * Used when changing airports. any timer is only valid
     * for a specific airport.
     *
     * @for GameController
     * @method destroyTimers
     */
    destroyTimers() {
        this.game.timeouts = [];
    }

    /**
     * @for GameController
     * @method game_updateScore
     * @param score {number}
     */
    game_updateScore() {
        if (this.game.score === this.game.last_score) {
            return;
        }

        const $scoreElement = $(SELECTORS.DOM_SELECTORS.SCORE);

        $scoreElement.text(round(this.game.score));

        // TODO: wait, what? Why not just < 0?
        if (this.game.score < -0.51) {
            $scoreElement.addClass(SELECTORS.CLASSNAMES.NEGATIVE);
        } else {
            $scoreElement.removeClass(SELECTORS.CLASSNAMES.NEGATIVE);
        }

        this.game.last_score = this.game.score;
    }

    /**
     * @for GameController
     * @method update_pre
     */
    update_pre() {
        const $htmlElement = $('html');

        if (!this.game_paused() && $htmlElement.hasClass(SELECTORS.CLASSNAMES.PAUSED)) {
            $htmlElement.removeClass(SELECTORS.CLASSNAMES.PAUSED);
        }

        this.updateTimers();
    }

    /**
     * @for GameController
     * @method updateTimers
     */
    updateTimers() {
        const currentGameTime = TimeKeeper.accumulatedDeltaTime;

        for (let i = this.game.timeouts.length - 1; i >= 0; i--) {
            let willRemoveTimerFromList = false;
            const timeout = this.game.timeouts[i];
            const callback = timeout[0];
            const delayFireTime = timeout[1];
            const callbackArguments = timeout[2];
            const delayInterval = timeout[3];
            const shouldRepeat = timeout[4];

            if (currentGameTime > delayFireTime) {
                callback.call(timeout[5], callbackArguments);
                willRemoveTimerFromList = true;

                if (shouldRepeat) {
                    timeout[1] = delayFireTime + delayInterval;
                    willRemoveTimerFromList = false;
                }
            }

            if (willRemoveTimerFromList) {
                this.game.timeouts.splice(i, 1);
                i -= 1;
            }
        }
    }

    /**
     * @for GameController
     * @method complete
     */
    complete() {
        TimeKeeper.setPause(false);
    }

    /**
     * Facade for `game.option.get`
     *
     * Allows for classes that import the `GameController` single-level
     * access to any game option value
     *
     * @for GameController
     * @method getGameOption
     * @param optionName {string}
     * @return {string}
     */
    getGameOption(optionName) {
        return this.game.option.getOptionByName(optionName);
    }

    getGameAttack(attackName) {
        return this.game.attack.getAttackByName(attackName);
    }

    /**
     * Check whether or not the trailing distance separator should be drawn.
     *
     * Used by the `CanvasController` to determine whether or not to proceed with
     * `canvas_draw_separation_indicator`.
     *
     * @for GameController
     * @method shouldUseTrailingSeparationIndicator
     * @param aircraft {AircraftModel}
     * @return {boolean}
     */
    shouldUseTrailingSeparationIndicator(aircraft) {
        const userSettingsValue = this.getGameOption(GAME_OPTION_NAMES.DRAW_ILS_DISTANCE_SEPARATOR);
        let isIndicatorEnabled = userSettingsValue === 'yes';

        if (userSettingsValue === 'from-theme') {
            isIndicatorEnabled = this.theme.RADAR_TARGET.TRAILING_SEPARATION_INDICATOR_ENABLED;
        }

        return isIndicatorEnabled && aircraft.isArrival();
    }

    /**
     * @for GameController
     * @method _onWindowBlur
     * @param event {UIEvent}
     * @private
     */
    _onWindowBlur(event) {
        this.game.focused = false;

        // resetting back to 1 here so when focus returns, we can reliably reset
        // `#game.delta` to 0 to prevent jumpiness
        TimeKeeper.updateSimulationRate(1);
        TimeKeeper.setPause(true);

        // update visual state of the timewarp control button for consistency
        const $fastForwards = $(SELECTORS.DOM_SELECTORS.FAST_FORWARDS);

        $fastForwards.removeClass(SELECTORS.CLASSNAMES.SPEED_2);
        $fastForwards.removeClass(SELECTORS.CLASSNAMES.SPEED_5);
        $fastForwards.prop('title', 'Set time warp to 2');
    }

    /**
     * @for GameController
     * @method _onWindowFocus
     * @param event {UIEvent}
     * @private
     */
    _onWindowFocus(event) {
        this.game.focused = true;

        // if was already manually paused when lost focus, respect that
        if ($('html').hasClass(SELECTORS.CLASSNAMES.PAUSED)) {
            return;
        }

        TimeKeeper.setPause(false);
    }

    _setRRarity = (themeName) => {
        this.RRarity = parseInt(themeName);
        this.rarities.response.rate = parseInt(themeName);
        this.needUpdateOfRates *= -1;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed non-responsive weight to "+themeName+"\n";
    };

    _setjRarity = (themeName) => {
        this.jRarity = parseInt(themeName);
        this.rarities.jump.rate = parseInt(themeName);
        this.needUpdateOfRates *= -1;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed jumping weight to "+themeName+"\n";
    };

    _setERarity = (themeName) => {
        this.eRarity = parseInt(themeName);
        this.rarities.falseInformation.rate = parseInt(themeName);
        this.needUpdateOfRates *= -1;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed false information weight to "+themeName+"\n";
    };

    _setSRarity = (themeName) => {
        this.sRarity = parseInt(themeName);
        this.rarities.standStill.rate = parseInt(themeName);
        this.needUpdateOfRates *= -1;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed non-moving weight to "+themeName+"\n";
    };

    _setTRarity = (themeName) => {
        this.tRarity = parseInt(themeName);
        this.rarities.trajectoryModification.rate = parseInt(themeName);
        this.needUpdateOfRates *= -1;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed trajectory modification weight to "+themeName+"\n";
    };

    _setCRarity = (themeName) => {
        this.tRarity = parseInt(themeName);
        this.rarities.transponderCodeAlteration.rate = parseInt(themeName);
        this.needUpdateOfRates *= -1;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed transponder codes alteration weight to "+themeName+"\n";
    };

    _setSPRarity = (themeName) => {
        this.spRarity = parseInt(themeName);
        this.rarities.idSpoofing.rate = parseInt(themeName);
        this.needUpdateOfRates *= -1;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed aircraft spoofing weight to "+themeName+"\n";
    };

    _setGRarity = (numberOfAircraft) => {
        this.numberOfGhosts = parseInt(numberOfAircraft);
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Created "+this.numberOfGhosts+" new ghost aircraft\n";
    };

    _setDRarity = (themeName) => {
            this.dRarity = parseInt(themeName);
            this.rarities.messageDelay.rate = parseInt(themeName);
            this.needUpdateOfRates *= -1;
            this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed message delay weight to "+themeName+"\n";
        };
    
    _setDelay = (themeName) => {
            this.messageDelay = parseInt(themeName);
            this.needUpdateOfRates *= -1;
            this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed message delay to "+themeName+"\n";
        };

    _setSpecificAircraft = (themeName) => {
        this.targetAircraft = themeName;
        this.needUpdateOfTarget = 1 - this.needUpdateOfTarget;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Attacking specific aircraft "+themeName+"\n";
    };

    _setSpecificAttack = (themeName) => {
        this.attackForTarget = parseInt(themeName);
        this.needUpdateOfAttack = 1 - this.needUpdateOfAttack;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Attacking specific aircraft with attack type "+themeName+"\n";
    };

    _setTimeOfAttack = (time) => {
        this.attackTime = parseInt(time);
        this.needUpdateOfTime *= -1;
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Attacking with limited amount of time: "+time+" seconds\n";
    };

    _setJProb = (probValue) => {
        this.jProb = parseInt(probValue);
        var temp = "";
        if (probValue == "5000"){
          temp = "Very Low";
        } else if (probValue == "1250"){
          temp = "Low";
        } else if (probValue == "250"){
          temp = "Medium";
        } else if (probValue == "50"){
          temp = "High";
        } else if (probValue == "10"){
          temp = "Very High";
        }
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed jumping probabilty to "+temp+"\n";
    };

    _setjRadius = (themeName) => {
        if (themeName == 'Small') {
            this.jRadius = 0.5;
        } else if (themeName == 'Moderate') {
            this.jRadius = 1;
        } else if (themeName == 'Large') {
            this.jRadius = 2;
        }
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed jumping radius to "+themeName+" radius\n";
    };
    
    _setTrajSlope = (themeName) => {
        this.vtmSlope = parseInt(themeName.split(" ")[0]);
        this.numberOfSteps = parseInt(themeName.split(" ")[1]);
    }

    _setTrajMaxChange = (themeName) => {
        this.vtmMaxChange = parseFloat(themeName);
    }

    _setARarity = (themeName) => {
        var per = "";
        if (themeName == 'None') {
            this.aRarity = 9999999; // 0 % of aircraft
            per = "0%";
        } else if (themeName == 'Low') {
            this.aRarity = 2000; // 5% of aircraft
            per = "5%";
        } else if (themeName == 'Normal') {
            this.aRarity = 500; // 20 % of aircraft
            per = "20%";
        } else if (themeName == 'High') {
            this.aRarity = 200; // 50 % of aircraft
            per = "50%";
        } else if (themeName == 'VeryHigh') {
            this.aRarity = 110; // 90 % of aircraft
            per = "90%";
        }
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed percentage of affected aircraft to "+per+"\n";
    };

    _setAttackVisibility = (probValue) => {
        this.showAttackAircraftVisibility = probValue;
        if (probValue){
          this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed attack aircraft visibility to \"Yes\"\n";
        } else {
          this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Changed attack aircraft visibility to \"No\"\n";
        }
    };

    _setFlooding = (numberOfAircraft) => {
        this.numberOfFlooding = parseInt(numberOfAircraft);
        this.optionUpdate += TimeKeeper.accumulatedDeltaTime.toFixed(1) + ': ' + "Created "+this.numberOfFlooding+" new non-responsive aircraft\n";
    };

    /**
     * Change theme to the specified name
     *
     * This should ONLY be called through the EventBus during a `SET_THEME` event,
     * thus ensuring that the same theme is always in use by all app components.
     *
     * This method must remain an arrow function in order to preserve the scope
     * of `this`, since it is being invoked by an EventBus callback.
     *
     * @for GameController
     * @method _setTheme
     * @param themeName {string}
     */
    _setTheme = (themeName) => {
        if (!_has(THEME, themeName)) {
            console.error(`Expected valid theme to change to, but received '${themeName}'`);

            return;
        }

        this.theme = THEME[themeName];
    };
}

export default new GameController();
