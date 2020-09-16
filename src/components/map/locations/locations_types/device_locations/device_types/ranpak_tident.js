import React from 'react'


const RanpakTrident = () => {

    const class1 = {
        stroke:'#000',
        strokeMiterlimit:'10',
    }

    const class2 = {
        stroke:'#000',
        strokeMiterlimit:'10',
        fill:'none',
    }

    const class3 = {
        fontSize:'86px',
        fontFamily:'FranklinGothic-Demi, Franklin Gothic Demi',
        fontWeight:'300'
        
    }

    const class4 = {
        letterSpacing:'-0.01em',
    }

    const class5 = {
        fontFamily:'FranklinGothic-Demi, Franklin Gothic Demi',
        fontWeight:'300',
        fontSize:'48px',
        fill:'#fff',
    }

    const class6 = {
        letterSpacing:'-0.05em',
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5000 2000"><defs></defs><g id="Layer_2" dataName="Layer 2"><g id="Layer_1-2" dataName="Layer 1"><polygon className={class1} points="430.69 108.17 430.69 167.5 54.69 167.5 35.51 108.17 430.69 108.17"/><polygon className={class2} points="430.69 0.5 430.69 108.17 35.51 108.17 0.69 0.5 430.69 0.5"/><text className={class3} transform="translate(159.91 82.46)">Fill<tspan className={class4} x="116.07" y="0">P</tspan><tspan x="167.3" y="0">ak</tspan></text><text className={class5} transform="translate(272.87 153.45)"><tspan className={class6}>T</tspan><tspan x="21.28" y="0">rident</tspan></text></g></g></svg>

    )

}

export default RanpakTrident