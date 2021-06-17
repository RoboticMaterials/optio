/**
 * All of these coordinates have been calc by adjusting them on map with chrome dev tools
 * @param {*} location
 * @param {*} rd3tClassName
 * @param {*} d3
 */

export const handleWidgetHoverCoord = (location, rd3tClassName, d3) => {
    let widgetInfo = {}
    widgetInfo.id = location._id

    widgetInfo.heightWidth = '1'

    // Initial Ratios
    widgetInfo.yPosition = location.y
    widgetInfo.xPosition = location.x
    // widgetInfo.scale = Math.min(Math.max(d3.scale, 0.8), 1.3);
    widgetInfo.scale = d3.scale

    // Sets real scale to be used with the widget hover area
    widgetInfo.realScale = d3.scale

    return widgetInfo

}
