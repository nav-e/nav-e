# gn-notification

GreenNav polymer element for user dialogs and notifications.

## Project Idea

The idea is to create a smart notification system showing directions of the calculated route as well as every other useful information about current position. Furthermore this module should be open enough to handle data / informations added in future.

This project is in a very early stage and WIP!

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