/**
 * Enum containing all triggerable events triggered via the `EventBus`
 *
 * Before adding an event, every effort should be made to communicate
 * accross classes with direct imports. Events are available but can
 * be harder to debug and follow. Use with caution.
 *
 * @property EVENT
 * @type {Object}
 * @final
 */
export const EVENT = {
    /**
     * Add an aircraft to the simulation
     *
     * @memberof EVENT
     * @property ADD_AIRCRAFT
     * @type {string}
     */
    ADD_AIRCRAFT: 'add-aircraft',

    /**
     * @memberof EVENT
     * @property AIRPORT_CHANGE
     * @type {string}
     */
    AIRPORT_CHANGE: 'airport-change',

    /**
     * A click was registered outside of a specific `StripViewModel`
     * and the active strip, if any, should have the `active`
     * css classname removed
     *
     * @memberof EVENT
     * @property DESELECT_ACTIVE_STRIP_VIEW
     * @type {string}
     */
    DESELECT_ACTIVE_STRIP_VIEW: 'deselect-active-strip-view',

    /**
     * Event used to notify the `CanvasController` when a re-draw
     * should happen outside of the usual game loop.
     *
     * This should only occur as a result of a user action
     *
     * @memberof EVENT
     * @property MARK_SHALLOW_RENDER
     * @type {string}
     */
    MARK_SHALLOW_RENDER: 'mark-shallow-render',

    /**
     * A pan event has been detected necessitating an entire redraw of each canvas
     *
     * This may constitute a pan-in-progress and not the completion of a panning action
     *
     * @memberof EVENT
     * @property PAN_VIEWPORT
     * @type {string}
     */
    PAN_VIEWPORT: 'pan-viewport',

    /**
     * Fired when the update loop should be either paused or resumed.
     *
     * Usually called when airport data is changing (ie, when a new airport
     * is being loaded).
     *
     * @memberof EVENT
     * @property PAUSE_UPDATE_LOOP
     * @type {string}
     */
    PAUSE_UPDATE_LOOP: 'pause-update-loop',

    /**
     * Increase the length of the PTL lines on the scope
     *
     * @memberof EVENT
     * @property PTL_DECREASE_LENGTH
     * @type {string}
     */
    PTL_DECREASE_LENGTH: 'ptl-decrease-length',

    /**
     * Increase the length of the PTL lines on the scope
     *
     * @memberof EVENT
     * @property PTL_INCREASE_LENGTH
     * @type {string}
     */
    PTL_INCREASE_LENGTH: 'ptl-increase-length',

    /**
     * Remove an aircraft from the sim
     *
     * Usually as a result of the `del` user command
     *
     * @memberof EVENT
     * @property REMOVE_AIRCRAFT
     * @type {string}
     */
    REMOVE_AIRCRAFT: 'remove-aircraft',

    /**
     * Remove an `AircraftConflict` for an aircraft
     *
     * @memberof EVENT
     * @property REMOVE_AIRCRAFT_CONFLICT
     * @type {string}
     */
    REMOVE_AIRCRAFT_CONFLICT: 'remove-aircraft-conflict',

    /**
     * An aircraft has been located and needs to be centered in the view
     *
     * @memberof EVENT
     * @property REQUEST_TO_CENTER_POINT_IN_VIEW
     * @type {string}
     */
    REQUEST_TO_CENTER_POINT_IN_VIEW: 'request-to-center-point-in-view',

    /**
     * An aircraft data block was clicked and the corresponding
     * `StripViewModel` must also be selected
     *
     * @memberof EVENT
     * @property SELECT_STRIP_VIEW_FROM_DATA_BLOCK
     * @type {string}
     */
    SELECT_STRIP_VIEW_FROM_DATA_BLOCK: 'select-strip-view-from-data-block',

    /**
     * An aircraft progress strip was clicked
     *
     * @memberof EVENT
     * @property STRIP_CLICK
     * @type {string}
     */
    STRIP_CLICK: 'strip-click',

    /**
     * An aircraft progress strip was double clicked
     *
     * @memberof EVENT
     * @property STRIP_DOUBLE_CLICK
     * @type {string}
     */
    STRIP_DOUBLE_CLICK: 'strip-double-click',

    /**
     * Change the active theme to the specified theme name
     *
     * @memberof EVENT
     * @property SET_THEME
     * @type {string}
     */
    SET_THEME: 'set-theme',


    SET_JUMP_RARITY: 'set-jump-rarity',
    SET_JUMP_PROB: 'set-jump-prob',
    SET_JUMP_RADIUS: 'set-jump-radius',
    SET_STOP_RARITY: 'set-stop-rarity',
    SET_ERROR_RARITY: 'set-error-rarity',
    SET_ATTACK_RARITY: 'set-attack-rarity',
    SET_STANDSTILL_RARITY: 'set-standstill-rarity',
    SET_ATTACK_AIRCRAFT_VISIBILITY: 'set-attack-aircraft-visibility',
    SET_FLOODING_NON_RESPONSIVE: 'set-flooding-non-responsive',
    SET_TRAJECTORY_RARITY: 'set-trajectory-rarity',
    SET_SPOOF_RARITY: 'set-spoof-rarity',
    SET_GHOST_RARITY: 'set-ghost-rarity',
    SET_CODES_RARITY: 'set-codes-rarity',
    SET_DELAY_RARITY: 'set-delay-rarity',
    SET_DELAY: 'set-delay',
    SET_SPECIFIC_AIRCRAFT: 'set-specific-aircraft',
    SET_SPECIFIC_ATTACK: 'set-specific-attack',
    SET_INTERVAL_TIME: 'set-interval-time',
    SET_TRAJ_SLOPE: 'set-trajectory-slope',
    SET_TRAJ_MAXCHANGE: 'set-trajectory-max-change',

    /**
     * Step through pre-defined timewarp speeds
     *
     * @memberof EVENT
     * @property TIMEWARP_TOGGLE
     * @type {string}
     */
    TIMEWARP_TOGGLE: 'timewarp-toggle',

    /**
     * @memberof EVENT
     * @property TOGGLE_AIRPORT_GUIDE
     * @type {string}
     */
    TOGGLE_AIRPORT_GUIDE: 'toggle-airport-guide',

    /**
     * @memberof EVENT
     * @property TOGGLE_CHANGELOG
     * @type {string}
     */
    TOGGLE_CHANGELOG: 'toggle-changelog',

    /**
     * @memberof EVENT
     * @property TOGGLE_LABELS
     * @type {string}
     */
    TOGGLE_LABELS: 'toggle-labels',

    /**
     * Pause/unpause the game loop
     *
     * @memberof EVENT
     * @property TOGGLE_PAUSE
     * @type {string}
     */
    TOGGLE_PAUSE: 'toggle-pause',

    /**
     * @memberof EVENT
     * @property TOGGLE_RESTRICTED_AREAS
     * @type {string}
     */
    TOGGLE_RESTRICTED_AREAS: 'toggle-restricted-areas',

    /**
     * @memberof EVENT
     * @property TOGGLE_SID_MAP
     * @type {string}
     */
    TOGGLE_SID_MAP: 'toggle-sid-map',

    /**
     * @memberof EVENT
     * @property TOGGLE_STAR_MAP
     * @type {string}
     */
    TOGGLE_STAR_MAP: 'toggle-star-map',

    /**
     * @memberof EVENT
     * @property TOGGLE_TERRAIN
     * @type {string}
     */
    TOGGLE_TERRAIN: 'toggle-terrain',

    /**
     * @memberof EVENT
     * @property TOGGLE_TRAFFIC
     * @type {string}
     */
    TOGGLE_TRAFFIC: 'toggle-traffic',

    /**
     * Open/close the tutorial modal
     *
     * @memberof EVENT
     * @property TOGGLE_TUTORIAL
     * @type {string}
     */
    TOGGLE_TUTORIAL: 'toggle-tutorial',

    /**
     * @memberof EVENT
     * @property TOGGLE_VIDEO_MAP
     * @type {string}
     */
    TOGGLE_VIDEO_MAP: 'toggle-video-map',

    /**
     * @memberof EVENT
     * @property RANGE_RINGS_CHANGE
     * @type {string}
     */
    RANGE_RINGS_CHANGE: 'range-rings-change',

    /**
     * @memberof EVENT
     * @property MEASURE_TOOL_STYLE_CHANGE
     * @type {string}
     */
    MEASURE_TOOL_STYLE_CHANGE: 'measure-tool-style-change',

    /**
     * A click has been registered in the unpause button shown within the
     * screen overlay whil the app is paused
     *
     * @memberof EVENT
     * @property UNPAUSE
     * @type {string}
     */
    UNPAUSE: 'unpause',

    /**
     * The zoom level has changed necessitating an entire redraw of each canvas
     *
     * @memberof EVENT
     * @property ZOOM_VIEWPORT
     * @type {string}
     */
    ZOOM_VIEWPORT: 'zoom-viewport'
};

export const AIRCRAFT_EVENT = {
    /**
     * Triggered when the aircraft received takeoff clearance.
     *
     * @memberof AIRCRAFT_EVENT
     * @property TAKEOFF
     * @type {string}
     */
    TAKEOFF: 'takeoff',

    /**
     * Trigged when the aircraft enters the approach
     *
     * @memberof AIRCRAFT_EVENT
     * @property APPROACH
     * @type {string}
     */
    APPROACH: 'approach',

    /**
     * Trigged when the aircraft reaches its final approach
     *
     * @memberof AIRCRAFT_EVENT
     * @property FINAL_APPROACH
     * @type {string}
     */
    FINAL_APPROACH: 'final-approach',

    /**
     * FOR FUTURE USE. Should be trigged when the aircraft landed on the runway.
     *
     * @memberof AIRCRAFT_EVENT
     * @property LANDING
     * @type {string}
     */
    LANDING: 'landing',

    /**
     * The aircraft landed and came to a fullstop.
     *
     * @memberof AIRCRAFT_EVENT
     * @property FULLSTOP
     * @type {string}
     */
    FULLSTOP: 'fullstop',

    /**
     * Triggered when the aircraft exits the airspace.
     *
     * @memberof AIRCRAFT_EVENT
     * @property AIRSPACE_EXIT
     * @type {string}
     */
    AIRSPACE_EXIT: 'airspace-exit'
};
