import React from "react";

import { ResponsiveCalendar } from "@nivo/calendar";

const CalendarChart = (props) => {
  const data = props.data;

  return (
    <ResponsiveCalendar
      data={data}
      from="2016-07-01"
      to="2016-07-12"
      emptyColor="#7e7e7e"
      colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      yearSpacing={40}
      monthBorderColor="#E6E6E6"
      dayBorderWidth={2}
      monthBorderWidth={8}
      dayBorderColor="#E6E6E6"
      // monthLegend={[{
      //     year: 1,
      // }]}
      onClick={(day, event) => {}}
      legends={[
        {
          anchor: "bottom-right",
          direction: "row",
          translateY: 36,
          itemCount: 4,
          itemWidth: 42,
          itemHeight: 36,
          itemsSpacing: 14,
          itemDirection: "right-to-left",
        },
      ]}
    />
  );
};

export default CalendarChart;
