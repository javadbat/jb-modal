const focusableSelector = [
  "a[href]",
  "area[href]",
  "button",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "summary",
  "[contenteditable='true']",
  "[tabindex]",
].join(",");

function getComposedChildren(element: Element): Element[] {
  if (element instanceof HTMLSlotElement) {
    const assignedElements = element.assignedElements({ flatten: true });
    return assignedElements.length > 0 ? assignedElements : Array.from(element.children);
  }
  if (element.shadowRoot) {
    return Array.from(element.shadowRoot.children);
  }
  return Array.from(element.children);
}

function isComposedInert(element: Element): boolean {
  let current: Element | null = element;
  while (current) {
    if (current instanceof HTMLElement && current.inert) {
      return true;
    }
    const root = current.getRootNode();
    current = current.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
  }
  return false;
}

function isFocusable(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement) || !element.matches(focusableSelector)) {
    return false;
  }
  if (element.matches(":disabled") || element.getAttribute("aria-disabled") === "true") {
    return false;
  }
  if (isComposedInert(element)) {
    return false;
  }
  const style = getComputedStyle(element);
  return element.tabIndex >= 0 && style.display !== "none" && style.visibility !== "hidden";
}

export function getFocusableElements(root: Element): HTMLElement[] {
  const focusableElements: HTMLElement[] = [];
  const visit = (element: Element) => {
    if (isFocusable(element)) {
      focusableElements.push(element);
    }
    for (const child of getComposedChildren(element)) {
      visit(child);
    }
  };
  visit(root);
  return focusableElements;
}

export function getDeepActiveElement(): HTMLElement | null {
  let activeElement: Element | null = document.activeElement;
  while (activeElement?.shadowRoot?.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement instanceof HTMLElement ? activeElement : null;
}

export function canRestoreFocus(element: HTMLElement): boolean {
  return element.isConnected && !isComposedInert(element);
}
