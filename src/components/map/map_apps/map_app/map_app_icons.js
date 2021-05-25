export default {

    heatmap: (enabled) => ( 
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" height={60} width={60}
            viewBox="0 0 100 100">

            <defs>
                <radialGradient id="okayGradMini" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="20%" style={{stopColor: '#ff9300', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ffc200', stopOpacity: 0}} />
                </radialGradient>
                <radialGradient id="badGradMini" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="20%" style={{stopColor: '#ff0e00', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ff6800', stopOpacity: 0}} />
                </radialGradient>
                <filter id="greyscale">
                    <feColorMatrix type="saturate" values="0"/>
                </filter>
            </defs>
            <g filter={!enabled && 'url(#greyscale)'}>
                <circle cx={40} cy={40} r={40} fill={'url(#badGradMini)'}/>
                <circle cx={70} cy={70} r={30} fill={'url(#okayGradMini)'}/>
            </g>
        </svg>
    )

}