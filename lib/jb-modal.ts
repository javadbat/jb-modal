import CSS from "./jb-modal.scss";
import { renderHTML } from "./render";
import { ElementsObject } from "./types.js";
import {registerDefaultVariables} from "jb-core/theme";
export * from "./types.js";

export class JBModalWebComponent extends HTMLElement {
  #isOpen = false;
  #internals: ElementInternals;
  #id = "";
  elements!: ElementsObject;
  config = {
    autoCloseOnBackgroundClick: false,
  };
  get id() {
    const id: string = this.getAttribute("id") || "";
    return this.#id || id;
  }
  set id(value: string) {
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
    // standard web component event that called when all of dom is bounded
    this.callOnLoadEvent();
    this.initProp();
    this.callOnInitEvent();
  }
  callOnLoadEvent() {
    const event = new CustomEvent("load", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  callOnInitEvent() {
    const event = new CustomEvent("init", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: "open",
    });
    this.#internals = this.attachInternals();
    //indicate that this component is a modal
    this.#internals.ariaModal = "true";
    registerDefaultVariables();
    const html = `<style>${CSS}</style>` + "\n" + renderHTML();
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      componentWrapper: shadowRoot.querySelector(".jb-modal-web-component")!,
      background: shadowRoot.querySelector(".modal-background")!,
    };
  }
  registerEventListener() {
    this.elements.background.addEventListener(
      "click",
      this.onBackgroundClick.bind(this)
    );
    //TODO: remove listener on component unmount
    window.addEventListener("popstate", this.#onBrowserBack.bind(this));
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
    //when modal open itself because url contain modal id
    const event = new CustomEvent("urlOpen", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  static get observedAttributes() {
    return ["is-open", "id"];
  }
  attributeChangedCallback(name:string, oldValue:string, newValue:string) {
    // do something when an attribute has changed
    this.onAttributeChange(name, newValue);
  }
  onAttributeChange(name:string, value:string) {
    switch (name) {
      case "is-open":
        if (value == "true") {
          if (!this.#isOpen) {
            this.open();
          }
        } else {
          if (this.#isOpen) {
            this.close();
          }
        }
        break;
      case "id":
        this.id = value;
        break;
    }
  }
  onBackgroundClick() {
    this.dispatchCloseEvent("BACKGROUND_CLICK");
    if (this.config.autoCloseOnBackgroundClick) {
      this.close();
    }
  }
  dispatchCloseEvent(type:"BACKGROUND_CLICK"| "HISTORY_BACK_EVENT" | "CLOSE_BUTTON_CLICK") {
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
    this.#internals.ariaHidden = "true"
    this.elements.componentWrapper.classList.remove("--opened");
    this.elements.componentWrapper.classList.add("--closed");
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
    this.#internals.ariaHidden = "false"
    this.elements.componentWrapper.classList.remove("--closed");
    this.elements.componentWrapper.classList.add("--opened");
    if (this.id) {
      const history = window.history;
      const location = window.location;
      if (!(location.hash == `#${this.id}`)) {
        history.pushState({ JBModal: {} }, "", `#${this.id}`);
      }
    }
  }
  #onBrowserBack() {
    if (this.isOpen) {
      this.dispatchCloseEvent("HISTORY_BACK_EVENT");
      if (this.config.autoCloseOnBackgroundClick) {
        this.close();
      }
    }
  }
}
const myElementNotExists = !customElements.get("jb-modal");
if (myElementNotExists) {
  window.customElements.define("jb-modal", JBModalWebComponent);
}
