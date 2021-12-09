export default {
    throughput: "Throughput is the total quantity of product that has been finished in this process. Finished product includes product that has been moved into the finished column or product that has been moved into a warehouse which has no outgoing routes.",
    productionRate: "Production rate is the time it takes for a single product to be produced. It is determined based on the total throughput and the total working time on the production floor based on the shift settings defined in the settings tab.",
    wip: "Work In Process (WIP) is the amount of product that is currently in the process. This includes all stations in the process.",
    leadTime: "Lead Time is the amount of time it would take to produce a single product through this process if a new lot was added to the end of the queue.",
    balance: "Line balancing is the art of evening the cycle times of each station in the process to increase overall production rate. Takt time is the desired cycle time for every station in the process, and if all stations are at or below the takt time it will be the production rate. Drag the 'Takt' line in the chart to modify your desired takt time for this process.",
}