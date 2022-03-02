import $ from 'jquery';
import _forEach from 'lodash/forEach';
import _isNaN from 'lodash/isNaN';
import GameController from '../game/GameController';
import { SELECTORS } from '../constants/selectors';

/**
 * @property UI_SETTINGS_MODAL_TEMPLATE
 * @type {string}
 * @final
 */
const UI_SETTINGS_MODAL_TEMPLATE = `
    <div class="option-dialog dialog">
        <p class="dialog-title">ADS-B Attacks</p>
        <div class="dialog-body nice-scrollbar"></div>
        <p class="dialog-text">For more information about attacks please hover "?" and press information.
        </p>
    </div>`;

/**
 * @property UI_DIALOG_FOOTER_TEMPLATE
 * @type {string}
 * @final
 */
const UI_DIALOG_FOOTER_TEMPLATE = '<div class="dialog-footer">Attacks!</div>';

/**
 * @property UI_OPTION_CONTAINER_TEMPLATE
 * @type {string}
 * @final
 */
const UI_OPTION_CONTAINER_TEMPLATE = '<div class="form-element"></div>';

/**
 * @property UI_OPTION_LABEL_TEMPLATE
 * @type {string}
 * @final
 */
const UI_OPTION_LABEL_TEMPLATE = '<span class="form-label"></span>';

/**
 * @property UI_OPTION_SELECTOR_TEMPLATE
 * @type {string}
 * @final
 */
const UI_OPTION_SELECTOR_TEMPLATE = '<span class="form-type-select"></span>';

// TODO: This class has no corresponding styles
/**
 * @property UI_STATIC_TEXT_TEMPLATE
 * @type {string}
 * @final
 */
const UI_STATIC_TEXT_TEMPLATE = '<span class="option-static-text"></span>';

/**
 * @class AttacksController
 */
export default class AttacksController {
    constructor($element) {
        /**
         * Root DOM element
         *
         * @property $element
         * @type {jquery|HTML Element}
         * @default $element
         */
        this.$element = $element;

        /**
         * Dialog DOM element
         *
         * @property $dialog
         * @type {jquery|HTML Element}
         * @default null
         */
        this.$dialog = null;

        /**
         * Dialog's body DOM element
         *
         * @property $dialogBody
         * @type {jquery|HTML Element}
         * @default null
         */
        this.$dialogBody = null;

        this.init();
    }

    /**
     *
     * @for AttacksController
     * @method init
     * @chainable
     */
    init() {
        this.$dialog = $(UI_SETTINGS_MODAL_TEMPLATE);
        this.$dialogBody = this.$dialog.find(SELECTORS.DOM_SELECTORS.DIALOG_BODY);
        const descriptions = GameController.game.attack.getDescriptions();
        var newOptionList = this.buildAircraftSelectorOptionList();

        _forEach(descriptions, (opt) => {
            if (opt.type !== 'select') {
                return;
            }
            if (opt.description === 'Attack specific aircraft'){
                opt.optionList = newOptionList;
            }
            const $container = this._buildOptionTemplate(opt);

            this.$dialogBody.append($container);
        });

        const $version = this._buildVersionTemplate();

        this.$dialog.append($version);
        this.$element.append(this.$dialog);

        return this;
    }

    /**
     * Returns whether the airport selection dialog is open
     *
     * @for AttacksController
     * @method isDialogOpen
     * @return {boolean}
     */
    isDialogOpen() {
        return this.$dialog.hasClass(SELECTORS.CLASSNAMES.OPEN);
    }

    /**
    * @for AttacksController
    * @method toggleDialog
    */
    toggleDialog() {
        this.$dialog.toggleClass(SELECTORS.CLASSNAMES.OPEN);
    }

    /**
     * Build the html for a game option and its corresponding value elements.
     *
     * @for AttacksController
     * @method _buildOptionTemplate
     * @param option {object}
     * @return $container {jquery Element}
     * @private
     */
    _buildOptionTemplate(option) {
        const $container = $(UI_OPTION_CONTAINER_TEMPLATE);
        const $label = $(UI_OPTION_LABEL_TEMPLATE);
        const $optionSelector = $(UI_OPTION_SELECTOR_TEMPLATE);
        const $selector = $(`<select name="${option.name}" id="${option.id}"></select>`);
        const selectedOption = GameController.game.attack.getAttackByName(option.name);

        $container.append($label);
        $label.text(option.description);

        // this could me done with a _map(), but verbosity here makes the code easier to read
        for (let i = 0; i < option.optionList.length; i++) {
            const $optionSelectTempalate = this._buildOptionSelectTemplate(option.optionList[i], selectedOption);

            $selector.append($optionSelectTempalate);
        }

        // TODO: this should be moved to proper event handler method and only assigned here.
        $selector.change((event) => {
            const $currentTarget = $(event.currentTarget);

            GameController.game.attack.setAttackByName($currentTarget.attr('name'), $currentTarget.val());
        });

        $optionSelector.append($selector);
        $container.append($optionSelector);

        return $container;
    }

    /**
     * Build the html for a select option.
     *
     * @for AttacksController
     * @method _buildOptionTemplate
     * @param optionData {array<string>}
     * @param selectedOption {string}
     * @return optionSelectTempalate {HTML Element}
     * @private
     */
    _buildOptionSelectTemplate(optionData, selectedOption) {
        // the `selectedOption` coming in to this method will always be a string (due to existing api) but
        // could contain valid numbers. here we test for valid number and build `parsedSelectedOption` accordingly.
        const parsedSelectedOption = !_isNaN(parseFloat(selectedOption)) ?
            parseFloat(selectedOption) :
            selectedOption;

        if (optionData.value === parsedSelectedOption) {
            return `<option value="${optionData.value}" selected>${optionData.displayLabel}</option>`;
        }

        return `<option value="${optionData.value}">${optionData.displayLabel}</option>`;
    }

    /**
     * Builds a static text information psuedo-option.
     * Will display as such:
     *
     * `(settings menu)`
     *
     * `Text text text         Value value value`
     *
     * @for AttacksController
     * @method _buildStaticTemplate
     * @param {string} label
     * @param {string} value (optional)
     * @return {JQuery|HTML element}
     */
    _buildStaticTemplate(label, value = '') {
        const $container = $(UI_OPTION_CONTAINER_TEMPLATE);
        const $label = $(UI_OPTION_LABEL_TEMPLATE);
        const $value = $(UI_STATIC_TEXT_TEMPLATE);

        $container.append($label);
        $container.append($value);
        $label.text(label);
        $value.text(value);

        return $container;
    }

    /**
     * Build the html for the simulator version psuedo-option.
     *
     * @for AttacksController
     * @method _buildVersionTemplate
     * @return {JQuery|HTML element}
     */
    _buildVersionTemplate() {
        const simulatorVersion = window.GLOBAL.VERSION;
        const $container = $(UI_DIALOG_FOOTER_TEMPLATE);

        $container.text(`openScope: ADS-B Attacks by Gustav Lindahl and Anton Blåberg`);

        return $container;
    }

    buildAircraftSelectorOptionList(){
        const aircraft_list = window.aircraftController.aircraft.list;
        var optionList = [];
        var option = {
            displayLabel: 'None',
            value: 'None'
        }
        optionList.push(option);
        for (let i = 0; i < aircraft_list.length; i++){
            option = {
               displayLabel: aircraft_list[i].callsign,
               value: aircraft_list[i].callsign
            }
            optionList.push(option);
        }
        return optionList;
    }
}
