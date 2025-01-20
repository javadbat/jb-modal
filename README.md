# jb-modal
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-modal)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-modal/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dw/jb-modal)](https://www.npmjs.com/package/jb-modal)

modal web component with features:

- customizable content
- support typescript
- auto close on background click
- you can add custom route history in browser
- back button handler to just close the modal instead of real back
- keep modal open in case of page refresh (by just provide an id)

Demo & Sample    
in github: <https://javadbat.github.io/jb-modal/>    

## using with JS frameworks

to use this component in **react** see [`jb-modal/react`](https://github.com/javadbat/jb-modal/tree/main/react);

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

## keep modal state

if you want your modal to keep open when user refresh the page or you want capture back button in mobile when modal is open you just need to provide an `id` attribute.

```html
<jb-modal is-open="true" id="Something">
</jb-modal>
```

## customize modal look

you can customize modal look by following css properties
| css variable name                  | description                                                                                   |
| -------------                      | -------------                                                                                 |
| --jb-modal-bg-color                | modal content background color default is black `#fff`                                        |
| --jb-modal-back-bg-color           | modal back background color                                                                   |
| --jb-modal-border-radius           | modal border-radius default `24px`                                                            |
| --jb-modal-border-radius-mobile    | modal border-radius on mobile default is `24px 24px 0 0`                                      |
