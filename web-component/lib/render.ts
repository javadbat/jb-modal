export function renderHTML(): string {
  return /* html */ `
  <div class="jb-modal-web-component" part="component-wrapper">
    <div class="modal-background" part="background" aria-hidden="true"></div>
    <div class="modal-content-wrapper">
        <div class="modal-content" part="content-box">
            <slot name="header"></slot>
            <slot name="content"><slot></slot></slot>
            <slot name="footer"></slot>
        </div>
    </div>
  </div>
  `;
}
