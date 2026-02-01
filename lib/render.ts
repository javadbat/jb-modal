export function renderHTML(): string {
  return /* html */ `
  <div class="jb-modal-web-component --closed">
    <div class="modal-background"></div>
    <div class="modal-content-wrapper">
        <div class="modal-content">
            <slot name="header"></slot>
            <slot name="content"><slot></slot></slot>
            <slot name="footer"></slot>
        </div>
    </div>
  </div>
  `;
}