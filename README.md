# gn-notification

GreenNav polymer element for user dialogs and notifications.

## Project Idea

The idea is to create a smart notification system showing directions of the calculated route as well as every other useful information about current position. Furthermore this module should be open enough to handle data / informations added in future.

This project is in a very early stage and WIP!

## Setup Instructions

Clone the project (or download and extract zip).

```
git clone https://github.com/tom3012/gn-notification.git
```

### Dependencies

Element dependencies are managed via [Bower](http://bower.io/). You can install that (globally) via:

```
npm install -g bower
```

Move in the project folder and download the element's dependencies:

```
bower install
```

### Documentation and Demo

Use [Polyserve](https://github.com/PolymerLabs/polyserve) to play with gn-notification, read the documentation and watch the demo. You can install it via:

```
npm install -g polyserve
```

And you can run it via:

```
polyserve
```

Once running, you can preview your element at `http://localhost:8080/components/gn-notification/`, where `gn-notification` is the name of the directory containing it.

### Short example

```html
<paper-button raised onclick="hint.open()">hint notification</paper-button>

<gn-notification  id="hint" title="Hint">This is a hint message.</gn-notification>
```

Example with different color settings for _warning_ and _error_ messages:

```html
<paper-button raised onclick="warning.open()">warning notification</paper-button>
<paper-button raised onclick="error.open()">error notification</paper-button>

<gn-notification  id="warning" warning title="Warning">
  Oh, oh... there is a warning message.
</gn-notification>

<gn-notification  id="error" error title="Error">
  An error has occurred
</gn-notification>
```

## TODO

### In Progress

- Show icons by message type
- Possibility to set position of messages
- Prettier Design

### Soon

- [ ] Show debug messages from other modules
- [ ] Show directions (Webapp)
- [ ] Show useful information about traffic (Webapp)
- [ ] Show useful information about current position (Webapp)

### Maybe in Future

- [ ] Add voice output (?)
- [ ] Implement Google Authentificaiton
