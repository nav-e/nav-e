import {
  green50, green200, green300, green700, green900,
  grey100, grey300, grey400, grey500,
  orange500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {
  fade,
  // lighten
} from 'material-ui/utils/colorManipulator';


export default {
  fontFamily: 'Roboto, Noto, sans-serif',
  palette: {
    primary1Color: green700,
    primary2Color: green900,
    primary3Color: grey400,
    accent1Color: orange500,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: green700,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },

  toggle: {
    thumbOnColor: green300,
    thumbRequiredColor: green300,
    trackOnColor: green700,
    trackRequiredColor: green700,
  },

  toolbar: {
    backgroundColor: green900,
    color: 'white',
    iconColor: green50,
    hoverColor: green200,
    menuHoverColor: fade(green200, 0.1),
    separatorColor: green700,
    height: '64px',
  },

  // paper: {
  //   backgroundColor: lighten(green50, 0.9)
  // }
};
