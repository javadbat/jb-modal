import type { JBModalWebComponent } from 'jb-modal';
import { expect } from 'storybook/test';

export function getModal(canvasElement: HTMLElement, index = 0) {
  const modal = canvasElement.querySelectorAll<JBModalWebComponent>('jb-modal')[index];
  expect(modal).toBeTruthy();
  expect(modal!.shadowRoot).toBeTruthy();
  return modal!;
}

export function getBackground(modal: JBModalWebComponent) {
  const background = modal.shadowRoot?.querySelector<HTMLDivElement>('.modal-background');
  expect(background).toBeTruthy();
  return background!;
}

export function getContentWrapper(modal: JBModalWebComponent) {
  const contentWrapper = modal.shadowRoot?.querySelector<HTMLDivElement>('.modal-content-wrapper');
  expect(contentWrapper).toBeTruthy();
  return contentWrapper!;
}

export function getContentBox(modal: JBModalWebComponent) {
  const contentBox = modal.shadowRoot?.querySelector<HTMLDivElement>('.modal-content');
  expect(contentBox).toBeTruthy();
  return contentBox!;
}

export function getJBButton(canvasElement: HTMLElement, text: string) {
  const button = Array.from(canvasElement.querySelectorAll<HTMLElement>('jb-button')).find((item) =>
    item.textContent?.includes(text)
  );
  expect(button).toBeTruthy();
  return button!;
}

export function getJBButtonNativeButton(button: HTMLElement) {
  const nativeButton = button.shadowRoot?.querySelector<HTMLButtonElement>('button');
  expect(nativeButton).toBeTruthy();
  return nativeButton!;
}
