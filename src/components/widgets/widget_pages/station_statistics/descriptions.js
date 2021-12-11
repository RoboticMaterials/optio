export default {
    productivity: "Productivity allows you to compare the station's cycle time with the desired process Takt time. The Takt time can be set for each product group by dragging the 'Takt' line on the balance chart in the process statistics.  ",
    oee: "Overall Equipment Effectiveness (OEE) is the measure of actual vs. theoretical maximum throughput. This is given by the product of availability, performance, and quality. Click on the gears to specify the theoretical minimum cycle time number of parts for this station.",
    cycleTime: "Cycle time is the measure of the time it takes to produce a single part at this station. This calculation uses the throughput of the station (for this product group) and measures it against the total working seconds in the work day based on your shift settings defined in the settings tab.",
    throughput: "Throughput is the total product produced (and moved forward) by this station over time. Throughput is separated by product group with a 'Total' measurement as well. You can toggle lines on this graph by clicking them in the legend.",
    wip: "Work in Progress (WIP) is the total amount of product sitting at this station over time. WIP is separated by product group with a 'Total' measurement as well. You can toggle lines on this graph by clicking them in the legend.",
    stationReports: "Station reports are triggered by the dashboard operators to indicate events such as machine down, defects, worker injuries, and more.",
    stationReportsPie: "A breakdown of the number of occurances of each report event.",
    processesPie: "A breakdown of the quantity of moved parts by the process they belonged to",
    productGroupPie: "A breakdown of the quantity of moved parts by the product group they belonged to.",
    operatorsPie: "A breakdown of the quantity of moved parts by the operator that moved them.",
    toStationPie: "A breakdown of the quantity of moved parts by the station they were moved to.",
    machineUtilization: "A measure of the utilization of this station: the ratio of total working seconds at this station and the total available working seconds which is based on the shift settings defined in the settings tab. Total working seconds is calculated based on the time a worker was active in a lot (verses looking at the list of lots at the station).",
    valueCreatingTime: "A measure of the relative amount of time a lot was being activly worked on verses the time it spent sitting idle at this station. The active working seconds of this lot is based on the time a worker was active in a lot (verses looking at the list of lots at the station)."
}