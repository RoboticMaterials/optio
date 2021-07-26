/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onDeltaDashboard = /* GraphQL */ `
  subscription OnDeltaDashboard {
    onDeltaDashboard {
      id
      organizationId
      stationId
      data
    }
  }
`;
export const onDeltaSettings = /* GraphQL */ `
  subscription OnDeltaSettings {
    onDeltaSettings {
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
export const onDeltaStation = /* GraphQL */ `
  subscription OnDeltaStation {
    onDeltaStation {
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
export const onDeltaRoute = /* GraphQL */ `
  subscription OnDeltaRoute {
    onDeltaRoute {
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
export const onDeltaProcess = /* GraphQL */ `
  subscription OnDeltaProcess {
    onDeltaProcess {
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
export const onDeltaCard = /* GraphQL */ `
  subscription OnDeltaCard {
    onDeltaCard {
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
export const onDeltaLotTemplate = /* GraphQL */ `
  subscription OnDeltaLotTemplate {
    onDeltaLotTemplate {
      id
      organizationId
      name
      displayNames
      fields
    }
  }
`;
