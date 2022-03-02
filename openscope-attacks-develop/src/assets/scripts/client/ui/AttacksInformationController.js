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
        <p class="dialog-title">ADS-B Attacks Information</p>
        <img src="assets/images/colorExplain.png" style="width:566.08px; height:116px" class="image-center-rounded" </img>
        <p class="dialog-text"> 
        Welcome to openScope simulator with cyberattacks from ADS-B. <br> 
        In the settings menu, you may also toggle the visibility of attacking aircraft by the color code above. <br>
        If you want to add a note to an aircraft use the command "at" for AddText. This note has a maximum size of 20 letters. <br> 
        Example: 'SBI654 at prob fake'. To remove: 'SBI654 at' <br>
        You can also guess the color of an aircraft yourself, when you think you know what attack type it is. To guess an aircraft's attack type please use the "g" command for Guess. <br>
        Example: 'SBI654 g 1' (for attack type 1). To remove: 'SBI654 g 0' <br> <br> 
        To save your actions from this session, please hover the "?" button in the bottom right corner and press "Download logfile". <br> <br> 
        These types of attacks originated from the current weaknesses of ADS-B.<br> 
        <a target="_blank" style="color:orange" href="https://www.diva-portal.org/smash/record.jsf?pid=diva2%3A1452531&dswid=5755">
        Please see our paper regarding this simulator and the weaknesses of ADS-B for more information. (click here to open in new window)</a>
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
 * @class AttacksInformationController
 */
export default class AttacksInformationController {
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
     * @for AttacksInformationController
     * @method init
     * @chainable
     */
    init() {
        this.$dialog = $(UI_SETTINGS_MODAL_TEMPLATE);
        this.$dialogBody = this.$dialog.find(SELECTORS.DOM_SELECTORS.DIALOG_BODY);
        const descriptions = GameController.game.attack.getDescriptions();

        _forEach(descriptions, (opt) => {
            if (opt.type !== 'select') {
                return;
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
     * @for AttacksInformationController
     * @method isDialogOpen
     * @return {boolean}
     */
    isDialogOpen() {
        return this.$dialog.hasClass(SELECTORS.CLASSNAMES.OPEN);
    }

    /**
    * @for AttacksInformationController
    * @method toggleDialog
    */
    toggleDialog() {
        this.$dialog.toggleClass(SELECTORS.CLASSNAMES.OPEN);
    }

    /**
     * Build the html for a game option and its corresponding value elements.
     *
     * @for AttacksInformationController
     * @method _buildOptionTemplate
     * @param option {object}
     * @return $container {jquery Element}
     * @private
     */
    _buildOptionTemplate(option) {
        const $container = $(UI_OPTION_CONTAINER_TEMPLATE);
        const $label = $(UI_OPTION_LABEL_TEMPLATE);
        const $optionSelector = $(UI_OPTION_SELECTOR_TEMPLATE);
        const $selector = $(`<select name="${option.name}"></select>`);
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
     * @for AttacksInformationController
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
     * @for AttacksInformationController
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
     * @for AttacksInformationController
     * @method _buildVersionTemplate
     * @return {JQuery|HTML element}
     */
    _buildVersionTemplate() {
        const simulatorVersion = window.GLOBAL.VERSION;
        const $container = $(UI_DIALOG_FOOTER_TEMPLATE);

        $container.text(`openScope: ADS-B Attacks by Gustav Lindahl and Anton Blåberg`);

        return $container;
    }
}
