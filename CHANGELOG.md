# Changelog

## Unreleased

### Added

- Added standard styling documentation, a live style gallery, and reusable custom theme recipes.
- Added accessible dialog naming through `label`, header text fallback, and optional `description`.
- Added initial focus placement, topmost-modal focus trapping, Escape-key close requests, opener focus restoration, and `inert` handling for closed modals.
- Added `JBModalManager` for multiple and nested modal stacking, including topmost keyboard and browser-history coordination.
- Added the read-only `JBID` symbol for runtime modal instance identity, matching `jb-popover`.
- Added reduced-motion handling for the built-in mobile animation.
- Added cancelable, bubbling, composed `close` events with the new `ESCAPE_KEY` event type.

### Changed

- Standardized theme recipes on `jb-modal.<theme>-style` and public modal parts without redundant component hook classes.
- Updated themed modal actions to consume the shared button recipes, including readable light text close buttons.
- Changed `autoCloseOnBackgroundClick` and `autoCloseOnEscape` to direct web-component properties and React props instead of fields on a `config` object.
- Changed browser Back handling to close only the topmost history-linked modal and restore the parent modal hash for nested modal flows.
- Changed modal opening and closing to move focus into the dialog and restore it to the opener when possible.

### Fixed

- Fixed custom-element construction in React by applying the reflected `inert` state after the element is connected instead of from its constructor.
