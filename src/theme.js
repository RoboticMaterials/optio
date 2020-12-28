import React from "react";
import { ThemeProvider } from "styled-components";
import { hexToRGBA, LightenDarkenColor, RGB_Linear_Blend, RGB_Linear_Shade, RGB_Log_Blend, RGB_Log_Shade } from './methods/utils/color_utils';
import objectsReducer from "./redux/reducers/objects_reducer";

export const size = {
    tiny: '0px',
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px'
}

const dark = {
    primary: '#000000',  // Black
    secondary: '#27272b',
    tertiary: '#313236',
    // quaternary: '#4f5063',
    quaternary: '#5a5a63',
    quinary: '#6c6e78',
    senary: '#a6a7ba',
    septenary: '#e9e9f2',
    octonary: '#FFFFFF',  // White
}

const light = {
    primary: '#FFFFFF',  // White
    secondary: '#E6E6E6',
    tertiary: '#C8C8C8',
    quaternary: '#A8A8A8',  // light light grey
    quinary: '#808080',   // light grey
    senary: '#7e7e7e',    // charcoal
    septenary: '#545454', //dark dark grey
    octonary: '#000000',  // Black
}

export const theme = {
    main: {
        bg: dark,
        fg: {
            primary: '#798fd9',
            secondary: '#FF4B4B', // RM RED
            tertiary: '',
            quaternary: '',
            quinary: '',
            senary: '',
            septenary: '',
            octonary: '',
            nonary: '',
            denary: '',
            red: '#FF4B4B',   // RM RED

        },
        error: {
            borderColor: '#FF4B4B',
        },
        good: '#52B853',
        okay: '#ffa200',
        bad: '#FF4B4B',
        disabled: '#808080',           // light grey
        radioButton: {
            active: '#FF4B4B',          // RM RED
            inactive: '#808080',        // light grey
            hover: RGB_Linear_Shade(.2, hexToRGBA('#FF4B4B')),    // lighter RM RED
            textColor: "#FFFFFF",        // white
            fontWeight: 500,
            borderColor: '#A8A8A8',      // light light grey
        },
        hoverHighlightPer: 0.4,
        basicButton: {
            backgroundColor: {
                active: '#FF4B4B',             // RM RED
                disabled: '#808080',           // light grey
            },
            textColor: {
                active: "#FFFFFF",
            }
        },

        font: {
            primary: 'Montserrat'
        },
        fontSize: {

            sz6: "0.65rem",
            sz5: "0.75rem",
            sz4: "0.85rem",
            sz3: "1.2rem",
            sz2: "1.5rem",
            sz7: "2.0rem",
            sz1: "2.5rem",
            sz8: "1.4rem"
        },
        fontWeight: {
            bold: '700',
            normal: '100',
        },

        // minWidth: {
        //   tiny: `(min-width: ${size.tiny})`,
        //   mobileS: `(min-width: ${size.mobileS})`,
        //   mobileM: `(min-width: ${size.mobileM})`,
        //   mobileL: `(min-width: ${size.mobileL})`,
        //   tablet: `(min-width: ${size.tablet})`,
        //   laptop: `(min-width: ${size.laptop})`,
        //   laptopL: `(min-width: ${size.laptopL})`,
        //   desktop: `(min-width: ${size.desktop})`,
        //   desktopL: `(min-width: ${size.desktop})`
        // },
        widthBreakpoint: {
            tiny: `${size.tiny}`,
            mobileS: `${size.mobileS}`,
            mobileM: `${size.mobileM}`,
            mobileL: `${size.mobileL}`,
            tablet: `${size.tablet}`,
            laptop: `${size.laptop}`,
            laptopL: `${size.laptopL}`,
            desktop: `${size.desktop}`,
            desktopL: `${size.desktop}`
        },

        tree: {
            bg: light,
            normal: {
                fg: '#7de7ff',
                mg: '#bff3ff',
                bg: '#edf5f7'
            },
            goal: {
                fg: '#e399ff',
                mg: '#ecbdfc',
                bg: '#ede4f0',
            },
            warning: {
                fg: '#ffc04b',
                bg: '#f5eee9',
            },
            selected: {
                fg: '#FF4B4B',
                bg: '#ffe8e8',
            },
            alternate: {
                fg: '#e0e0e0',
                bg: '#f5f5f5',
            },
            disabled: {
                fg: '',
                bg: '',
            }
        },

        schema: {
            locations: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 143, 217, 0.95) 0%, rgba(125, 89, 183, 0.95) 100%)',
                solid: '#798fd9'
            },
            dashboards: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(255, 214, 0, 0.95) 0%, rgba(255, 138, 0, 0.95) 100%)',
                solid: '#5294ff'
            },
            objects: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(255, 214, 0, 0.95) 0%, rgba(255, 138, 0, 0.95) 100%)',
                solid: '#ffb62e'
            },
            processes: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(255, 214, 0, 0.95) 0%, rgba(255, 138, 0, 0.95) 100%)',
                solid: '#ffb62e'
            },
            tasks: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 217, 155, 0.95) 0%, rgba(0, 162, 132, 0.95) 100%)',
                solid: '#79d99b'
            },
            routes: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 217, 155, 0.95) 0%, rgba(0, 162, 132, 0.95) 100%)',
                solid: '#79d99b',
                iconName: "fas fa-route"
            },
            all: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 217, 155, 0.95) 0%, rgba(0, 162, 132, 0.95) 100%)',
                solid: '#1ae8a0'
            },
            lots: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(38, 212, 53) 0%, rgba(80, 250, 95, 0.95) 100%)',
                solid: '#805858',
                iconName: "fas fa-play"
            },
            kick_off: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(197, 155, 255) 0%, rgba(173, 115, 255, 0.95) 100%)',
                solid: '#c59bff',
                iconName: "fas fa-play"
            },
            finish: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(197, 155, 255) 0%, rgba(173, 115, 255, 0.95) 100%)',
                solid: '#fc5e03',
                iconName: "fas fa-flag-checkered"
            },
            error: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 217, 155, 0.95) 0%, rgba(0, 162, 132, 0.95) 100%)',
                solid: '#ff1900'
            },
            operations: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 217, 155, 0.95) 0%, rgba(0, 162, 132, 0.95) 100%)',
                solid: '#e81a69',
                iconName: "fas fa-sticky-note"
            },
            report: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 217, 155, 0.95) 0%, rgba(0, 162, 132, 0.95) 100%)',
                solid: '#e81a69',
                iconName: "fas fa-sticky-note"
            },
            devices: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(255, 75, 75, 0.95) 0%, rgba(255, 61, 61, 0.95) 100%)',
                solid: '#e36868'
            },
            scheduler: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(30, 156, 215, 0.95) 0%, rgba(0, 91, 151, 0.95) 100%)',
                solid: '#1e9cd7'
            },
            taskQueue: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(197, 155, 255) 0%, rgba(173, 115, 255, 0.95) 100%)',
                solid: '#c59bff'
            },
            settings: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(197, 155, 255) 0%, rgba(173, 115, 255, 0.95) 100%)',
                solid: '#c59bff'
            },
            delete: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(255, 75, 75, 0.95) 0%, rgba(255, 61, 61, 0.95) 100%)',
                solid: '#e36868'
            },
        }
    },
    funky: {

    },



};


export default theme;
