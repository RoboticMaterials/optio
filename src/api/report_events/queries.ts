import { gql } from "@apollo/client";

export const listReportEvents = gql`query listReportEvents {
    listReportEvents {
        dashboardId
        date
        id
        organizationId
        reportButtonId
        stationId
  }
}`