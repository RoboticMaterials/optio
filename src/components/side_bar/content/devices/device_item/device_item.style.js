import styled, { css } from 'styled-components'

const sharedDeviceCss = css`
	position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${props => props.theme.bg.octonary};
`

export const DeviceContainer = styled.div`
    display: flex;
    position: relative;
    margin-bottom: 2rem;
`

export const DeviceIcon = styled.i`
	${sharedDeviceCss};
    font-size: 6rem;

	${props => props.isSmall && {
		fontSize: "3rem"
	}};
`

export const BatterySvg = styled.svg`
    position: absolute;
    overflow: visible;
    height: 40%;
    right: -.2rem;
    top: 50%;
    transform: translateY(-50%);
`
export const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
`
export const OEESvg = styled.svg`
    position: absolute;
    overflow: visible;
    height: 40%;
    left: 2.25rem;
    top: 14rem;
    /* transform: translateY(-50%);     */
`

export const BatteryText = styled.p`
    position: absolute;
    top: 45.5%;
    right: 10%;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    user-select: none;

    ${props => props.isSmall && {
		fontSize: props.theme.fontSize.sz4
	}};
`

export const BigCircle = styled.div`
    height: 20rem;
    width: 20rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    border: solid .2rem black;
    border-radius: 50%;

    /* $border: 1rem;
    background-clip: padding-box;
    border: solid $border transparent;
    border-radius: 50%;
    color: #FFF;
    &:before {
        content: '';
        position: relative;
        top: 0; right: 0; bottom: 0; left: 0;
        z-index: -1;
        margin: -$border;
        border-radius: inherit;
        background: linear-gradient(to right, red, orange);
    } */

	${props => props.isSmall && {
		width: "15rem",
		height: "15rem"
	}};
`


export const DeviceTitle = styled.h2`

    font-family: ${props => props.theme.font.primary};
    /* font-size: ${props => props.theme.fontSize.sz2}; */
    font-size: 2rem;
    color: ${props => props.theme.bg.octonary};
    position: absolute;
    text-align:center;

    max-height: 5rem;
    text-overflow: ellipsis;
    overflow: hidden;

    top: 22%;
    transform: translateY(-50%);
    max-width: 13.5rem;

    user-sel
		&:hover: {
			cursor:pointer;
		}ect: none;


    // small style
    ${props => props.isSmall && {
		fontSize: props.theme.fontSize.sz2
	}};

`

export const EditDeviceIcon = styled.i`
    position: absolute;
    bottom: 5%;
    color: ${props => props.theme.bg.octonary};
    z-index: 10;
    &:hover{
        cursor: pointer;
    }

    font-size: 2rem;

    ${props => props.isSmall && {
		fontSize: "1.5rem"
	}};
`

export const StatusContainer = styled.div`
    border: solid .1rem;
    border-color: ${props => props.theme.bg.quaternary};
    border-radius: .5rem;
    width: 70%;
    height: ${props=>props.isSmall} ? 15%: 17%;
		margin-bottom:.8rem;
    text-align: center;
    position: absolute;
    text-overflow: ellipsis;
    overflow: hidden;
		align-self: center;
		z-index: 10;
		&:hover {
			cursor: pointer;
			background-color: ${props=>props.theme.bg.secondary};
		}
    bottom: 25%;
    transform: translateY(50%);
`
export const ConnectionStatusContainer = styled.div`
	display: flex;
	margin-top: ${props=>props.isSmall ? '4.8rem': '6.7rem'};
	width: 70%;
	justify-content: center;
	color: white;
	&:hover {
		cursor: pointer;
	}
`

export const StatusText = styled.p`
    margin: auto;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    color: ${props => props.theme.bg.octonary};
    overflow: hidden;
    user-select: none;

    ${props => props.isSmall && {
		fontSize: props.theme.fontSize.sz4
	}};
`
export const MissionText = styled.p`
    margin: auto;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    color: ${props => props.theme.bg.octonary};
    overflow: hidden;
    user-select: none;
		border-top: 1px solid ${props=>props.theme.bg.octonary};

    ${props => props.isSmall && {
		fontSize: props.theme.fontSize.sz5
	}};
`
export const ConnectionStatusText = styled.p`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props =>props.isSmall ? '0.9rem' : '1.2rem'};
    color: ${props => props.theme.bg.octonary};
		align-self: center;
		padding-right: .3rem;
		padding-left: .5rem;
		margin-bottom: 1.2rem;
`
