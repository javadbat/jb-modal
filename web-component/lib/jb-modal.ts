import { i18n } from "jb-core/i18n";
import { registerDefaultVariables } from "jb-core/theme";
import { canRestoreFocus, getDeepActiveElement, getFocusableElements } from "./focus.js";
import CSS from "./jb-modal.css";
import { jbModalManager } from "./jb-modal-manager.js";
import VariablesCSS from "./variables.css";
import { dictionary } from "./i18n";
import { renderHTML } from "./render";
import type { ElementsObject, JBModalCloseEventType } from "./types.js";
export * from "./jb-modal-manager.js";
export * from "./types.js";

type ModalHistoryState = {
  id: string;
  previousHash: string;
};

export class JBModalWebComponent extends HTMLElement {
  #isOpen = false;
  #internals!: ElementInternals;
  #JBID = Symbol("JBID");
  #id = "";
  #eventController?: AbortController;
  #previouslyFocusedElement: HTMLElement | null = null;
  #ownsHistoryEntry = false;
  elements!: ElementsObject;
  autoCloseOnBackgroundClick = false;
  autoCloseOnEscape = true;

  get JBID() {
    return this.#JBID;
  }

  get id() {
    return this.#id || this.getAttribute("id") || "";
  }

  set id(value: string) {
    this.#id = value;
    if (this.isConnected) {
      this.checkInitialOpenness();
    }
  }

  get isOpen() {
    return this.#isOpen;
  }

  constructor() {
    super();
    this.initWebComponent();
  }

  connectedCallback() {
    if (!this.#isOpen) {
      // A11y: set inert after construction because it reflects an attribute;
      // custom-element constructors must not add attributes to their host.
      this.inert = true;
    }
    this.callOnLoadEvent();
    this.initProp();
    this.checkInitialOpenness();
    this.callOnInitEvent();
  }

  disconnectedCallback() {
    this.#eventController?.abort();
    if (this.#isOpen) {
      this.#closeWithoutHistoryNavigation();
    }
  }

  callOnLoadEvent() {
    this.dispatchEvent(new CustomEvent("load", { bubbles: true, composed: true }));
  }

  callOnInitEvent() {
    this.dispatchEvent(new CustomEvent("init", { bubbles: true, composed: true }));
  }

  initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: "open",
      clonable: true,
      serializable: true,
    });
    this.#internals = this.attachInternals();
    this.#internals.role = "dialog";
    this.#internals.ariaModal = "true";
    this.#internals.ariaHidden = "true";
    registerDefaultVariables();
    const html = `<style>${CSS} ${VariablesCSS}</style>\n${renderHTML()}`;
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      componentWrapper: shadowRoot.querySelector(".jb-modal-web-component")!,
      background: shadowRoot.querySelector(".modal-background")!,
      content: shadowRoot.querySelector(".modal-content")!,
      headerSlot: shadowRoot.querySelector('slot[name="header"]')!,
    };
    this.#updateAccessibleName();
  }

  registerEventListener() {
    this.#eventController?.abort();
    this.#eventController = new AbortController();
    const { signal } = this.#eventController;
    this.elements.background.addEventListener("click", this.#onBackgroundClick, { signal });
    this.elements.headerSlot.addEventListener("slotchange", this.#updateAccessibleName, { signal });
    document.addEventListener("keydown", this.#onDocumentKeyDown, { capture: true, signal });
    document.addEventListener("focusin", this.#onDocumentFocusIn, { capture: true, signal });
    window.addEventListener("popstate", this.#onBrowserBack, { signal });
  }

  initProp() {
    this.registerEventListener();
    this.#updateAccessibleName();
    this.#internals.ariaDescription = this.getAttribute("description");
  }

  checkInitialOpenness() {
    if (this.id && window.location.hash === `#${this.id}` && !this.#isOpen) {
      this.triggerUrlOpenEvent();
      this.open();
    }
  }

  triggerUrlOpenEvent() {
    this.dispatchEvent(new CustomEvent("urlOpen", { bubbles: true, composed: true }));
  }

  static get observedAttributes() {
    return ["is-open", "id", "label", "description"];
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    this.onAttributeChange(name, newValue);
  }

  onAttributeChange(name: string, value: string | null) {
    switch (name) {
      case "is-open":
        if (value === "true") {
          this.open();
        } else {
          this.close();
        }
        break;
      case "label":
        this.#updateAccessibleName();
        break;
      case "description":
        this.#internals.ariaDescription = value;
        break;
      case "id":
        this.id = value ?? "";
        break;
    }
  }

  #updateAccessibleName = () => {
    const explicitLabel = this.getAttribute("label")?.trim();
    const headerText = this.elements?.headerSlot
      .assignedElements({ flatten: true })
      .map(element => element.textContent?.trim())
      .filter(Boolean)
      .join(" ");
    this.#internals.ariaLabel = explicitLabel || headerText || dictionary.get(i18n, "dialog");
  };

  #onBackgroundClick = () => {
    if (!this.#isOpen || !jbModalManager.isTopmostModal(this)) {
      return;
    }
    const closeAllowed = this.dispatchCloseEvent("BACKGROUND_CLICK");
    if (closeAllowed && this.autoCloseOnBackgroundClick) {
      this.close();
    }
  };

  dispatchCloseEvent(type: JBModalCloseEventType): boolean {
    return this.dispatchEvent(
      new CustomEvent("close", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { eventType: type },
      }),
    );
  }

  /** @public Closes the modal. */
  close() {
    if (!this.#isOpen) {
      return;
    }
    const hashMatches = Boolean(this.id) && window.location.hash === `#${this.id}`;
    const ownsHistoryEntry = this.#ownsHistoryEntry;
    this.#closeWithoutHistoryNavigation();

    if (!hashMatches) {
      return;
    }
    if (ownsHistoryEntry) {
      window.history.back();
    } else {
      // A directly loaded #modalId has no component-owned entry to go back to, so remove only its hash.
      window.history.replaceState(this.getHistoryStateWithoutThisModal(), "", this.getUrlWithoutHash());
    }
  }

  /** @public Opens the modal. */
  open() {
    if (this.#isOpen) {
      return;
    }
    // A11y: remember the opener so focus can return to the user's previous context on close.
    this.#previouslyFocusedElement = getDeepActiveElement();
    this.#isOpen = true;
    this.inert = false;
    this.#internals.ariaHidden = "false";
    this.#internals.states.add("open");
    const stackLayer = jbModalManager.register(this);
    this.style.setProperty("--stack-index", String(stackLayer));

    if (this.id && window.location.hash !== `#${this.id}`) {
      const previousHash = window.location.hash;
      window.history.pushState(
        {
          ...window.history.state,
          JBModal: {
            id: this.id,
            previousHash,
          } satisfies ModalHistoryState,
        },
        "",
        `#${this.id}`,
      );
      this.#ownsHistoryEntry = true;
    } else {
      this.#ownsHistoryEntry = false;
    }

    queueMicrotask(() => {
      if (this.#isOpen && jbModalManager.isTopmostModal(this)) {
        this.#focusInitialElement();
      }
    });
  }

  #focusInitialElement() {
    const focusableElements = getFocusableElements(this);
    const autofocusElement = focusableElements.find(element => element.hasAttribute("autofocus"));
    // A11y: autofocus is honored first; otherwise start at the first control or the dialog container.
    (autofocusElement ?? focusableElements[0] ?? this.elements.content).focus({ preventScroll: true });
  }

  #closeWithoutHistoryNavigation() {
    const wasTopmost = jbModalManager.isTopmostModal(this);
    jbModalManager.unregister(this);
    this.#isOpen = false;
    this.#ownsHistoryEntry = false;
    this.#internals.ariaHidden = "true";
    this.#internals.states.delete("open");
    // A11y: inert prevents focus from re-entering content after the modal becomes visually hidden.
    this.inert = true;
    if (wasTopmost) {
      this.#restorePreviousFocus();
    } else {
      this.#previouslyFocusedElement = null;
    }
  }

  #restorePreviousFocus() {
    const focusTarget = this.#previouslyFocusedElement;
    this.#previouslyFocusedElement = null;
    queueMicrotask(() => {
      if (focusTarget && canRestoreFocus(focusTarget)) {
        // A11y: restoring focus lets keyboard users continue from the control that opened the modal.
        focusTarget.focus({ preventScroll: true });
      }
    });
  }

  private getUrlWithoutHash() {
    return `${window.location.pathname}${window.location.search}`;
  }

  private getHistoryStateWithoutThisModal() {
    const state = { ...(window.history.state ?? {}) };
    if (state.JBModal?.id === this.id) {
      delete state.JBModal;
    }
    return state;
  }

  #onDocumentKeyDown = (event: KeyboardEvent) => {
    if (!this.#isOpen || !jbModalManager.isTopmostModal(this)) {
      return;
    }
    // A11y: only the topmost modal handles Escape and Tab so nested dialogs do not compete.
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      const closeAllowed = this.dispatchCloseEvent("ESCAPE_KEY");
      if (closeAllowed && this.autoCloseOnEscape) {
        this.close();
      }
      return;
    }
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(this);
    if (focusableElements.length === 0) {
      event.preventDefault();
      this.elements.content.focus({ preventScroll: true });
      return;
    }
    const activeElement = getDeepActiveElement();
    const activeIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
    const movingBeforeFirst = event.shiftKey && activeIndex <= 0;
    const movingAfterLast = !event.shiftKey && activeIndex === focusableElements.length - 1;
    const focusIsOutside = activeIndex === -1;
    if (movingBeforeFirst || movingAfterLast || focusIsOutside) {
      event.preventDefault();
      const nextElement = event.shiftKey ? focusableElements[focusableElements.length - 1] : focusableElements[0];
      nextElement?.focus({ preventScroll: true });
    }
  };

  #onDocumentFocusIn = (event: FocusEvent) => {
    if (!this.#isOpen || !jbModalManager.isTopmostModal(this) || event.composedPath().includes(this)) {
      return;
    }
    // A11y: redirect programmatic focus that escapes the active modal back into its focus scope.
    this.#focusInitialElement();
  };

  #onBrowserBack = () => {
    if (!this.#isOpen || !this.id || !jbModalManager.isTopmostModal(this) || window.location.hash === `#${this.id}`) {
      return;
    }
    const closeAllowed = this.dispatchCloseEvent("HISTORY_BACK_EVENT");
    if (closeAllowed) {
      // The browser already navigated, so closing here must not navigate history a second time.
      this.#closeWithoutHistoryNavigation();
      return;
    }

    // A canceled close must restore the modal's history entry to keep its visible state and URL aligned.
    const previousHash = window.location.hash;
    window.history.pushState(
      {
        ...window.history.state,
        JBModal: { id: this.id, previousHash } satisfies ModalHistoryState,
      },
      "",
      `#${this.id}`,
    );
    this.#ownsHistoryEntry = true;
  };
}

if (!customElements.get("jb-modal")) {
  window.customElements.define("jb-modal", JBModalWebComponent);
}
