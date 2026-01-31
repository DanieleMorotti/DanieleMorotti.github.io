# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)


## [Unreleased]

## [2.2.0] - 2026-01-31

### Changed

- added the possibility to set the timer each n days in addition to specific time.


## [2.1.1] - 2026-01-24

### Fixed

- The page reload on ios due to the service worker update logic, now it should be fixed.


## [2.1.0] - 2026-01-24

### Fixed

- Added explicit abort mechanism if the user leaves the app, to avoid pending and bugged research.


## [2.0.0] - 2026-01-24

### Added

- Icon and title at the top of the app.
- Now the app remember the cards even if the user deleted them, until the user will remove from watchlist. Such that the LLM is informed about what the user already read.
- Tooltip for PWA installation on Apple devices.
- Added a warning when the user leaves the app while running a search.

### Changed

- The default language is now taken from the locale of the device.
- Small prompt update.

### Removed

- Support for notifications, since for PWA they are bugged.
- Background execution code, because it can't work for PWA.


## [1.1.0] - 2026-01-23

## Fixed

- Notifications on mobile, added an explicit consent request in Settings.
- Automate run if entering the app after the scheduled time.
- Icon for PWA saving on mobile.
- Correct card creation on mobile even if PWA minimized.


## [1.0.0] - 2026-01-23

### Added

- Added **multi language** support (Italian and English), selectable from the settings.
- **Support** for 429 kind of **errors** from google APIs, with a toast message for the user and a timeout of one minute.
- Detailed README.md.

### Fixed

- `gemini-2.5` family of models **doesn't support** structured output response with grounding search. Therefore added a different prompt and parsing for those models.

### Changed

- New **icons** without white padding and removed text from the icon.
- Changes in **UI behaviour** (if the user clicks out of the settings modal, it closes).
- Immediately **display the generated cards** if multiple searches are ongoing, instead of waiting for the entire run to be completed.
- The user **can't run** the search manually for the shows updated less than **1 hour** before.


## [0.2.0] - 2026-01-22

### Fixed

- Manifest json conflicts and icon **paths**.


## [0.1.0] - 2026-01-22

### Added

- First implementation of the webapp. The basic functionalities (add a list of shows to watch, looking for changes and archive).
- Progressive webapp support.