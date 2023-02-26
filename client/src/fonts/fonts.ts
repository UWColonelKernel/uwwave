import { createGlobalStyle } from 'styled-components'

import LatoRegular from 'fonts/lato/Lato-Regular.ttf'
import LatoLight from 'fonts/lato/Lato-Light.ttf'
import LatoBlack from 'fonts/lato/Lato-Black.ttf'

export default createGlobalStyle`
    @font-face {
        font-family: 'Lato-Regular';
        src: url(${LatoRegular}) format('truetype');
    }

    @font-face {
        font-family: 'Lato-Light';
        src: url(${LatoLight}) format('truetype');
    }

    @font-face {
        font-family: 'Lato-Black';
        src: url(${LatoBlack}) format('truetype');
    }
`
