import styled, {css} from 'styled-components'
import Modal from 'react-modal';
import {LightenDarkenColor} from "../../../../methods/utils/color_utils";


const borderGlowCss = css`
    --border-width: .1rem;
    background: none;

    @keyframes moveGradient {
        50% {
          background-position: 100% 50%;
        }
      }

    border-radius: var(--border-width);

    &::after {
    position: absolute;
    content: "";
    top: calc(-1 * var(--border-width));
    left: calc(-1 * var(--border-width));
    z-index: -1;
    width: calc(100% + var(--border-width) * 2);
    height: calc(100% + var(--border-width) * 2);
    background: linear-gradient(
        60deg,
        /* hsl(224, 85%, 66%), */
        /* hsl(269, 85%, 66%), */
        /* hsl(314, 85%, 66%), */
        /* hsl(359, 85%, 66%), */
        hsl(44, 85%, 66%),
        hsl(89, 85%, 66%),
        hsl(134, 85%, 66%),
        hsl(179, 85%, 66%)
    );
    background-size: 300% 300%;
    background-position: 0 50%;
    border-radius: calc(2 * var(--border-width));
    animation: moveGradient 4s alternate infinite;
}
`


// export const TextboxDiv = styled.div`
//     background-color: ${props => props.theme.bg.primary};
//     border: none;
//     font-size: ${props => props.theme.fontSize.sz4};
//     font-family: ${props => props.theme.font.primary};
//     font-weight: 500;
//     min-height: 2rem;
//     display: flex;
//     flex-grow: 1;
//     color: ${props => props.theme.bg.octonary};
//     padding: .5rem;
//     border-radius: .5rem;

//     box-shadow: 0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1) !important;
//     border-bottom: 2px solid ${props => props.theme.bg.quinary};

//     &:focus {
//         // background-color: ${props => LightenDarkenColor(props.theme.bg.quinary, 10)};
//         border-bottom: 2px solid ${props => !!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
//         color: ${props => props.theme.bg.octonary};
//         outline: none !important;
//     }

//     &::placeholder {
//         font-family: ${props => props.theme.font.secondary};
//         color: ${props => props.theme.bg.senary};
//     }
// `;

// export const ListItem = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     width: 100%;
//     text-overflow: ellipsis;
//     justify-content: space-between;
//     background: ${props => props.theme.bg.secondary};

//     &:hover {
//         background: ${props => LightenDarkenColor(props.theme.bg.secondary, -10)};
//         cursor: pointer;
//     }

//     margin-left: 0rem;
//     margin-right: .5rem;
//     margin-top: 0rem;
//     margin-bottom: 1rem;
//     border-radius: 0.5rem;

//     border-color: ${props=>props.theme.bg.quaternary};
// `
// export const ListItemTitle = styled.h1`

//     font-family: ${props => props.theme.font.primary};
//     /* font-size: ${props => props.theme.fontSize.sz3}; */
//     font-size: 1rem;
//     font-weight: 500;
//     color: ${props => props.theme.bg.octonary};
//     user-select: none;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     margin-left: 0.5rem;
//     margin-right: 1rem;
//     margin-bottom: 0rem;

//     text-align: center;

// `

// export const HoverContainer = styled.div`
//     display: flex;
//     flex-direction: row;
//     width: 100%;
//     height: 100%;
//     padding: 1rem 0rem .5rem 0.3rem;
//     margin-left: 1.5rem;
//     &:hover {
//         cursor: pointer;
//     }

// `

export const BarcodeSVG = styled.svg`
// width: 100%;
min-height: 100%;
// align-items: right;
// flex-grow: 1;
`

// export const ListItemIcon = styled.i`

//     font-size: 1.3rem;
//     color: ${props => props.theme.schema.locations.solid};
//     padding-left: 0.8rem;

//     &:hover {
//         cursor: pointer;
//     }
// `
export const PrintIcon = styled.i`
    font-size: 1.6rem;
    color: ${props =>props.theme.schema.locations.solid};

    &:hover {
        cursor: pointer;
        color: ${props =>props.theme.schema.locations.solid};
    }

// `

export const Container = styled(Modal)`
	outline: none !important;
	outline-offset: none !important;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	right: auto;
	bottom: auto;

	position: absolute;

	z-index: 50;

    height: 70vh;
    width: 80vw;

	min-width: 30rem;
    max-width: 95%;
    min-height: 10rem;
    max-height: 95%;

	background: ${props => props.theme.bg.primary};

	display: flex;
	flex-direction: column;

	color: ${props => props.theme.bg.octonary};
	border-radius: 0.4rem;
	overflow: hidden;
`;

export const HeaderContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	border-width: 0;
	border-bottom: 2px solid ${props => props.theme.bg.quinary};
	margin-bottom: 2rem;
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0;
	margin: 0;
	max-height: 5rem;
	background: ${props => props.theme.bg.primary};
    border-bottom: 2px solid ${props => props.theme.bg.secondary};

`
export const Label = styled.span`
	padding-left: 1rem;
	font-size: ${props => props.theme.fontSize.sz3};
	margin-bottom: .25rem;
`
export const CloseIcon = styled.i`
    font-size: 1.4rem;
    margin: 1rem;
    color: ${props => props.theme.bg.quaternary};
    cursor: pointer;
`

export const Title = styled.h2`
	flex: 2;
	height: 100%;
	min-height: 100%;
	margin: 1rem;
	padding: 0;
	text-align: left;
	display: inline-flex;
	justify-content: center;
	align-items: center;

	font-size: ${props => props.theme.fontSize.sz2};
	font-weight: ${props => props.theme.fontWeight.bold};
`;

export const TextContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: 1.5rem;
`;

export const BodyContainer = styled.div`
	display: flex;
	padding: 1rem;

	justify-content: center;
    text-align: center;
	overflow: hidden;

	background: ${props => props.theme.bg.primary};


    width: 100%;
    height: 100%;
    page-break-after:always 
    @media print {
        @page { size: landscape; }
    }
`

export const ButtonForm = styled.div`

	display: flex;
	flex-direction: row;
	justify-content: center;
	min-height: fit-content;

    margin-top: 2rem;
`;

export const IconSelectorContainer = styled.div`
	background: ${props => props.theme.bg.primary};
	overflow: auto;
	min-height: 2rem;
	width: 100%;

	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	border-radius: .5rem;
`

export const ContentContainer = styled.div`
	background: ${props => props.theme.bg.primary};
	// border-radius: 1rem;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	margin-bottom: 1rem;
	align-items: center;
`
export const ReportButtonsContainer = styled.div`
	display: flex;

	flex-direction: column;
	align-items: center;
	// justify-content: center;
	flex-wrap: nowrap;
	overflow: auto;
	min-height: 5rem;
	width: 100%;
`

export const ConditionText = styled.span`
	font: ${props => props.theme.font.primary};
	font-size: ${props => props.theme.fontSize.sz3};
	max-width: 100 %;
	overflow: hidden;
	text-overflow: ellipsis;
`

export const RightContentContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.bg.primary};
    width: 4rem;
    border-left: 1px solid ${props => props.theme.bg.secondary};
    height: 100%;
    // background-color: ${props => props.theme.bg.septenary};

    // padding-left: 1rem;
    // border-top-right-radius: 0.6rem;
    // border-bottom-right-radius: 0.6rem;


`

// export const ButtonContainer = styled.button`
//   position: relative;
//   user-select: none;

//   // flex layout
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   // flex-grow: 1;
//   width: 90%;
//   overflow: hidden;
//   height: 4rem;
//   min-height: 4rem;
//   line-height: 3rem;
//   min-width: 80%;

//   background: ${props => `linear-gradient(180deg,
//                             ${LightenDarkenColor(props.background, 20)} 0%,
//                             ${props.background} 50%,
//                             ${LightenDarkenColor(props.background, -20)} 100%)`};
//   border-radius: 0.6rem;
//   padding: 0;


//   // margins
//   margin: .5rem 0 .5rem 0;

//   // padding
//   // padding: 0.5rem 1rem 0.5rem 1rem;

//   outline: none;
//   &:focus {
//     outline: none;
//   }

//   letter-spacing: 1.5px;
//   border: none;
//   box-shadow: ${props => props.clickable ? 'none' : `2px 2px 2px rgba(0, 0, 0, 0.5)`};
//   transition: all 0.1s ease 0s;
//   cursor: pointer;
//   outline: none;

//   &:hover {
//     ${props => props.hoverable && !props.clickable &&
// 	{
// 		boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
// 		transform: "translateY(-1px)",
// 	}
// }
//   }

//   ${props => props.clickable && !props.disabled &&
// 	`&:active {
//       background: ${`linear-gradient(180deg,
//           ${LightenDarkenColor(props.background, -20)} 0%,
//           ${props.background} 50%,
//           ${LightenDarkenColor(props.background, 20)} 100%)`
// 	}
//     }`
// }

//   ${props => props.disabled &&
// 	{
// 		color: props.theme.bg.quaternary,
// 		background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%), ${LightenDarkenColor(props.background, -60)}`,
// 		pointerEvents: "none",
// 	}
// }

//     // --border-width: 3px;
//     ${props => props.borderGlow &&
// 	borderGlowCss
// }

// ${props => props.css};

// `

// export const AddNewButtonContainer = styled.div`
// 	display: flex;
// 	justify-content: center;
// 	width: 100%;
// 	border-bottom:  ${props => props.showBorder && `1px solid` + props.theme.bg.secondary};
// `

// export const ColorFieldContainer = styled.div`
// 	position: relative;

// `


export const Icon = styled.i`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto auto;
    color: green;
    fill: green;
    font-size: 7rem;
    width: 14rem;
    &:hover {
        cursor: pointer;
    }

    &:active{
        filter: brightness(85%)
    }
`

export const FieldsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    justify-content: center;
    z-index: 10000;

    flex-grow: 1;
`


export const Field = styled.div`
    align-content: left;
    text-align: left;
`

export const FieldLabel = styled.span`
    font-weight: bold;
`

export const FieldValue = styled.span`

`