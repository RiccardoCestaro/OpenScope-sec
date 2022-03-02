import { EVENT } from './eventNames';
import TrafficRateController from '../ui/TrafficRateController';

/* eslint-disable max-len, import/prefer-default-export */
/**
 * Name enumeration of available game attacks
 *
 * @property GAME_ATTACK_NAMES
 * @type {Object}
 * @final
 */
export const GAME_ATTACK_NAMES = {
    0: 'Regular',
    1: 'Non listen',
    2: 'Jumping',
    3: 'False information',
    4: 'Standing still',
    5: 'Virtual trajectory modification',
    6: 'Transponder code alteration',
    7: 'Aircraft spoofing',
    8: 'Ghost injection',
    9: 'Message delay'
};

/**
 * User attacks
 *
 * These attacks are presented in a modal and are stored in localStorage
 *
 * @property GAME_ATTACK_VALUES
 * @type {array<object>}
 * @final
 */
export const GAME_ATTACK_VALUES = [
    {
        name: 'attackRarity',
        id: 'attack-rarity',
        defaultValue: 'None',
        description: 'Percentage of aircraft affected',
        type: 'select',
        onChangeEventHandler: EVENT.SET_ATTACK_RARITY,
        optionList: [
            {
                displayLabel: 'No aircraft affected',
                value: 'None'
            },
            {
                displayLabel: 'A few aircraft affected',
                value: 'Low'
            },
            {
                displayLabel: 'A normal amount of aircraft affected',
                value: 'Normal'
            },
            {
                displayLabel: 'Many aircraft affected',
                value: 'High'
            },
            {
                displayLabel: 'Almost all aircraft affected',
                value: 'VeryHigh'
            }
        ]
    },
    {
        name: 'stopRarity',
        id: 'stop-rarity',
        defaultValue: '0',
        description: 'Aircraft not responding to commands',
        help: 'Simulates spoofed ADS-B data. These aircraft will not respond to any commands.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_STOP_RARITY,
        optionList: [
            {
                displayLabel: '0',
                value: '0'
            },
            {
                displayLabel: '1',
                value: '1'
            },
            {
                displayLabel: '2',
                value: '2'
            },
            {
                displayLabel: '3',
                value: '3'
            },
            {
                displayLabel: '4',
                value: '4'
            },
            {
                displayLabel: '5',
                value: '5'
            }
        ]
    },
    {
        name: 'jumpFrequence',
        id: 'jump-freq',
        defaultValue: '0',
        description: 'Aircraft changing postion',
        help: 'Changes the positional values of ADS-B data of aircraft',
        type: 'select',
        onChangeEventHandler: EVENT.SET_JUMP_RARITY,
        optionList: [
            {
                displayLabel: '0',
                value: '0'
            },
            {
                displayLabel: '1',
                value: '1'
            },
            {
                displayLabel: '2',
                value: '2'
            },
            {
                displayLabel: '3',
                value: '3'
            },
            {
                displayLabel: '4',
                value: '4'
            },
            {
                displayLabel: '5',
                value: '5'
            }
        ]
    },

    {
        name: 'errorRarity',
        id: 'error-rarity',
        defaultValue: '0',
        description: 'Aircraft showing false data',
        help: 'Changes the alitude and velocity values of ADS-B data of aircraft',
        type: 'select',
        onChangeEventHandler: EVENT.SET_ERROR_RARITY,
        optionList: [
            {
                displayLabel: '0',
                value: '0'
            },
            {
                displayLabel: '1',
                value: '1'
            },
            {
                displayLabel: '2',
                value: '2'
            },
            {
                displayLabel: '3',
                value: '3'
            },
            {
                displayLabel: '4',
                value: '4'
            },
            {
                displayLabel: '5',
                value: '5'
            }
        ]
    },

    {
        name: 'standStillRarity',
        id: 'stand-rarity',
        defaultValue: '0',
        description: 'Aircraft will stand still',
        help: 'Make aircraft stand still with velocity zero',
        type: 'select',
        onChangeEventHandler: EVENT.SET_STANDSTILL_RARITY,
        optionList: [
            {
                displayLabel: '0',
                value: '0'
            },
            {
                displayLabel: '1',
                value: '1'
            },
            {
                displayLabel: '2',
                value: '2'
            },
            {
                displayLabel: '3',
                value: '3'
            },
            {
                displayLabel: '4',
                value: '4'
            },
            {
                displayLabel: '5',
                value: '5'
            }
        ]
    },


    {
        name: 'trajectoryModificationRarity',
        id: 'vtm',
        defaultValue: '0',
        description: 'Virtual trajectory modification',
        help: 'Changes an aircraft’s current heading.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_TRAJECTORY_RARITY,
        optionList: [
            {
                displayLabel: '0',
                value: '0'
            },
            {
                displayLabel: '1',
                value: '1'
            },
            {
                displayLabel: '2',
                value: '2'
            },
            {
                displayLabel: '3',
                value: '3'
            },
            {
                displayLabel: '4',
                value: '4'
            },
            {
                displayLabel: '5',
                value: '5'
            }
        ]
    },

    {
        name: 'transponderAlterationRarity',
        id: 'false-alarm',
        defaultValue: '0',
        description: 'Transponder code alteration',
        help: 'The aircraft will send a false alarm code.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_CODES_RARITY,
        optionList: [
            {
                displayLabel: '0',
                value: '0'
            },
            {
                displayLabel: '1',
                value: '1'
            },
            {
                displayLabel: '2',
                value: '2'
            },
            {
                displayLabel: '3',
                value: '3'
            },
            {
                displayLabel: '4',
                value: '4'
            },
            {
                displayLabel: '5',
                value: '5'
            }
        ]
    },

    {
        name: 'aircraftSpoofRarity',
        id: 'spoof',
        defaultValue: '0',
        description: 'Aircraft spoofing',
        help: 'The aircraft will now have a fake id.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_SPOOF_RARITY,
        optionList: [
            {
                displayLabel: '0',
                value: '0'
            },
            {
                displayLabel: '1',
                value: '1'
            },
            {
                displayLabel: '2',
                value: '2'
            },
            {
                displayLabel: '3',
                value: '3'
            },
            {
                displayLabel: '4',
                value: '4'
            },
            {
                displayLabel: '5',
                value: '5'
            }
        ]
    },

    {
        name: 'ghostInjectionRarity',
        id: 'ghost',
        defaultValue: '0',
        description: 'Ghost injection',
        help: 'A fake aircraft will appear.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_GHOST_RARITY,
        optionList: [
            {
                displayLabel: '0',
                value: '0'
            },
            {
                displayLabel: '2',
                value: '2'
            },
            {
                displayLabel: '5',
                value: '5'
            },
            {
                displayLabel: '10',
                value: '10'
            },
            {
                displayLabel: '20',
                value: '20'
            },
            {
                displayLabel: '40',
                value: '40'
            }
        ]
    },

    {
        name: 'messageDelayRarity',
        id: 'mess-delay-rarity',
        defaultValue: '0',
        description: 'Message delay aircraft-ratio',
        help: 'The aircraft will now send ADS-B messages with a delay.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_DELAY_RARITY,
        optionList: [
            {
                displayLabel: '0',
                value: '0'
            },
            {
                displayLabel: '1',
                value: '1'
            },
            {
                displayLabel: '2',
                value: '2'
            },
            {
                displayLabel: '3',
                value: '3'
            },
            {
                displayLabel: '4',
                value: '4'
            },
            {
                displayLabel: '5',
                value: '5'
            }
        ]
        },
        {
            name: 'messageDelay',
            id: 'mess-delay',
            defaultValue: '0',
            description: 'Message delay',
            help: 'The aircraft will now send ADS-B messages with a delay.',
            type: 'select',
            onChangeEventHandler: EVENT.SET_DELAY,
            optionList: [
                {
                    displayLabel: 'None',
                    value: '0'
                },
                {
                    displayLabel: 'Very low',
                    value: '2'
                },
                {
                    displayLabel: 'Low',
                    value: '5'
                },
                {
                    displayLabel: 'Medium',
                    value: '10'
                },
                {
                    displayLabel: 'High',
                    value: '30'
                },
                {
                    displayLabel: 'Very high',
                    value: '70'
                }
            ]
            },
    {
        name: 'addFloodingOfNonResponsive',
        id: 'flooding',
        defaultValue: '0',
        description: 'Flooding of non-responsive aircraft',
        help: 'Creates a new aircraft and gives them the non-responsive tag.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_FLOODING_NON_RESPONSIVE,
        optionList: [
            {
                displayLabel: 'None',
                value: '0'
            },
            {
                displayLabel: 'Very low',
                value: '5'
            },
            {
                displayLabel: 'Low',
                value: '10'
            },
            {
                displayLabel: 'Medium',
                value: '15'
            },
            {
                displayLabel: 'High',
                value: '20'
            },
            {
                displayLabel: 'Very high',
                value: '30'
            },
            {
                displayLabel: 'Crash computer',
                value: '60'
            },
        ]
    },

    {
        name: 'jumpProbability',
        id: 'jump-prob',
        defaultValue: '250',
        description: 'Probability of jumps',
        help: 'Probability of jumping aircraft to jump',
        type: 'select',
        onChangeEventHandler: EVENT.SET_JUMP_PROB,
        optionList: [
            {
                displayLabel: 'Very Low',
                value: '5000'
            },
            {
                displayLabel: 'Low',
                value: '1250'
            },
            {
                displayLabel: 'Medium',
                value: '250'
            },
            {
                displayLabel: 'High',
                value: '50'
            },
            {
                displayLabel: 'Very high',
                value: '10'
            }
        ]
    },
    {
        name: 'jumpRadius',
        id: 'jump-rad',
        defaultValue: 'Moderate',
        description: 'Distance of jumps',
        help: 'The distance of a positional ADS-B data jump, when it occurs. ',
        type: 'select',
        onChangeEventHandler: EVENT.SET_JUMP_RADIUS,
        optionList: [
            {
                displayLabel: 'Small radius',
                value: 'Small'
            },
            {
                displayLabel: 'Moderate radius',
                value: 'Moderate'
            },
            {
                displayLabel: 'Large radius',
                value: 'Large'
            }
        ]
    },

    {
        name: 'showAttackAircraftVisibility',
        id: 'attack-visibility',
        defaultValue: 'false',
        description: 'Color code attack aircraft',
        help: 'Toggles the visibility of the attacking aircraft.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_ATTACK_AIRCRAFT_VISIBILITY,
        optionList: [
            {
                displayLabel: 'Yes',
                value: 'true'
            },
            {
                displayLabel: 'No',
                value: 'false'
            }
        ]
    },

    {
        name: 'attackSpecificAircraft',
        id: 'target',
        defaultValue: 'None',
        description: 'Attack specific aircraft',
        help: 'Attacks a specific aircraft by selecting it by callsign.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_SPECIFIC_AIRCRAFT,
        optionList: []

    },

    {
        name: 'attackTypeSpecificAircraft',
        id: 'attack-target',
        defaultValue: '0',
        description: 'Select attack type',
        help: 'Chooses an attack type to perform on the selected aircraft.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_SPECIFIC_ATTACK,
        optionList: [
           {
               displayLabel: 'No attack',
               value: '0'
           },
           {
               displayLabel: 'Non-responsive',
               value: '1'
           },
           {
               displayLabel: 'Changing position',
               value: '2'
           },
           {
               displayLabel: 'False data',
               value: '3'
           },
           {
               displayLabel: 'Stand still',
               value: '4'
           },
           {
               displayLabel: 'Trajectory modification',
               value: '5'
           },
           {
               displayLabel: 'False alarm',
               value: '6'
           },
           {
               displayLabel: 'Spoofing',
               value: '7'
           },
           {
               displayLabel: 'Message delay',
               value: '9'
           }
        ]
    },

    {
        name: 'attackTime',
        id: 'attack-timer',
        defaultValue: '0',
        description: 'Start attack timer',
        help: 'Attacks a set of aircraft or a specific aircraft for a limited amount of time.',
        type: 'select',
        onChangeEventHandler: EVENT.SET_INTERVAL_TIME,
        optionList: [
            {
                displayLabel: 'None',
                value: '0'
            },
            {
                displayLabel: '5 seconds',
                value: '5'
            },
            {
                displayLabel: '30 seconds',
                value: '30'
            },
            {
                displayLabel: '1 minute',
                value: '60'
            },
            {
                displayLabel: '5 minutes',
                value: '300'
            }
         ]

    }

];
