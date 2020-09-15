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

export const ArmIcon = styled.i`
	${sharedDeviceCss};
	font-size: 7rem;
	
	${props => props.isSmall && {
		fontSize: "3.5rem"
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
    overflow: hidden;
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

export const CartIcon = styled.i`
	${sharedDeviceCss};
    font-size: 2.5rem;
    
    ${props => props.isSmall && {
		fontSize: "1.25rem"
	}};
`

export const DeviceTitle = styled.h2`

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz1};
    color: ${props => props.theme.bg.octonary};
    position: absolute;
    
    top: 25%;
    transform: translateY(-50%);
    
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
    
    font-size: 1.5rem;
    
    ${props => props.isSmall && {
		fontSize: "1rem"
	}};
`

export const StatusContainer = styled.div`
    border: solid .1rem;
    border-color: ${props => props.theme.bg.octonary};
    border-radius: 1rem;
    width: 75%;
    height: 10%;
    text-align: center;
    position: absolute;
    text-overflow: ellipsis;
    overflow: hidden;
    
    bottom: 25%;
    transform: translateY(50%);
    
`

export const StatusText = styled.p`
    margin: auto;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.theme.bg.octonary};
    overflow: hidden;
    
    ${props => props.isSmall && {
		fontSize: props.theme.fontSize.sz4
	}};
`