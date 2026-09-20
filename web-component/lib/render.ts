export function renderHTML(): string {
  return /* html */ `
  <div class="jb-modal-web-component" part="root">
    <div class="modal-background" part="background" aria-hidden="true"></div>
    <div class="modal-content">
        <div class="content-wrapper" part="content" tabindex="-1">
            <div class="drag-handle" part="drag-handle" aria-hidden="true"><span></span></div>
            <slot name="header"></slot>
            <slot name="content"><slot></slot></slot>
            <slot name="footer"></slot>
        </div>
    </div>
  </div>
  `;
}
