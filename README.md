# jb-modal
modal web component with features:

- customizable content
- support typescript
- auto close on background click
- you can add custom route history in browser so back button can close modal and refresh (when modal is open) is open modal again

## install

```cmd
npm i jb-modal
```

## usage
```html
<jb-modal is-open="true">
    <div slot="content">modal content</div>
</jb-modal>
```
## auto close on background click
```js
document.querySelector('jb-modal').config.autoCloseOnBackgroundClick = true;
```
## customize modal look

you can customize modal look by following css properties
| css variable name                  | description                                                                                   |
| -------------                      | -------------                                                                                 |
| --jb-modal-bg-color                | modal background color default is black `#fff`                                                |
| --jb-modal-border-radius           | modal border-radius default `24px`                                                            |
| --jb-modal-border-radius-mobile    | modal border-radius on mobile default is `24px 24px 0 0`                                      |