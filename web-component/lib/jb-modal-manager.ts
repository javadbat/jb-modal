import type { JBModalWebComponent } from "./jb-modal.js";

/**
 * Keeps the logical order of open modals in one place.
 * Focus, keyboard, and history behavior remain the responsibility of each modal.
 */
export class JBModalManager {
  readonly #openModals: JBModalWebComponent[] = [];
  #nextStackLayer = 0;

  register(modal: JBModalWebComponent): number {
    this.unregister(modal);
    this.#openModals.push(modal);
    this.#nextStackLayer += 1;
    return this.#nextStackLayer;
  }

  unregister(modal: JBModalWebComponent): void {
    const index = this.#openModals.indexOf(modal);
    if (index !== -1) {
      this.#openModals.splice(index, 1);
    }
    if (this.#openModals.length === 0) {
      this.#nextStackLayer = 0;
    }
  }

  getTopmostModal(): JBModalWebComponent | undefined {
    return this.#openModals[this.#openModals.length - 1];
  }

  isTopmostModal(modal: JBModalWebComponent): boolean {
    return this.getTopmostModal() === modal;
  }
}

export const jbModalManager = new JBModalManager();
