'use strict';
window.on=window.addEventListener;
window.off=window.removeEventListener;

/**
 * # Awesome-Webcomponents
 *
 * Awesome ES6 compliant web componants for use in your app or website.
 *
 * Currently works awesome in/on Android, Chrome, Chromium, ChromeOS, ChromiumOS, Electron and NW.
 *
 * Only Chromium based browsers support ES6 well enough for these components. Firefox only needs to complete support for standards compliant ` const ` and ` let ` and these will work in FF as well.
 *
 *
 * ### Working Component Examples and Demos
 * [awesome-webcomponents on github.io](https://riaevangelist.github.io/awesome-webcomponents/)
 * #### Licensed under DBAD license
 * See the [DBAD license](https://github.com/philsturgeon/dbad) in your language or our [licence.md](https://github.com/RIAEvangelist/awesome-webcomponents/blob/master/LICENSE.md) file.
 * `npm install `
 *
 * @class Awesome
 * @namespace awesome
 *
 * @prop path {String} Path to folder awesome.js is located in
 * @prop bower {String} path to bower components
 *
 *
 * @prop constants {Object} awesome constants
 * @prop dispatchers {Object} dispatchers for store/action/component messages
 * @prop stores {Object} awesome 1 way data flow stores for use by components
 *
 *
 * @prop loadTemplate {Function} fetches nested template contents for inclusion in awesome-component
 * @prop requireScript {Function} inject script tag into header
 * @prop requireCSS {Function} inject stylesheet link tag into header
 * @prop mergeDataset {Function} merges element's data-* attributes with the defaults for that component element
 * @prop updateAttributesFromData {Function} maps data-* values to * attribute values
 * @prop uniqueEntries {Function} ensures that keys and values of an object unique
 *
 */
class Awesome{
    constructor(){
        Object.defineProperties(
            this,
            {
                /**
                 * Path to folder awesome.js is located in
                 * @member awesome.path
                 * @protected
                 * @type {String}
                 */
                path:{
                    enumerable:true,
                    writable:false,
                    value:document.head.querySelector(
                        '[src$="/awesome.js"]'
                    ).src.replace(
                        /awesome\.js$/,
                        ''
                    )
                },
                /**
                 * @member awesome.constants
                 * @type {Object} extensible/overwriteable constansts used in awesome apps
                 *
                 * @prop action {Object} action constants
                 * @prop store {Object} store constants
                 * @prop component {Object} component constants
                 */
                constants:{
                    enumerable:true,
                    writable:false,
                    value:{}
                },
                /**
                * @member awesome.dispatchers
                * @type {Object} dispatchers for awesome 1 way data flow
                * @protected
                * @prop action {Object} action dispatcher
                * @prop store {Object} store dispatcher
                * @prop component {Object} component dispatcher
                 */
                dispatchers:{
                    enumerable:true,
                    writable:false,
                    value:{}
                },
                /**
                * @member awesome.stores
                * @type {Object} awesome 1 way data flow stores for use by components
                */
                stores:{
                    enumerable:true,
                    writable:false,
                    value:{}
                },
                loadTemplate:{
                    enumerable:true,
                    writable:false,
                    value:loadTemplate
                },
                requireScript:{
                    enumerable:true,
                    writable:false,
                    value:requireScript
                },
                requireCSS:{
                    enumerable:true,
                    writable:false,
                    value:requireCSS
                },
                uniqueEntries:{
                    enumerable:true,
                    writable:false,
                    value:uniqueEntries
                },
                mergeDataset:{
                    enumerable:true,
                    writable:false,
                    value:mergeDataset
                },
                updateAttributesFromData:{
                    enumerable:true,
                    writable:false,
                    value:updateAttributesFromData
                }
            }
        );

        /**
         * Path to bower components
         * @member awesome.bower
         * @protected
         * @type {String}
         */
        Object.defineProperty(
            this,
            'bower',
            {
                enumerable:true,
                writable:false,
                value:(document.location.pathname.indexOf('/awesome-webcomponents/') !== 0)?
                    this.path.split('awesome-webcomponents/')[0]
                        :
                    '/awesome-webcomponents/bower_components/'
            }
        );

        Object.defineProperties(
            this.constants,
            {
                /**
                 * Shallow merge action constants object
                 * @member awesome.constants.action
                 * @type {Object}
                 */
                action:{
                    enumerable:true,
                    get:getActionConstants,
                    set:setActionConstants
                },
                /**
                 * Shallow merge store constants object
                 * @member awesome.constants.store
                 * @type {Object}
                 */
                store:{
                    enumerable:true,
                    get:getStoreConstants,
                    set:setStoreConstants
                },
                /**
                 * Shallow merge constants constants object
                 * @member awesome.constants.component
                 * @type {Object}
                 */
                component:{
                    enumerable:true,
                    get:getComponentConstants,
                    set:setComponentConstants
                }
            }
        );

        const actions={};
        const stores={};
        const components={};

        function getActionConstants(){
            return actions;
        }

        function setActionConstants(constants){
            Object.assign(actions,constants);
            uniqueEntries(actions);
            return actions;
        }

        function getStoreConstants(){
            return stores;
        }

        function setStoreConstants(constants){
            Object.assign(stores,constants);
            uniqueEntries(stores);
            return stores;
        }

        function getComponentConstants(){
            return components;
        }

        function setComponentConstants(constants){
            Object.assign(components,constants);
            uniqueEntries(components);
            return components;
        }

        /**
         * loadTemplate collects template element and returns element
         * @method awesome.loadTemplate
         * @protected
         * @param  {Object} instance instance or scope of template element
         * @return {Object}          contents of template element
         */
        function loadTemplate(instance){
            const template=instance.querySelector('template');
            let content='';
            if(template){
                content=`
                    ${template.innerHTML}
                    ${template.outerHTML}
                `;
            }
            return content;
        }

        /**
         * requireScript includes js scripts into document
         * @method awesome.requireScript
         * @protected
         * @param  {String} path path to script
         * @return {Boolean}      true
         */
        function requireScript(path){
            const script=document.createElement('script');
            const existingScript=document.head.querySelector(`script[src='${path}']`);
            if(existingScript){
                return false;
            }
            script.src=path;
            script.async=false;
            script.defer=true;
            script.type='text/javascript';
            script.onload=scriptLoaded.bind(path);
            document.head.appendChild(script);
            return true;
        }

        function scriptLoaded(){
            /**
             * emitted when a script included via {@link awesome.requireScript} has completed loading a script.
             * @event "awesome-script-loaded"
             * @param {Event} e Event Data
             * @param {String} e.detail path of the loaded script
             *
             */
            const e=new CustomEvent(
                'awesome-script-loaded',
                {
                    detail:this
                }
            );

            window.dispatchEvent(e);
        }

        /**
         * requireCSS requires a CSS stylesheet into the document
         * @method awesome.requireCSS
         * @param  {String} path Path to CSS stylesheet
         * @return {Boolean}      false if stylesheet has already been loaded into document
         */
        function requireCSS(path){
            const css=document.createElement('link');
            const existingCSS=document.head.querySelector(`link[href='${path}']`);

            if(existingCSS){
                return false;
            }

            css.rel='stylesheet';
            css.href=path;
            document.head.appendChild(css);
        }

        /**
         * mergeDataset merges element's dataset to current default dataset of document
         * @method awesome.mergeDataset
         * @param {Object} el       element dataset to be merged
         * @param {Object} defaults default dataset
         */
        function mergeDataset(el,defaults){
            const data={};
            Object.assign(
                data,
                defaults,
                el.dataset
            );

            Object.assign(
                el.dataset,
                data
            );
        }

        /**
         * updateAttributesFromData updates an element's attributes
         * @method awesome.updateAttributesFromData
         * @param  {Object} el    element object
         * @param  {String} key   key of element
         * @param  {String} value value to update data to
         * @return {Object}       updted element object
         */
        function updateAttributesFromData(el,key,value){
            if(key.indexOf('data-')!==0){
                return el;
            }

            el[
                key.replace('data-','')
            ]=value;

            return el;
        }

        /**
         * uniqueEntries ensures that keys and values of data array are unique
         * @method awesome.uniqueEntries
         * @param  {Array} data Data array with unique entries
         * @return {Boolean}      true
         */
        function uniqueEntries(data){
            const duplicateCheckArray=[];
            const duplicateKeyArray=[];

            const keys=Object.keys(data);
            for(let i=0; i<keys.length; i++){
                const key=keys[i];
                const entry=data[
                    key
                ];
                const duplicateKeyIndex=duplicateKeyArray.indexOf(key);
                const duplicateIndex=duplicateCheckArray.indexOf(entry);

                if(duplicateKeyIndex>-1){
                    const error=[
                        'duplicate key of',
                        key,
                        'const keys MUST be unique!'
                    ].join(' ');

                    throw(error);
                }

                if(duplicateIndex>-1){
                    const error=[
                        'duplicate value string of',
                        data[key],
                        'found on',
                        key,
                        '&&',
                        keys[duplicateIndex],
                        'const value strings MUST be unique!'
                    ].join(' ');

                    throw(error);
                }
                duplicateKeyArray.push(key);
                duplicateCheckArray.push(entry);
            }

            return true;
        };
    }
}

const awesome=new Awesome;

//bootstrap css
awesome.requireCSS(`${awesome.path}css/component.css`);

//node modules
awesome.requireScript(`${awesome.bower}event-pubsub/event-pubsub-browser.js`);
awesome.requireScript(`${awesome.bower}js-message/js-message-vanilla.js`);
awesome.requireScript(`${awesome.bower}browser-error-classes/Errors.js`);

//constants
awesome.requireScript(`${awesome.path}stores/constants.js`);
awesome.requireScript(`${awesome.path}actions/constants.js`);
awesome.requireScript(`${awesome.path}components/constants.js`);

//dispatchers
awesome.requireScript(`${awesome.path}dispatchers/store.js`);
awesome.requireScript(`${awesome.path}dispatchers/action.js`);
awesome.requireScript(`${awesome.path}dispatchers/component.js`);

//awesome classes
awesome.requireScript(`${awesome.path}stores/store.js`);
