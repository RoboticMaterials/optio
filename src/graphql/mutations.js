/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOrganization = /* GraphQL */ `
  mutation CreateOrganization($input: OrganizationInput!) {
    createOrganization(input: $input) {
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
export const updateOrganization = /* GraphQL */ `
  mutation UpdateOrganization($input: OrganizationUpdateInput!) {
    updateOrganization(input: $input) {
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
export const deleteOrganization = /* GraphQL */ `
  mutation DeleteOrganization($id: ID!, $organizationId: ID) {
    deleteOrganization(id: $id, organizationId: $organizationId) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      organizationId
      username
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      id
      organizationId
      username
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($id: ID!, $organizationId: ID) {
    deleteUser(id: $id, organizationId: $organizationId) {
      id
      organizationId
      username
    }
  }
`;
export const createMap = /* GraphQL */ `
  mutation CreateMap($input: MapInput!) {
    createMap(input: $input) {
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
export const updateMap = /* GraphQL */ `
  mutation UpdateMap($input: MapUpdateInput!) {
    updateMap(input: $input) {
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
export const deleteMap = /* GraphQL */ `
  mutation DeleteMap($id: ID!, $organizationId: ID) {
    deleteMap(id: $id, organizationId: $organizationId) {
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
export const createProcess = /* GraphQL */ `
  mutation CreateProcess($input: ProcessInput!) {
    createProcess(input: $input) {
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
export const updateProcess = /* GraphQL */ `
  mutation UpdateProcess($input: ProcessUpdateInput!) {
    updateProcess(input: $input) {
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
export const deleteProcess = /* GraphQL */ `
  mutation DeleteProcess($id: ID!, $organizationId: ID) {
    deleteProcess(id: $id, organizationId: $organizationId) {
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
export const createRoute = /* GraphQL */ `
  mutation CreateRoute($input: RouteInput!) {
    createRoute(input: $input) {
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
export const updateRoute = /* GraphQL */ `
  mutation UpdateRoute($input: RouteUpdateInput!) {
    updateRoute(input: $input) {
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
export const deleteRoute = /* GraphQL */ `
  mutation DeleteRoute($id: ID!, $organizationId: ID) {
    deleteRoute(id: $id, organizationId: $organizationId) {
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
export const createStation = /* GraphQL */ `
  mutation CreateStation($input: StationInput!) {
    createStation(input: $input) {
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
export const updateStation = /* GraphQL */ `
  mutation UpdateStation($input: StationUpdateInput!) {
    updateStation(input: $input) {
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
export const deleteStation = /* GraphQL */ `
  mutation DeleteStation($id: ID!, $organizationId: ID) {
    deleteStation(id: $id, organizationId: $organizationId) {
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
export const createStationEvent = /* GraphQL */ `
  mutation CreateStationEvent($input: StationEventInput!) {
    createStationEvent(input: $input) {
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
export const updateStationEvent = /* GraphQL */ `
  mutation UpdateStationEvent($input: StationEventUpdateInput!) {
    updateStationEvent(input: $input) {
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
export const deleteStationEvent = /* GraphQL */ `
  mutation DeleteStationEvent($id: ID!, $organizationId: ID) {
    deleteStationEvent(id: $id, organizationId: $organizationId) {
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
export const createReportEvent = /* GraphQL */ `
  mutation CreateReportEvent($input: ReportEventInput!) {
    createReportEvent(input: $input) {
      id
      organizationId
      dashboardId
      date
      reportButtonId
    }
  }
`;
export const updateReportEvent = /* GraphQL */ `
  mutation UpdateReportEvent($input: ReportEventInput!) {
    updateReportEvent(input: $input) {
      id
      organizationId
      dashboardId
      date
      reportButtonId
    }
  }
`;
export const deleteReportEvent = /* GraphQL */ `
  mutation DeleteReportEvent($id: ID!, $organizationId: ID) {
    deleteReportEvent(id: $id, organizationId: $organizationId) {
      id
      organizationId
      dashboardId
      date
      reportButtonId
    }
  }
`;
export const createDashboard = /* GraphQL */ `
  mutation CreateDashboard($input: DashboardInput!) {
    createDashboard(input: $input) {
      id
      organizationId
      stationId
      data
    }
  }
`;
export const updateDashboard = /* GraphQL */ `
  mutation UpdateDashboard($input: DashboardUpdateInput!) {
    updateDashboard(input: $input) {
      id
      organizationId
      stationId
      data
    }
  }
`;
export const deleteDashboard = /* GraphQL */ `
  mutation DeleteDashboard($id: ID!, $organizationId: ID) {
    deleteDashboard(id: $id, organizationId: $organizationId) {
      id
      organizationId
      stationId
      data
    }
  }
`;
export const createCard = /* GraphQL */ `
  mutation CreateCard($input: CardInput!) {
    createCard(input: $input) {
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
export const updateCard = /* GraphQL */ `
  mutation UpdateCard($input: CardUpdateInput!) {
    updateCard(input: $input) {
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
export const deleteCard = /* GraphQL */ `
  mutation DeleteCard($id: ID!, $organizationId: ID) {
    deleteCard(id: $id, organizationId: $organizationId) {
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
export const createCardEvent = /* GraphQL */ `
  mutation CreateCardEvent($input: CardEventInput!) {
    createCardEvent(input: $input) {
      id
      organizationId
      cardId
      userId
      username
      delta
    }
  }
`;
export const updateCardEvent = /* GraphQL */ `
  mutation UpdateCardEvent($input: CardEventUpdateInput!) {
    updateCardEvent(input: $input) {
      id
      organizationId
      cardId
      userId
      username
      delta
    }
  }
`;
export const deleteCardEvent = /* GraphQL */ `
  mutation DeleteCardEvent($id: ID!, $organizationId: ID) {
    deleteCardEvent(id: $id, organizationId: $organizationId) {
      id
      organizationId
      cardId
      userId
      username
      delta
    }
  }
`;
export const createLotTemplate = /* GraphQL */ `
  mutation CreateLotTemplate($input: LotTemplateInput!) {
    createLotTemplate(input: $input) {
      id
      organizationId
      name
      displayNames
      fields
    }
  }
`;
export const updateLotTemplate = /* GraphQL */ `
  mutation UpdateLotTemplate($input: LotTemplateUpdateInput!) {
    updateLotTemplate(input: $input) {
      id
      organizationId
      name
      displayNames
      fields
    }
  }
`;
export const deleteLotTemplate = /* GraphQL */ `
  mutation DeleteLotTemplate($id: ID!, $organizationId: ID) {
    deleteLotTemplate(id: $id, organizationId: $organizationId) {
      id
      organizationId
      name
      displayNames
      fields
    }
  }
`;
export const createSku = /* GraphQL */ `
  mutation CreateSku($input: SkuInput!) {
    createSku(input: $input) {
      id
      organizationId
      name
      sku
      description
    }
  }
`;
export const updateSku = /* GraphQL */ `
  mutation UpdateSku($input: SkuUpdateInput!) {
    updateSku(input: $input) {
      id
      organizationId
      name
      sku
      description
    }
  }
`;
export const deleteSku = /* GraphQL */ `
  mutation DeleteSku($id: ID!, $organizationId: ID) {
    deleteSku(id: $id, organizationId: $organizationId) {
      id
      organizationId
      name
      sku
      description
    }
  }
`;
export const createSettings = /* GraphQL */ `
  mutation CreateSettings($input: SettingsInput!) {
    createSettings(input: $input) {
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
export const updateSettings = /* GraphQL */ `
  mutation UpdateSettings($input: SettingsUpdateInput!) {
    updateSettings(input: $input) {
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
export const deleteSettings = /* GraphQL */ `
  mutation DeleteSettings($id: ID!, $organizationId: ID) {
    deleteSettings(id: $id, organizationId: $organizationId) {
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
export const createMapLambda = /* GraphQL */ `
  mutation CreateMapLambda($organizationId: String!) {
    createMapLambda(organizationId: $organizationId) {
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
