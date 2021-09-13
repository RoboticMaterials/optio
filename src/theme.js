import { hexToRGBA, RGB_Linear_Shade } from './methods/utils/color_utils';

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


const light = {
    primary: '#FFFFFF',  // White
    secondary: '#f0f0f5',
    tertiary: '#dedfe3',
    quaternary: '#b8b9bf',  // light light grey
    quinary: '#79797d',   // light grey
    senary: '#7e7e7e',    // charcoal
    septenary: '#545454', //dark dark grey
    octonary: '#363636',  // Black
}

export const theme = {
    main: {
        bg: light,
        fg: {
            primary: '#2787e1',
            secondary: '#F92644', // RM RED
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
        textColor: '#303030',
        error: {
            borderColor: '#FF4B4B',
        },
        good: '#52B853',
        okay: '#ffa200',
        bad: '#FF4B4B',
        warn: '#ffbf1f',
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
        cardShadow: '0px 0px 6px 1px rgba(0,0,0,0.1)',
        cardShadowBold: '0px 0px 8px 2px rgba(0,0,0,0.1)',


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

        schema: {
            default: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(168, 0, 36, 0.95) 0%, rgba(217, 21, 0, 0.95) 100%)',
                solid: '#FF4B4B'
            },
            locations: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(92, 111, 255, 0.95) 0%, rgba(159, 91, 255, 0.95) 100%)',
                solid: '#5c6fff'
            },
            dashboards: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(255, 214, 0, 0.95) 0%, rgba(255, 138, 0, 0.95) 100%)',
                solid: '#5294ff'
            },
            objects: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(31, 255, 94, 0.95) 0%, rgba(0, 126, 237, 0.95) 100%)',
                solid: '#2ed182',
            },
            processes: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(255, 214, 0, 0.95) 0%, rgba(255, 118, 33, 0.95) 100%)',
                solid: '#ffbf1f'
            },
            tasks: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(31, 255, 94, 0.95) 0%, rgba(0, 126, 237, 0.95) 100%)',
                solid: '#2ed182',
            },
            routes: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(31, 255, 94, 0.95) 0%, rgba(0, 126, 237, 0.95) 100%)',
                solid: '#2ed182',
                iconName: "fas fa-route"
            },
            all: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 217, 155, 0.95) 0%, rgba(0, 162, 132, 0.95) 100%)',
                solid: '#1ae8a0'
            },
            lots: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(167, 114, 252, 0.95) 0%, rgba(251, 0, 255, 0.95) 100%)',
                solid: '#ba8fff',
                iconName: "fas fa-play"
            },
            merge: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(235, 52, 97, 0.95) 0%, rgba(235, 52, 189, 0.95) 100%)',
                solid: '#eb3461',
                iconName: "fas fa-object-group"
            },
            statistics: {
                solid: "#54AAFF",
            },
            kick_off: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(197, 155, 255) 0%, rgba(173, 115, 255, 0.95) 100%)',
                solid: '#a3ff9b',
                iconName: "fas fa-play"
            },
            finish: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(197, 155, 255) 0%, rgba(173, 115, 255, 0.95) 100%)',
                solid: '#fc5e03',
                iconName: "fas fa-flag-checkered"
            },
            error: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(168, 0, 36, 0.95) 0%, rgba(217, 21, 0, 0.95) 100%)',
                solid: '#FF4B4B'
            },
            ok: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(31, 255, 94, 0.95) 0%, rgba(0, 126, 237, 0.95) 100%)',
                solid: '#2ed182',
            },
            operations: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 217, 155, 0.95) 0%, rgba(0, 162, 132, 0.95) 100%)',
                solid: '#e81a69',
                iconName: "fas fa-sticky-note"
            },
            report: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(121, 217, 155, 0.95) 0%, rgba(0, 162, 132, 0.95) 100%)',
                solid: '#e8321a',
                iconName: "fas fa-exclamation-triangle"
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
                solid: '#c59bff',
                iconName: 'fa fa-tasks',
            },
            settings: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(197, 155, 255) 0%, rgba(173, 115, 255, 0.95) 100%)',
                solid: '#c59bff'
            },
            delete: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(255, 75, 75, 0.95) 0%, rgba(255, 61, 61, 0.95) 100%)',
                solid: '#ff4545'
            },
            warehouse: {
                gradient: 'radial-gradient(171.57% 115.09% at 100% 0%, rgba(92, 111, 255, 0.95) 0%, rgba(159, 91, 255, 0.95) 100%)',
                solid: '#5c6fff',
                iconName: 'fas fa-box',
            },
        }
    },
    funky: {

    },



};


export default theme;
