export default {
    totalThroughput: "Throughput is the total quantity of product that has been finished in the given date range. Finished products include products that have been moved into the finished column or into a warehouse with no outgoing routes.",
    productionRate: "Production rate is the amount of product that is produced per second. It is shown here by its inverse, the average time it takes to make a single product over the given date range, taking into account shift settings.",
    wip: "Work-In-Process (WIP) is the average number of products that have been at any station in the process during the given date range.",
    leadTime: "Lead time is the time it takes to produce a single product from the moment it enters the production process till the time it hits the finished queue. It is given by the production rate times the work-in-process. Lead time is expressed in working days, not accounting for weekends.",
    balance: "Line balancing is the art of evening the cycle times of each station in the process to reduce the amount of WIP and lead time. Your production rate is given by the slowest station, indicated by the 'Bottleneck line'. Takt time is the desired cycle time for every station in the process. Drag the 'Takt' line in the chart to modify your goal production rate for all stations in this process.",
    throughput: "Throughput over time in the given date range. 'Cumulative' shows the total throughput over the given date range."

}