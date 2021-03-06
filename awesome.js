'use strict';
window.on=window.addEventListener;
window.off=window.removeEventListener;

/**
 * # Awesome-Webcomponents
 *
 * Awesome ES6 compliant web componants for use in your app or website.
 *
 * Tested and working on :
 * * Chrome
 * * Chromium
 * * Android Chrome
 * * FireFox >=45
 * * IE Edge
 * * [Electron](http://electron.atom.io/)
 * * [NW.js](http://nwjs.io/)
 *
 * Firefox >=45 supports evrything needed with the included ` ./bower_components/document-register-element/build/document-register-element.js `.
 * IE Edge ` Array.prototype.includes ` polyfill is build into awesome.js
 *
 * install awesome-webcomponents via bower for your project by running ` bower install awesome-webcomponents ` don't forget to run ` bower update ` on occasion to get the latest version!
 *
 * ### Working Component Examples and Demos
 * [awesome-webcomponents on github.io](https://riaevangelist.github.io/awesome-webcomponents/)
 * #### Licensed under DBAD license
 * See the [DBAD license](https://github.com/philsturgeon/dbad) in your language or our [licence.md](https://github.com/RIAEvangelist/awesome-webcomponents/blob/master/LICENSE.md) file.
 *
 * # Contributing
 * 1. Fork the repo
 * 2. Do awesome stuff!
 * 3. Submit a Pull Request
 * 4. Feel Awesome!
 *
 * # Awesome.js Class api
 *
 * ` window.awesome = new Awesome; ` is called automatically to instantiate a global ` awesome ` object for your use right away.
 *
 * ---
 *
 * @class Awesome
 * @namespace awesome
 *
 * @prop awesome.path {String} Path to folder awesome.js is located in
 * @prop awesome.bower {String} path to bower components
 *
 *
 * @prop constants {Object} awesome constants
 * @prop constants.components {ShallowMergeObject} shallow merge for awesome.constants.components
 * @prop constants.stores {ShallowMergeObject} shallow merge for awesome.constants.stores
 * @prop constants.actions {ShallowMergeObject} shallow merge for awesome.constants.actions
 *
 * @prop config {DeepMergeObject} deep recursive merge for awesome config object
 *
 * @prop language {Object} awesome language objects
 * @prop language.default {Object} awesome default language object
 * @prop language.current {Object} awesome language object merged default and desiredLanguage
 * @prop language.* {Object} awesome language objects for specific languages like ` awesome.language.en ` or ` awesome.language.ru `
 * @prop setLanguage {Function} set the current language
 * @prop dynamicLanguageString {Function} a way to pass variables to language strings. This is helpful when you support languages with a variety of grammatical structures
 *
 * @prop dispatchers {Object} dispatchers for store/action/component messages
 * @prop stores {Object} registered awesome.Store instances. These are designed to support 1 way data flows for use by components
 *
 * @prop Store {Class} Store class, used to create new stores
 * @prop loadTemplate {Function} fetches nested template contents for inclusion in awesome-component
 * @prop requireScript {Function} inject script tag into header
 * @prop requireCSS {Function} inject stylesheet link tag into header
 *
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
                ready:{
                    enumerable:true,
                    writable:true,
                    value:false
                },
                /**
                 * Path to folder awesome.js is located in.
                 *
                 * @example
                 *
                 * //use awesome.path to reference the awesome-webcomponents directory
                 * awesome.requireCSS(`${awesome.path}components/buttons/awesome-buttonset.css`);
                 * awesome.requireScript(`${awesome.path}components/buttons/awesome-buttonset.js`);
                 *
                 * @member awesome.path
                 * @protected
                 * @type {String}
                 */
                path:{
                    enumerable:true,
                    writable:false,
                    value:document.head.querySelector(
                        '[src$="/awesome.js"], [src^="/awesome.js"]'
                    ).src.replace(
                        /awesome\.js$/,
                        ''
                    )
                },
                /**
                 * extensible/overwriteable constansts used in awesome apps
                 *
                 * @member awesome.constants
                 *
                 * @type {Object}
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
                _config:{
                    enumerable:false,
                    writable:true,
                    value:{}
                },
                /**
                 * extensible/overwriteable constansts used in awesome apps
                 * @member awesome.config
                 * @type {Object}
                 *
                 */
                config:{
                    enumerable:true,
                    get:getConfigs,
                    set:configMerge
                },
                /**
                 * language objects used by awesome components
                 * @member awesome.language
                 * @type {Object}
                 */
                language:{
                    enumerable:true,
                    writable:false,
                    value:{
                        default:{},
                        current:{}
                    }
                },
                setLanguage:{
                    enumerable:true,
                    writable:false,
                    value:setLanguage
                },
                dynamicLanguageString:{
                    enumerable:true,
                    writable:false,
                    value:dynamicLanguageString
                },
                /**
                * dispatchers for awesome 1 way data flow
                * @member awesome.dispatchers
                * @type {Object}
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
                *
                * awesome 1 way data flow stores for use by component
                * @member awesome.stores
                *
                * @example
                *
                * state=awesome.stores.auth.state;
                *
                * state.on(
                *   	'change',
                *   	this.yourAwesomeUpdateHandler.bind(this)
                * );
                *
                * @type {Object}
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
                requireLanguage:{
                    enumerable:true,
                    writable:false,
                    value:requireLanguage
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
         *
         * @example
         *
         * //include bower components using the bower components path
         * awesome.requireScript(`${awesome.bower}bower-component/bower-component.js`);
         *
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
                value:(document.location.pathname.match(/\/awesome-webcomponents\//))?
                    `${this.path}bower_components/` //if demo
                    :
                    this.path.split('awesome-webcomponents/')[0] //if not demo
            }
        );

        Object.defineProperties(
            this.constants,
            {
                /**
                 * Shallow merge action constants object
                 *
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
                 *                 *
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

        /**
         * Deep merge config object
         * @method awesome.config.setter
         *
         *	@example
         *
         * ```javascript
         *
         * // awesome.config could be
         * {
         *     a:1,
         *     b:{
         *         c:3
         *     },
         *     d:{
         *         e:55,
         *         f:{
         *             g:99
         *         }
         *     },
         *     q:{
         *         r:77
         *     }
         * }
         *
         * awesome.configMerge(
         *     {
         *         b:{
         *             x:{
         *                 y:{
         *                     z:99999
         *                 }
         *             }
         *         },         *
         *         d:{
         *             f:{
         *                 h:55
         *             }
         *         },
         *         q:33
         *     }
         * )
         *
         *
         * //now awesome.config would look like
         * {
         *     a:1,
         *     b:{
         *         c:3
         *             x:{
         *                 y:{
         *                     z:99999
         *                 }
         *             }
         *         }
         *     },
         *     d:{
         *         e:55,
         *         f:{
         *             g:99,
         *             h:55
         *         }
         *     },
         *     q:33
         * }
         *
         *
         * ```
         *
         * @return {Object}            awesome.config
         */
        function configMerge(root,newRoot){
            if(!newRoot){
                newRoot=root;
                root=this._config;
            }

            for (const key in newRoot) {
                const newChild=newRoot[key];
                let rootChild=root[key];
                const newChildIsObject=(typeof newChild==='object');

                if (newChildIsObject && typeof rootChild==='object') {
                    root[key]=configMerge(rootChild,newChild);
                    continue;
                }

                root[key]=(newChildIsObject)?
                    Object.assign({},newChild)
                    :
                    newChild;
            }

            return root;
        }

        function getConfigs(){
            return this._config;
        }

        /**
         * Merge a specific language and the default languages. If the languageCode has not been populated on the awesome.language object, the awesome.language.default will be used.
         * @method setLanguage
         * @param  {String}    languageCode like 'en', 'en-US', 'es' or 'zh' etc.
         *
         * @example
         *
         * ```javascript
         * //if awesome.language.default is
         * {
         *     hello:'Hello',
         *     appName:'My Awesome App'
         * }
         *
         * //and awesome.language.es is
         * {
         *     hello:'Ola'
         * }
         *
         * awesome.setLanguage('es');
         *
         * //will result in awesome.language.current being
         * {
         *     hello:'Ola',
         *     appName:'My Awesome App'
         * }
         *
         * ```
         *
         */
        function setLanguage(languageCode){
            if(!languageCode){
                languageCode='default';
            }

            let desiredLanguage=this.language[languageCode];

            if(!desiredLanguage && languageCode.length>2){
                if(!hasLang(languageCode)){
                    localStorage.setItem('language',languageCode);
                    return;
                }
                languageCode=languageCode.slice(0,2);
                desiredLanguage=this.language[languageCode];
            }

            if(!desiredLanguage){
                if(!hasLang(languageCode)){
                    localStorage.setItem('language',languageCode);
                    return;
                }
                languageCode='default';
                desiredLanguage=this.language[languageCode];
            }

            localStorage.setItem('language',languageCode);

            const newLanguage={};
            Object.assign(
                newLanguage,
                this.language.default,
                desiredLanguage
            );

            this.language.current=Object.assign(
                {},
                newLanguage
            );

            /**
             * emitted when the language is set or changed via {@link awesome.setLanguage}.
             * @event awesome.awesome-language-set
             * @param {Event} e Event Data
             * @param {String} e.detail languageCode
             *
             */
            const e=new CustomEvent(
                'awesome-language-set',
                {
                    detail:languageCode
                }
            );

            window.dispatchEvent(e);
        }

        function dynamicLanguageString(key,params){
            // make regEx like :  /${your-var1}|${anotherVar}|${magicalVar}/ig
            const vars = new RegExp(`\\$\\{${Object.keys(params).join('\}|\\$\\{')}\\}`,"gi");
            const string=this.language.current[key];

            if(!string){
                return string;
            }

            return string.replace(
                vars,
                function(matched){
                    return params[matched.slice(2,-1)];
                }
            );
        }

        const actions={};
        const stores={};
        const components={};

        /**
         * action constants getter
         * @method awesome.constants.action.getter
         * @protected
         * @return {ActionConstants}           action constants
         */
        function getActionConstants(){
            return actions;
        }

        /**
         * action constants setter : merges the current action constants and the new constants via shallow merge.
         *
         * @example
         * //original constants
         * {
         *  	ACTION_CONSTANT1: 'actionConst1',
         *  	ACTION_CONSTANT2: 'actionConst2',
         * }
         * myNewConstants = {
         *  	NEW_CONSTANT_1: 'const1',
         *  	NEW_CONSTANT_2: 'const2'
         * }
         *
         * awesome.action.constants = myNewConstants;
         *
         * //action constants will now be
         * //awesome.constants.action
         * {
         *  	ACTION_CONSTANT1: 'actionConst1',
         *  	ACTION_CONSTANT2: 'actionConst2',
         *  	NEW_CONSTANT_1: 'const1',
         *  	NEW_CONSTANT_2: 'const2'
         * }
         *
         * @method awesome.constants.action.setter
         * @protected
         * @param  {Object}           constants constants to merge
         * @return {ActionConstants} actions merged constants
         */
        function setActionConstants(constants){
            Object.assign(actions,constants);
            uniqueEntries(actions);
            return actions;
        }

        /**
         * store constants getter
         * @method awesome.constants.store.getter
         * @protected
         * @return {StoreConstants}           store constants
         */
        function getStoreConstants(){
            return stores;
        }

        /**
         * action constants setter : merges the current store constants and the new constants via shallow merge.
         *
         * @example
         * //original constants
         * {
         *  	STORE_CONSTANT1: 'actionConst1',
         *  	STORE_CONSTANT2: 'actionConst2',
         * }
         *
         * myNewConstants = {
         *  	NEW_CONSTANT_1: 'const1',
         *  	NEW_CONSTANT_2: 'const2'
         * }
         *
         * awesome.constantants.store = myNewConstants;
         *
         * //action constants will now be
         * //awesome.constants.store
         * {
         *  	STORE_CONSTANT1: 'actionConst1',
         *  	STORE_CONSTANT2: 'actionConst2',
         *  	NEW_CONSTANT_1: 'const1',
         *  	NEW_CONSTANT_2: 'const2'
         * }
         *
         * @method awesome.constants.store.setter
         * @protected
         * @param  {Object}           constants constants to merge
         * @return {StoreConstants} stores merged constants
         */
        function setStoreConstants(constants){
            Object.assign(stores,constants);
            uniqueEntries(stores);
            return stores;
        }

        /**
         * component constants getter
         * @method awesome.constants.component.getter
         * @protected
         * @return {ComponentConstants}           component constants
         */
        function getComponentConstants(){
            return components;
        }

        /**
         * component constants setter : merges the current component constants and the new constants via shallow merge.
         *
         * @example
         *
         * //original constants
         * {
         *  	COMPONENT_CONSTANT1: 'actionConst1',
         *  	COMPONENT_CONSTANT2: 'actionConst2',
         * }
         *
         * myNewConstants = {
         *  	NEW_CONSTANT_1: 'const1',
         *  	NEW_CONSTANT_2: 'const2'
         * }
         *
         * awesome.constants.components = myNewConstants;
         *
         * //action constants will now be
         * //awesome.constants.component
         * {
         *  	COMPONENT_CONSTANT1: 'actionConst1',
         *  	COMPONENT_CONSTANT2: 'actionConst2',
         *  	NEW_CONSTANT_1: 'const1',
         *  	NEW_CONSTANT_2: 'const2'
         * }
         *
         * @method awesome.constants.component.setter
         * @protected
         * @param  {Object}           constants constants to merge
         * @return {ComponentConstants} components merged constants
         */
        function setComponentConstants(constants){
            Object.assign(components,constants);
            uniqueEntries(components);
            return components;
        }

        /**
         * loadTemplate collects template element and returns element
         *
         * @example
         *
         * //taken from awesome-list example, loadTemplate will load template element of awesome-component
         * //and returns element
         *
         * //html snippet
         *
         *  <awesome-list>
        *        <template>
        *            <li>
        *                Test 1
        *            </li>
        *            <li>
        *                Test 2
        *            </li>
        *            <li>
        *                Test 3
        *            </li>
        *        </template>
        *    </awesome-list>
        *
         * //js
         *
         * const content=awesome.loadTemplate(this);
         *
         * //constents of content
        *        `<li>
        *            Test 1
        *        </li>
        *        <li>
        *            Test 2
        *        </li>
        *        <li>
        *            Test 3
        *        </li>`
         *
         * //usage
         * //this content can now be loaded into awesome-list
         *
         * this.innerHTML=`
        *     <ul>
        *         ${content}
        *     </ul>
         *`;
         *
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

        let remainingScriptCount=0;

        /**
         * requireScript appends scripts to the docuyment head with a differed false
         *
         * @example
         *
         * //here we require the dispatcher to action and the constants to stores and actions
         * awesome.requireScript(`${awesome.path}dispatchers/action.js`);
         * awesome.requireScript(`${awesome.path}actions/constants.js`);
         * awesome.requireScript(`${awesome.path}stores/constants.js`);
         *
         * @method awesome.requireScript
         * @protected
         * @param  {String} path path to script
         * @return {Boolean}      true
         */
        function requireScript(path){
            const existingScript=document.head.querySelector(`script[src='${path}']`);
            if(existingScript){
                return false;
            }
            const script=document.createElement('script');
            remainingScriptCount++;
            this.ready=false;

            script.src=path;
            script.async=false;
            script.defer=true;
            script.type='text/javascript';
            script.onload=scriptLoaded.bind(this,path);
            script.onerror=scriptError.bind(this,path);
            document.head.appendChild(script);
            return true;
        }

        /**
         * requireLanguage includes js scripts into document
         * @method awesome.requireScript
         * @protected
         * @param  {String} path path to script
         * @return {Boolean}      true
         */
        function requireLanguage(path){
            const existingScript=document.head.querySelector(`script[src='${path}']`);
            if(existingScript){
                return false;
            }
            const script=document.createElement('script');
            remainingScriptCount++;
            this.ready=false;

            script.src=path;
            script.dataset.language=true;
            script.async=true;
            script.defer=false;
            script.type='text/javascript';
            script.onload=languageLoaded.bind(this);;
            script.onerror=scriptError.bind(this);
            document.head.appendChild(script);
            return true;
        }

        function scriptLoaded(path){
            /**
             * emitted when a script included via {@link awesome.requireScript} has completed loading a script.
             *
             * @example
             *
             * window.on(
             *  	'awesome-script-loaded',
             *  	yourAwesomeLoadedHandler
             *);
             *
             * @event awesome.awesome-script-loaded
             * @param {Event} e Event Data
             * @param {String} e.detail path of the loaded script
             *
             */
            const e=new CustomEvent(
                'awesome-script-loaded',
                {
                    detail:path
                }
            );

            remainingScriptCount--;
            if(remainingScriptCount<1){
                this.ready=true;
            }

            window.dispatchEvent(e);

            //give a small buffer incase more scripts are added right away
            setTimeout(
                awesomeReady.bind(this),
                10
            );
        }

        function scriptError(path){
            /**
             * emitted when a script included via {@link awesome.requireScript} can NOT be loaded.
             * @event awesome.awesome-script-error
             * @param {Event} e Event Data
             * @param {String} e.detail path of the loaded script
             *
             */
            const e=new CustomEvent(
                'awesome-script-error',
                {
                    detail:path
                }
            );

            remainingScriptCount--;
            if(remainingScriptCount<1){
                this.ready=true;
            }

            window.dispatchEvent(e);

            awesomeReady.bind(this);
        }

        function languageLoaded(path){
            /**
             * emitted when a new language file included via {@link awesome.requireLanguage} has completed loading.
             * @event awesome.awesome-language-loaded
             * @param {Event} e Event Data
             * @param {String} e.detail path of the loaded language
             *
             */
            const e=new CustomEvent(
                'awesome-language-loaded',
                {
                    detail:path
                }
            );

            this.setLanguage(
                localStorage.getItem('language')
            );

            remainingScriptCount--;
            if(remainingScriptCount<1){
                this.ready=true;
            }

            window.dispatchEvent(e);

            //give a small buffer incase more languages are added right away
            setTimeout(
                awesomeReady.bind(this),
                10
            );
        }

        function awesomeReady(){
            if(!this.ready){
                return;
            }

            /**
             * emitted when all queued scripts included via {@link awesome.requireScript} have completed loading. This will fire each time awesome deems it is ready for use. So if you include more scripts long after load it will fire again once all the new scripts are loaded.
             * @event awesome.awesome-ready
             *
             */
            const e=new CustomEvent(
                'awesome-ready'
            );

            //detect or determine language
            let lang=localStorage.getItem('language');
            if(!lang){
                lang=window.navigator.language;
                localStorage.setItem('language',lang);
            }

            if(!hasLang(lang)){
                return;
            }

            // if language is geographically specific like 'en-US' and not present try the non-specific version like 'en'
            if(!this.language[lang] && lang.length>2){
                lang=lang.slice(0,2);
                localStorage.setItem('language',lang);
            }

            if(!hasLang(lang)){
                return;
            }

            this.setLanguage(lang);

            window.dispatchEvent(e);

            awesome.dispatchers.component.trigger(
                awesome.constants.action.ROUTE_UPDATE_SCREENS
            );

            const activeScreen=document.querySelector('.activeScreen');
            let startScreen=document.querySelector('body').dataset.start_screen;
            const hashScreen=document.location.hash.slice(2);

            if(hashScreen){
                startScreen=hashScreen;
            }

            if(activeScreen || !startScreen){
                return;
            }

            awesome.dispatchers.component.trigger(
                awesome.constants.action.ROUTE_REQUEST,
                startScreen
            );
        }

        function hasLang(lang){
            const hasLang=(document.head.querySelector(`[src$='${lang}.js']`))?
                true:false;

            /**
             * emitted when a language check is performed for the first time and the language script is NOT in the head. This is useful when you have your own language files to load.
             * @event awesome.awesome-wants-lang
             * @param {Event} e Event Data
             * @param {String} e.detail desired language code
             *
             */
            const e=new CustomEvent(
                'awesome-wants-lang',
                {
                    detail:lang
                }
            );

            if(!hasLang){
                awesome.requireLanguage(`${awesome.path}languages/${lang}.js`);
                window.dispatchEvent(e);
            }

            return hasLang;
        }

        /**
         * requireCSS requires and appends scripts to CSS head
         *
         * @example
         *
         * //require any CSS to script
         * awesome.requireCSS(`${awesome.path}components/your-component/your-component.css`);
         *
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
         *
         * @example
         *
         * defaultElementDataset = {
         *  	property1: 'one',
         *  	property2: 'two'
         * }
         *
         * function componentCreatedCallback(componentDataset){
         * 		mergeDataset(myElement, componentDataset);
         * }
         *
         * //after the component is created it will contain
         * //ElementDataset
         *  {
         *  	property1 : 'newProp1',
         *  	property2 : 'newProp2'
         *  }
         *
         * @method awesome.mergeDataset
         * @param {HTMLElement} el         element with dataset to be merged
         * @param {Object} defaults        default dataset
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
         *
         * @example
         * //orginal element attributes
         * {
         *  	attribute1 : 'green',
         *  	attribute2 : 'red',
         *  	attribute3 : 'white'
         * }
         *
         * yourElementAttributeUpdater(element, attribute3, black);
         *
         * function yourElementAttributeUpdater(element, elementKey,newValue){
         *  	awesome.updateAttributesFromData(element, elementKey, newValue);
         * }
         *
         * //resulting element attributes
         * {
         *  	attribute1 : 'green',
         *  	attribute2 : 'red',
         *  	attribute3 : 'black'
         * }
         *
         * @method awesome.updateAttributesFromData
         * @param  {HTMLElement}    el      element object
         * @param  {String}         key     key of element
         * @param  {String}         value   value to update data to
         * @return {HTMLElement}            updated element object
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
         *
         * @example
         *
         * //check that your constants all have unique entries as they should
         *  const constans = awesome.constans;
         *
         * awesome.uniqueEntries(constans.store);
         * awesome.uniqueEntries(constans.components);
         * awesome.uniqueEntries(constans.actions);
         *
         * //if entires are not unique an error will be thrown
         * `duplicate key of yourKey const keys mist be unique!`
         * //or
         * `duplicate value of yourConstant found on yourKey and yourKeyDuplicate const value strings MUST be unique!`
         *
         * @method awesome.uniqueEntries
         * @param  {Object} data    Data object or array with unique entries
         * @return {Boolean}        true
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

//libs
awesome.requireScript(`${awesome.bower}event-pubsub/event-pubsub-browser.js`);
awesome.requireScript(`${awesome.bower}js-message/js-message-vanilla.js`);
awesome.requireScript(`${awesome.bower}browser-error-classes/Errors.js`);

//default language file
awesome.requireScript(`${awesome.path}languages/default.js`);

//configs
awesome.requireScript(`${awesome.path}configs/default.js`);


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

//default stores
awesome.requireScript(`${awesome.path}stores/router/route.js`);

//default actions
awesome.requireScript(`${awesome.path}actions/router/route.js`);



//polyfills
if(!document.registerElement){
    console.log(
        `
            ####################################
            CONSIDER ADDING THIS TO YOUR <HEAD>
            TO SUPPORT MORE browsers with the
            latest polyfill for document.registerElement

            <script src='${awesome.bower}document-register-element/build/document-register-element.js'></script>
            ####################################
        `
    );
}

if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement) {
        const O = Object(this);
        const len = parseInt(O.length,10) || 0;

        if (len === 0) {
            return false;
        }

        const n = parseInt(arguments[1],10) || 0;
        let k;

        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }

        let currentElement;

        while (k < len) {
            currentElement = O[k];
            if (
                searchElement === currentElement
                || (searchElement !== searchElement && currentElement !== currentElement) //NaN !== NaN
            ){
                return true;
            }
            k++;
        }
        return false;
    };
}
