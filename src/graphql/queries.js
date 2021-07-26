/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listOrganizations = /* GraphQL */ `
  query ListOrganizations {
    listOrganizations {
      id
      organizationId
      name
      key
      users {
        id
        organizationId
        username
      }
    }
  }
`;
export const validateOrganizationId = /* GraphQL */ `
  query ValidateOrganizationId {
    validateOrganizationId
  }
`;
export const getOrganizationById = /* GraphQL */ `
  query GetOrganizationById($id: String!) {
    getOrganizationById(id: $id) {
      id
      organizationId
      name
      key
      users {
        id
        organizationId
        username
      }
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers {
    listUsers {
      id
      organizationId
      username
    }
  }
`;
export const getUserById = /* GraphQL */ `
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      id
      organizationId
      username
    }
  }
`;
export const listMaps = /* GraphQL */ `
  query ListMaps {
    listMaps {
      id
      organizationId
      name
      created_by {
        id
        organizationId
        username
      }
      created_by_id
      created_by_name
      map
      origin_theta
      origin_x
      origin_y
      resolution
      stations {
        id
        organizationId
        mapId
        name
        type
        pos_x
        pos_y
        rotation
        x
        y
      }
    }
  }
`;
export const getMapById = /* GraphQL */ `
  query GetMapById($id: String!) {
    getMapById(id: $id) {
      id
      organizationId
      name
      created_by {
        id
        organizationId
        username
      }
      created_by_id
      created_by_name
      map
      origin_theta
      origin_x
      origin_y
      resolution
      stations {
        id
        organizationId
        mapId
        name
        type
        pos_x
        pos_y
        rotation
        x
        y
      }
    }
  }
`;
export const listStations = /* GraphQL */ `
  query ListStations {
    listStations {
      id
      organizationId
      mapId
      name
      type
      pos_x
      pos_y
      rotation
      x
      y
      dashboards {
        id
        organizationId
        stationId
        data
      }
      cards {
        id
        organizationId
        lotId
        processId
        stationId
        name
        quantity
        lotNumber
        lotQuantity
        fields
        flags
        syncWithTemplate
      }
      stationEvents {
        id
        organizationId
        stationId
        outgoing
        quantity
        time
      }
      reportEvents {
        id
        organizationId
        dashboardId
        date
        reportButtonId
      }
    }
  }
`;
export const getStationById = /* GraphQL */ `
  query GetStationById($id: String!) {
    getStationById(id: $id) {
      id
      organizationId
      mapId
      name
      type
      pos_x
      pos_y
      rotation
      x
      y
      dashboards {
        id
        organizationId
        stationId
        data
      }
      cards {
        id
        organizationId
        lotId
        processId
        stationId
        name
        quantity
        lotNumber
        lotQuantity
        fields
        flags
        syncWithTemplate
      }
      stationEvents {
        id
        organizationId
        stationId
        outgoing
        quantity
        time
      }
      reportEvents {
        id
        organizationId
        dashboardId
        date
        reportButtonId
      }
    }
  }
`;
export const listStationEvents = /* GraphQL */ `
  query ListStationEvents {
    listStationEvents {
      id
      organizationId
      stationId
      sku {
        id
        organizationId
        name
        sku
        description
      }
      outgoing
      quantity
      time
    }
  }
`;
export const getStationEventById = /* GraphQL */ `
  query GetStationEventById($id: String!) {
    getStationEventById(id: $id) {
      id
      organizationId
      stationId
      sku {
        id
        organizationId
        name
        sku
        description
      }
      outgoing
      quantity
      time
    }
  }
`;
export const listRoutes = /* GraphQL */ `
  query ListRoutes {
    listRoutes {
      id
      organizationId
      processId
      handoff
      start {
        ... on Station {
          id
          organizationId
          mapId
          name
          type
          pos_x
          pos_y
          rotation
          x
          y
        }
        ... on Process {
          id
          organizationId
          mapId
          name
          showSummary
          showStatistics
        }
      }
      end {
        ... on Station {
          id
          organizationId
          mapId
          name
          type
          pos_x
          pos_y
          rotation
          x
          y
        }
        ... on Process {
          id
          organizationId
          mapId
          name
          showSummary
          showStatistics
        }
      }
      sku {
        id
        organizationId
        name
        sku
        description
      }
      multiplier
    }
  }
`;
export const getRouteById = /* GraphQL */ `
  query GetRouteById($id: String!) {
    getRouteById(id: $id) {
      id
      organizationId
      processId
      handoff
      start {
        ... on Station {
          id
          organizationId
          mapId
          name
          type
          pos_x
          pos_y
          rotation
          x
          y
        }
        ... on Process {
          id
          organizationId
          mapId
          name
          showSummary
          showStatistics
        }
      }
      end {
        ... on Station {
          id
          organizationId
          mapId
          name
          type
          pos_x
          pos_y
          rotation
          x
          y
        }
        ... on Process {
          id
          organizationId
          mapId
          name
          showSummary
          showStatistics
        }
      }
      sku {
        id
        organizationId
        name
        sku
        description
      }
      multiplier
    }
  }
`;
export const listProcesss = /* GraphQL */ `
  query ListProcesss {
    listProcesss {
      id
      organizationId
      mapId
      name
      routes {
        id
        organizationId
        processId
        handoff
        multiplier
      }
      showSummary
      showStatistics
    }
  }
`;
export const getProcessById = /* GraphQL */ `
  query GetProcessById($id: String!) {
    getProcessById(id: $id) {
      id
      organizationId
      mapId
      name
      routes {
        id
        organizationId
        processId
        handoff
        multiplier
      }
      showSummary
      showStatistics
    }
  }
`;
export const listCards = /* GraphQL */ `
  query ListCards {
    listCards {
      id
      organizationId
      lotId
      processId
      stationId
      name
      quantity
      lotNumber
      lotTemplate {
        id
        organizationId
        name
        displayNames
        fields
      }
      lotQuantity
      fields
      flags
      syncWithTemplate
    }
  }
`;
export const getCardById = /* GraphQL */ `
  query GetCardById($id: String!) {
    getCardById(id: $id) {
      id
      organizationId
      lotId
      processId
      stationId
      name
      quantity
      lotNumber
      lotTemplate {
        id
        organizationId
        name
        displayNames
        fields
      }
      lotQuantity
      fields
      flags
      syncWithTemplate
    }
  }
`;
export const listCardEvents = /* GraphQL */ `
  query ListCardEvents {
    listCardEvents {
      id
      organizationId
      cardId
      userId
      username
      delta
    }
  }
`;
export const getCardEventById = /* GraphQL */ `
  query GetCardEventById($id: String!) {
    getCardEventById(id: $id) {
      id
      organizationId
      cardId
      userId
      username
      delta
    }
  }
`;
export const listLotTemplates = /* GraphQL */ `
  query ListLotTemplates {
    listLotTemplates {
      id
      organizationId
      name
      displayNames
      fields
    }
  }
`;
export const getLotTemplateById = /* GraphQL */ `
  query GetLotTemplateById($id: String!) {
    getLotTemplateById(id: $id) {
      id
      organizationId
      name
      displayNames
      fields
    }
  }
`;
export const listDashboards = /* GraphQL */ `
  query ListDashboards {
    listDashboards {
      id
      organizationId
      stationId
      data
    }
  }
`;
export const getDashboardById = /* GraphQL */ `
  query GetDashboardById($id: String!) {
    getDashboardById(id: $id) {
      id
      organizationId
      stationId
      data
    }
  }
`;
export const listReportEvents = /* GraphQL */ `
  query ListReportEvents {
    listReportEvents {
      id
      organizationId
      dashboardId
      date
      reportButtonId
    }
  }
`;
export const getReportEventById = /* GraphQL */ `
  query GetReportEventById($id: String!) {
    getReportEventById(id: $id) {
      id
      organizationId
      dashboardId
      date
      reportButtonId
    }
  }
`;
export const listSettingss = /* GraphQL */ `
  query ListSettingss {
    listSettingss {
      id
      organizationId
      accessToken
      authenticated
      currentMapId
      loggers
      mapViewEnabled
      non_local_api
      non_local_api_ip
      refreshToken
      shiftDetails
      toggleDevOptions
      timezone
    }
  }
`;
export const getSettingsById = /* GraphQL */ `
  query GetSettingsById($id: String!) {
    getSettingsById(id: $id) {
      id
      organizationId
      accessToken
      authenticated
      currentMapId
      loggers
      mapViewEnabled
      non_local_api
      non_local_api_ip
      refreshToken
      shiftDetails
      toggleDevOptions
      timezone
    }
  }
`;
export const stationStatsLambda = /* GraphQL */ `
  query StationStatsLambda(
    $stationId: ID!
    $timeSpan: String!
    $timeZone: String!
    $index: Int!
    $sortKey: String
  ) {
    stationStatsLambda(
      stationId: $stationId
      timeSpan: $timeSpan
      timeZone: $timeZone
      index: $index
      sortKey: $sortKey
    ) {
      stationId
      organizationId
      date
      throughPut
    }
  }
`;
export const reportStatsLambda = /* GraphQL */ `
  query ReportStatsLambda(
    $stationId: ID!
    $timeSpan: String!
    $timeZone: String!
    $index: Int!
  ) {
    reportStatsLambda(
      stationId: $stationId
      timeSpan: $timeSpan
      timeZone: $timeZone
      index: $index
    ) {
      date
      throughPut
    }
  }
`;
