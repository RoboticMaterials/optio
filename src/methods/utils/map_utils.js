import { useSelector } from 'react-redux'

export const convertD3ToReal = ([x, y], d3) => {

    const pos_x = d3.mapResolution * (x - d3.translate[0]) * d3.naturalDims.width / (d3.actualDims.width * d3.scale)
    const pos_y = d3.mapResolution * -(((y - d3.translate[1]) * d3.naturalDims.height / (d3.actualDims.height * d3.scale)) - d3.naturalDims.height)

    return [pos_x, pos_y]
}

export const convertRealToD3 = ([pos_x, pos_y], d3) => {

    

    const x = d3.translate[0] + d3.scale * d3.actualDims.width * pos_x / (d3.naturalDims.width * d3.mapResolution)
    const y = d3.translate[1] + d3.scale * d3.actualDims.height * (d3.naturalDims.height - (pos_y/ d3.mapResolution))/ (d3.naturalDims.height)

    // console.log(pos_x, pos_y, ' - ', x, y, d3.mapResolution)

    return [x, y]
}
