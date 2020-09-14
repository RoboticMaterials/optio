import React, { useState, useEffect, useContext } from 'react'
import ReactApexChart from 'react-apexcharts'

import { ThemeContext } from 'styled-components'
import { LightenDarkenColor } from '../../../../../methods/utils/color_utils'

const ApexGaugeChart = (props) => {

    const {
        min,
        max,
        value,
        style,
        containerStyle,
        color,
        formatValue,
        name, 
        onClick,
        selected
    } = props

    const theme = useContext(ThemeContext)

    const normalizedValue = Math.abs((value - min) / (max - min))
    // console.log(normalizedValue)
    let colorStops = [
        {
            offset: 0,
            color: '#ff0303',
            opacity: 1
        }
    ]
    if (normalizedValue > 0) {
        colorStops.push({
            offset: 20,
            color: '#ffb303',
            opacity: 1
        })
    }
    if (normalizedValue > 0) {
        colorStops.push({
            offset: 100,
            color: '#42e378',
            opacity: 1
        })
    }

    const [options, setOptions] = useState({})
    useEffect(() => {
        setOptions({
            chart: {
                type: 'radialBar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -110,
                    endAngle: 110,
                    hollow: {
                        margin: 0,
                        size: '70%',
                        background: LightenDarkenColor(theme.bg.quaternary, selected ? -15 : -5),
                        image: undefined,
                        imageOffsetX: 0,
                        imageOffsetY: 0,
                        position: 'front',
                        height: '70%',
                    },
                    track: {
                        background: '#fff',
                        strokeWidth: '67%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },
    
                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: -10,
                            show: true,
                            color: color,
                            fontSize: '17px'
                        },
                        value: {
                            formatter: () => !!formatValue ? formatValue() : value,
                            color: '#fff',
                            fontSize: '36px',
                            show: true,
                        }
                    }
                }
            },
            colors: [color],
            fill: {
                type: 'gradient',
                gradient: {
                    type: 'horizontal',
                    shadeIntensity: 1,
                    colorStops: colorStops
                }
            },
            stroke: {
                lineCap: 'round'
            },
            labels: [name],
        })
    }, [selected])

    const series = [100 * normalizedValue]

    return (
        <div id="chart" style={{flex: '1', height: '12rem', overflow: 'visible',...containerStyle}}>
            <ReactApexChart options={options} series={series} type="radialBar" height="100%"
                style={{
                    pointerEvents: 'none', 
                    transform: 'translateY(0rem)', 
                    overflow: 'visible',
                    ...style
                }} 
            />

            {/* OKAY so let me tell you about this little bit of BS. This freakin apex library
            hates developers and so theres some rendering issues with the 'hollow' element that is
            used for the overlay of the radialBar chart. So theres this little section at the bottom of the 
            hollow circles that doesnt like to render. I basically am just rendering a DIV to cover it up for now. 
            In addition, theres another circle overlay on that hollow thing that is used to apply the drop shadow
            because for SOME REASON they decided that they weren't going to implement an 'inset' in their
            box shadow. This is also where I have to implement the onclick because thats not built in either.  */}

            {/* Overlay to fix the weird cutoff */}
            <div onClick={onClick} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-49.5%,-50.5%)',
                height: '7.8rem',
                width: '7.8rem',
                borderRadius: '4rem',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    background: LightenDarkenColor(theme.bg.quaternary, selected ? -15 : -5),
                    height: '15px',
                    width: '100%'
                }}/>
            </div>

            {/* Overlay to add boxShadow and implement onClick */}
            <div onClick={onClick} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-49.5%,-50.5%)',
                height: '7.8rem',
                width: '7.8rem',
                borderRadius: '4rem',
                cursor: 'pointer',
                boxShadow: `${selected ? 'inset' : ''} 4px 4px 4px 0px rgba(0, 0, 0, 0.25), ${selected ? 'inset' : ''} -4px -4px 4px 0px rgba(255, 255, 255, 0.08)`,
                overflow: 'hidden'
            }}/>
        </div>
    )

}

export default ApexGaugeChart