# jb-modal
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-modal)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-modal/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dw/jb-modal)](https://www.npmjs.com/package/jb-modal)

modal web component with features:

- framework free so you can use it anywhere
- customizable content & style
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
## events

```js
//when web-component load and you can access modal logic
document.querySelector('jb-modal').addEventListener("load",(e)=>{/*your function*/});
// when modal load and initiated completely 
document.querySelector('jb-modal').addEventListener("init",(e)=>{/*your function*/});
// when page refresh and modal open by default because of url 
document.querySelector('jb-modal').addEventListener("urlOpen",(e)=>{/*your function*/});
// when modal closed
document.querySelector('jb-modal').addEventListener("close",(e)=>{
    // could be "BACKGROUND_CLICK"  "HISTORY_BACK_EVENT" "CLOSE_BUTTON_CLICK"
    const closeType = e.detail.eventType 
    /*your function*/
});

```

## customize modal look

you can customize modal look by following css properties
| css variable name                  | description                                                                                   |
| -------------                      | -------------                                                                                 |
| --jb-modal-bg-color                | modal content background color default is black `#fff`                                        |
| --jb-modal-back-bg-color           | modal back background color                                                                   |
| --jb-modal-border-radius           | modal border-radius default `24px`                                                            |

## Other Related Docs:

- see [`jb-modal/react`](https://github.com/javadbat/jb-modal/tree/main/react); if you want to use this component in react

- see [All JB Design system Component List](https://javadbat.github.io/design-system/

- use [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) if you want to contribute in this component.