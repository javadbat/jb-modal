import HTML from './JBModal.html';
import CSS from './JBModal.scss';
import { ElementsObject } from './Types';

export class JBModalWebComponent extends HTMLElement {
    #isOpen = false;
    #id ="";
    elements!: ElementsObject;
    config = {
        autoCloseOnBackgroundClick: false
    }
    get id(){
        const id:string =this.getAttribute('id') || "";
        return this.#id || id;
    }
    set id(value:string) {
        this.#id = value;
        this.checkInitialOpenness();
    }
    get isOpen() {
        return this.#isOpen;
    }
    constructor() {
        super();
        this.initWebComponent();
    }
    connectedCallback() {
        // standard web component event that called when all of dom is binded
        this.callOnLoadEvent();
        this.initProp();
        this.callOnInitEvent();

    }
    callOnLoadEvent() {
        const event = new CustomEvent('load', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    callOnInitEvent() {
        const event = new CustomEvent('init', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    initWebComponent() {
        const shadowRoot = this.attachShadow({
            mode: 'open'
        });
        const html = `<style>${CSS}</style>` + '\n' + HTML;
        const element = document.createElement('template');
        element.innerHTML = html;
        shadowRoot.appendChild(element.content.cloneNode(true));
        this.elements = {
            componentWrapper: shadowRoot.querySelector('.jb-modal-web-component')!,
            background: shadowRoot.querySelector('.modal-background')!,
        }

    }
    registerEventListener() {
        this.elements.background.addEventListener('click', this.onBackgroundClick.bind(this));
        //TODO: remove listener on component unmount
        window.addEventListener('popstate', this.#onBrowserBack.bind(this));
    }
    initProp() {
        
        this.registerEventListener();
    }
    checkInitialOpenness() {
        //if page has modal url we open it automatically
        const location = window.location;
        if (location.hash == `#${this.id}`) {
            this.triggerUrlOpenEvent();
            this.open();
        }
    }
    triggerUrlOpenEvent() {
        //when modal open itself becuase url contain modal id
        const event = new CustomEvent('urlOpen', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    static get observedAttributes() {
        return ['isOpen', 'id'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        this.onAttributeChange(name, newValue);
    }
    onAttributeChange(name, value) {
        switch (name) {
            case 'isOpen':
                if (value == 'true') {
                    if (!this.#isOpen) {
                        this.open();
                    }
                } else {
                    if (this.#isOpen) {
                        this.close();
                    }
                }
                break;
            case 'id':
                this.id = value;
                break;
        }

    }
    onBackgroundClick() {
        this.dispatchCloseEvent('BACKGROUND_CLICK');
        if (this.config.autoCloseOnBackgroundClick) {
            this.close();
        }

    }
    dispatchCloseEvent(type) {
        //we have many ways to dispatch close event like back button on close clicked
        const event = new CustomEvent("close", { detail: { eventType: type } });
        this.dispatchEvent(event);
    }
    /**
 * @public
 * will close modal
 */
    close() {
        this.#isOpen = false;
        this.elements.componentWrapper.classList.remove('--opened')
        this.elements.componentWrapper.classList.add('--closed');
        const history = window.history;
        const location = window.location;
        if (location.hash == `#${this.id}`) {
            history.go(-1);
        }
    }
    /**
     * @public
     * will open modal
     */
    open() {
        this.#isOpen = true;
        this.elements.componentWrapper.classList.remove('--closed');
        this.elements.componentWrapper.classList.add('--opened');
        if (this.id) {
            const history = window.history;
            const location = window.location;
            if (!(location.hash == `#${this.id}`)) {
                history.pushState({ JBModal: {} }, "", `#${this.id}`);
            }
        }
    }
    #onBrowserBack(e) {
        if (this.isOpen) {
            this.dispatchCloseEvent('HISTORY_BACK_EVENT');
            if (this.config.autoCloseOnBackgroundClick) {
                this.close();
            }
        }
    }
}
const myElementNotExists = !customElements.get('jb-modal');
if (myElementNotExists) {
    window.customElements.define('jb-modal', JBModalWebComponent);
}
