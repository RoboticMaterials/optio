import React from 'react'


const Arm = (props) => {

    const {
        customClassName
    } = props

    const class1 = {
        fill: '#231f20'
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8000 8000"><defs></defs><g id="Layer_2" dataName="Layer 2"><g id="Layer_1-2" dataName="Layer 1"><circle className={class1} id={`${customClassName}-device`} cx="56.54" cy="106.3" r="13.96" /><path className={class1} d="M48.78,91.07a13.84,13.84,0,0,0-5.91,5.24L13.16,32.88a13.92,13.92,0,0,0,13.72-6.42L56.59,89.88A13.88,13.88,0,0,0,48.78,91.07Z" /><circle className={class1} cx="13.96" cy="16.57" r="13.96" /><path className={class1} d="M96.12,9.3A13.86,13.86,0,0,0,99,16.65l-69.78,6.1A13.88,13.88,0,0,0,27.92,7.66L97.7,1.56A13.89,13.89,0,0,0,96.12,9.3Z" /><circle className={class1} cx="106.72" cy="8.15" r="8.15" /><path className={class1} d="M103.1,27.68l-1.62-9.15L115.88,16l1.61,9.15a35.21,35.21,0,0,1,2.57,8.5,35.46,35.46,0,0,1,.49,8.87,1.94,1.94,0,0,1,0,.24l-5,.88-1.61-9.1-4.26.75,1.6,9.1-5,.89a2.29,2.29,0,0,1-.1-.23,35.57,35.57,0,0,1-2.58-8.49A35.47,35.47,0,0,1,103.1,27.68Z" /><polygon className={class1} points="110.59 36.01 113.97 55.12 115.47 59.72 116.82 59.49 116.66 54.65 113.29 35.53 110.59 36.01" /></g></g></svg>

    )

}

export default Arm