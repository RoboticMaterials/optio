import { gql } from "@apollo/client";

export const createReportEvent = gql`mutation createReportEvent($input: ReportEventInput!) {
    createReportEvent(input: $input) {
        dashboardId
        date
        id
        organizationId
        reportButtonId
        stationId
    }
}`