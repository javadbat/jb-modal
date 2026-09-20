import type { JBModalWebComponent } from "./jb-modal.js";

/** Owns bottom-sheet touch handling, animation, and gesture lifecycle. */
export class GestureController {
  #component: JBModalWebComponent;
  #requestClose: () => boolean;
  #listeners?: AbortController;
  #gestureListeners?: AbortController;
  #content: HTMLDivElement;
  #backdrop: HTMLDivElement;
  #handle: HTMLDivElement;
  #reducedMotion: MediaQueryList;
  #finishClose: () => void;
  #height = 1;
  #originOffset = 0;
  #generation = 0;

  constructor(component: JBModalWebComponent, requestClose: () => boolean, finishClose: () => void) {
    this.#component = component;
    this.#requestClose = requestClose;
    this.#finishClose = finishClose;
    this.#content = component.elements.content.wrapper;
    this.#backdrop = component.elements.background;
    this.#handle = component.elements.bottomSheetHandle;
    this.#reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  }

  connect() {
    this.disconnect();
    this.#listeners = new AbortController();
    const signal = this.#listeners.signal;
    const component = this.#component.elements.componentWrapper;
    component.addEventListener("touchstart", this.#onTouchStart, { passive: true, signal });
  }

  disconnect() {
    this.#listeners?.abort();
    this.reset();
  }

  get isClosing() {
    return this.#closing;
  }
  close() {
    if (this.#closing) return;
    if (this.#settling) this.#interrupt();
    this.#settle(true);
    this.#component.close();
  }
  viewportChanged() {
    const closing = this.#closing;
    this.reset();
    if (closing) this.#finishClose();
  }

  #gesture: { id: number; x: number; y: number; lastY: number; time: number; velocity: number; active: boolean } | null = null;
  #dragOffset = 0;
  #animations: Animation[] = [];
  #settling = false;
  #closing = false;
  #endGesture() {
    this.#gestureListeners?.abort();
    this.#gestureListeners = undefined;
    this.#gesture = null;
  }

  /**
   * Put everything in Normal (cancel dragging animation and popover back to position)
   */
  reset() {
    this.#endGesture();
    this.#generation++;
    this.#animations.forEach(animation => {
      animation.cancel();
    });
    this.#animations = [];
    this.#settling = false;
    this.#closing = false;
    this.#dragOffset = 0;
    this.#originOffset = 0;
    this.#content.style.removeProperty("translate");
    this.#content.style.removeProperty("opacity");
    this.#backdrop.style.removeProperty("opacity");
    this.#backdrop.style.removeProperty("transition");
  }
  #onTouchStart = (event: TouchEvent) => {
    if (this.#closing) return;
    if (event.touches.length !== 1) {
      this.reset();
      return;
    }
    if (!this.#component.isOpen || !this.#component.swipeToClose || !this.#component.isBottomSheet || event.defaultPrevented) return;
    const path = event.composedPath();
    const handle = this.#handle;
    const content = this.#content;
    // Only touches inside slotted content need the content-drag opt-in.
    if (path.includes(content) && !path.includes(handle) && event.target !== content) {
      if (!this.#component.dragFromContent) return;
      for (const node of path) {
        if (node === this.#content) break;
        if (!(node instanceof Element)) continue;
        if (node.matches('input, textarea, select, button, a, [contenteditable]:not([contenteditable="false"]), [data-jb-popover-no-drag]') || (node.constructor as any)?.formAssociated) return;
        if (node.scrollHeight > node.clientHeight && node.scrollTop > 0) return;
      }
    }
    if (this.#settling) this.#interrupt();
    this.#height = Math.max(1, this.#content.offsetHeight);
    this.#originOffset = this.#dragOffset;
    this.#endGesture();
    this.#gestureListeners = new AbortController();
    const signal = this.#gestureListeners.signal;
    const component = this.#component.elements.componentWrapper;
    component.addEventListener("touchmove", this.#onTouchMove, { passive: false, signal });
    component.addEventListener("touchend", this.#onTouchEnd, { passive: true, signal });
    component.addEventListener("touchcancel", this.#onTouchEnd, { passive: true, signal });
    const observer = new ResizeObserver(() => {
      this.#height = Math.max(1, this.#content.offsetHeight);
    });
    observer.observe(this.#content);
    signal.addEventListener("abort", () => observer.disconnect(), { once: true });
    const touch = event.touches[0];
    this.#gesture = { id: touch.identifier, x: touch.clientX, y: touch.clientY, lastY: touch.clientY, time: event.timeStamp, velocity: 0, active: false };
  };
  #onTouchMove = (event: TouchEvent) => {
    const gesture = this.#gesture;
    if (!gesture) return;
    if (!this.#component.swipeToClose || !this.#component.isBottomSheet || event.touches.length !== 1) {
      this.reset();
      return;
    }
    const touch = Array.from(event.touches).find(touch => touch.identifier === gesture.id);
    if (!touch) return;
    const dy = touch.clientY - gesture.y;
    const dx = touch.clientX - gesture.x;
    if (!gesture.active) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (dy <= 0 || Math.abs(dx) >= dy || event.defaultPrevented) {
        this.#endGesture();
        if (this.#dragOffset > 0) this.#settle(false);
        return;
      }
      gesture.active = true;
    }
    if (!event.cancelable) {
      this.reset();
      return;
    }
    event.preventDefault();
    const elapsed = event.timeStamp - gesture.time;
    if (elapsed > 0) gesture.velocity = (touch.clientY - gesture.lastY) / elapsed;
    gesture.lastY = touch.clientY;
    gesture.time = event.timeStamp;
    this.#dragOffset = Math.max(0, this.#originOffset + dy);
    this.#content.style.translate = `0 ${this.#dragOffset}px`;
    const height = this.#height;
    // Finger tracking must bypass the backdrop's opening transition.
    this.#backdrop.style.transition = "none";
    this.#backdrop.style.opacity = `${Math.max(0, 1 - this.#dragOffset / Math.max(height, 1))}`;
  };
  #onTouchEnd = (event: TouchEvent) => {
    const gesture = this.#gesture;
    if (!gesture || !Array.from(event.changedTouches).some(touch => touch.identifier === gesture.id)) return;
    this.#endGesture();
    if (!gesture.active) {
      if (this.#dragOffset > 0) this.#settle(false);
      return;
    }
    // detect fast short swipe
    const flick = event.timeStamp - gesture.time < 100 && gesture.velocity > 0.5 && this.#dragOffset > 24;

    const dismiss = event.type !== "touchcancel" && (this.#dragOffset > this.#height * 0.3 || flick);
    if (dismiss && this.#requestClose()){
      this.close();
    } 
    else if (this.#component.isOpen && !this.#settling) this.#settle(false);
  };
  #interrupt() {
    const offset = Number.parseFloat(getComputedStyle(this.#content).translate.split(" ")[1]) || 0;
    const opacity = getComputedStyle(this.#backdrop).opacity;
    this.reset();
    this.#dragOffset = offset;
    this.#content.style.translate = `0 ${offset}px`;
    this.#backdrop.style.transition = "none";
    this.#backdrop.style.opacity = opacity;
  }
  /**
   * Run animation and settle our doms to their final destination if closing lead to closed state if not back to first position
   */
  #settle(closing: boolean) {
    this.#endGesture();
    this.#settling = true;
    this.#closing = closing;
    const content = this.#content;
    const bottomSheet = this.#component.isBottomSheet;
    const viewport = window.visualViewport;
    const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
    const destination = closing ? Math.max(content.offsetHeight, bottom - content.getBoundingClientRect().top + this.#dragOffset) : 0;
    const duration = this.#reducedMotion.matches ? 0 : closing ? 220 : 320;
    const options = { duration, easing: closing ? "cubic-bezier(.2,0,.2,1)" : "cubic-bezier(.2,.9,.25,1)", fill: "forwards" as FillMode };
    const frames = bottomSheet
      ? [{ translate: `0 ${this.#dragOffset}px` }, { translate: `0 ${destination}px` }]
      : [{ opacity: getComputedStyle(content).opacity }, { opacity: closing ? 0 : 1 }];
    this.#animations = [content.animate(frames, options)];
    if (this.#component.isBottomSheet) {
      this.#animations.push(this.#backdrop.animate([{ opacity: getComputedStyle(this.#backdrop).opacity }, { opacity: closing ? 0 : 1 }], options));
    }
    const generation = this.#generation;
    Promise.all(this.#animations.map(animation => animation.finished))
      .then(() => {
        if (generation !== this.#generation) return;
        this.reset();
        if (closing) this.#finishClose();
      })
      .catch(() => {
        /* Reopening, interruption, resize, or disconnect cancels settling. */
      });
  }
}
