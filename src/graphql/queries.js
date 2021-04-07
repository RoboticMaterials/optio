/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const usersbyOrg = /* GraphQL */ `
  query UsersbyOrg(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    UsersbyOrg(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        username
        owner
      }
      nextToken
    }
  }
`;
export const usersbyId = /* GraphQL */ `
  query UsersbyId(
    $id: ID
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    UsersbyId(
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        username
        owner
      }
      nextToken
    }
  }
`;
export const orgsById = /* GraphQL */ `
  query OrgsById(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    OrgsById(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        name
        key
      }
      nextToken
    }
  }
`;
export const orgsByKey = /* GraphQL */ `
  query OrgsByKey(
    $key: String
    $sortDirection: ModelSortDirection
    $filter: ModelOrganizationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    OrgsByKey(
      key: $key
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        name
        key
      }
      nextToken
    }
  }
`;
export const stationsByOrgId = /* GraphQL */ `
  query StationsByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelStationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    StationsByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        name
        schema
        type
        pos_x
        pos_y
        rotation
        x
        y
        mapId
        children
        dashboards
      }
      nextToken
    }
  }
`;
export const positionsByOrgId = /* GraphQL */ `
  query PositionsByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelPositionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    PositionsByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        change_key
        mapId
        name
        parent
        pos_x
        pos_y
        rotation
        schema
        type
        x
        y
      }
      nextToken
    }
  }
`;
export const tasksByOrgId = /* GraphQL */ `
  query TasksByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    TasksByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        device_types
        handoff
        load
        mapId
        name
        processes
        quantity
        track_quantity
        type
        unload
        obj
        route_object
      }
      nextToken
    }
  }
`;
export const taskById = /* GraphQL */ `
  query TaskById(
    $id: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    TaskById(
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        device_types
        handoff
        load
        mapId
        name
        processes
        quantity
        track_quantity
        type
        unload
        obj
        route_object
      }
      nextToken
    }
  }
`;
export const processesByOrgId = /* GraphQL */ `
  query ProcessesByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelProcessFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ProcessesByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        name
        broken
        routes
        mapId
      }
      nextToken
    }
  }
`;
export const objectsByOrgId = /* GraphQL */ `
  query ObjectsByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelObjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ObjectsByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        description
        mapId
        modelName
        name
        dimensions
        quantity
      }
      nextToken
    }
  }
`;
export const cardsByOrgId = /* GraphQL */ `
  query CardsByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    CardsByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        bins
        dates
        description
        flags
        lotNumber
        lotTemplateId
        name
        processId
        totalQuantity
        processName
        count
      }
      nextToken
    }
  }
`;
export const getCardById = /* GraphQL */ `
  query GetCardById(
    $id: ID
    $sortDirection: ModelSortDirection
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCardById(
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        bins
        dates
        description
        flags
        lotNumber
        lotTemplateId
        name
        processId
        totalQuantity
        processName
        count
      }
      nextToken
    }
  }
`;
export const cardsEventsByOrgId = /* GraphQL */ `
  query CardsEventsByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelCardEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    CardsEventsByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        cardId
        userId
        username
        createdAt
        updatedAt
        delta
      }
      nextToken
    }
  }
`;
export const settingsByOrgId = /* GraphQL */ `
  query SettingsByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelSettingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    SettingsByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        MiRMapEnabled
        accessToken
        authenticated
        currentMapId
        deviceEnabled
        loggers
        mapViewEnabled
        non_local_api
        non_local_api_ip
        refreshToken
        shiftDetails
        toggleDevOptions
        timezone
      }
      nextToken
    }
  }
`;
export const lotTemplatesByOrgId = /* GraphQL */ `
  query LotTemplatesByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelLotTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    LotTemplatesByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        name
        displayNames
        fields
      }
      nextToken
    }
  }
`;
export const devicesByOrgId = /* GraphQL */ `
  query DevicesByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelDeviceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    DevicesByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        battery_percentage
        connected
        current_task_queue_id
        dashboards
        device_model
        device_name
        distance_to_next_target
        idle_location
        mapId
        position
        shelf_attached
        state_text
      }
      nextToken
    }
  }
`;
export const statusByOrgId = /* GraphQL */ `
  query StatusByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelStatusFilterInput
    $limit: Int
    $nextToken: String
  ) {
    StatusByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        active_map
        mir_connection
        pause_status
      }
      nextToken
    }
  }
`;
export const taskQueueByOrgId = /* GraphQL */ `
  query TaskQueueByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTaskQueueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    TaskQueueByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        device_type
        mission_status
        owner
        taskId
        custom_task
        dashboard
        showModal
        hil_response
        quantity
        lotId
        start_time
        end_time
        hil_station_id
        hil_message
      }
      nextToken
    }
  }
`;
export const dashboardsByOrgId = /* GraphQL */ `
  query DashboardsByOrgId(
    $organizationId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelDashboardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    DashboardsByOrgId(
      organizationId: $organizationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organizationId
        createdAt
        updatedAt
        data
      }
      nextToken
    }
  }
`;
