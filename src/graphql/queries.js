/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSettings = /* GraphQL */ `
  query GetSettings($id: ID!) {
    getSettings(id: $id) {
      id
      _id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const listSettingss = /* GraphQL */ `
  query ListSettingss(
    $filter: ModelSettingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSettingss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        _id
        organizationId
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLotTemplate = /* GraphQL */ `
  query GetLotTemplate($id: ID!) {
    getLotTemplate(id: $id) {
      id
      _id
      organizationId
      name
      displayNames
      fields
      createdAt
      updatedAt
    }
  }
`;
export const listLotTemplates = /* GraphQL */ `
  query ListLotTemplates(
    $filter: ModelLotTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLotTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        _id
        organizationId
        name
        displayNames
        fields
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTaskQueue = /* GraphQL */ `
  query GetTaskQueue($id: ID!) {
    getTaskQueue(id: $id) {
      id
      _id
      organizationId
      device_type
      mission_status
      owner
      task_id
      custom_task
      dashboard
      showModal
      hil_response
      quantity
      lot_id
      start_time
      end_time
      hil_station_id
      hil_message
      createdAt
      updatedAt
    }
  }
`;
export const listTaskQueues = /* GraphQL */ `
  query ListTaskQueues(
    $filter: ModelTaskQueueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTaskQueues(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        _id
        organizationId
        device_type
        mission_status
        owner
        task_id
        custom_task
        dashboard
        showModal
        hil_response
        quantity
        lot_id
        start_time
        end_time
        hil_station_id
        hil_message
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDashboard = /* GraphQL */ `
  query GetDashboard($id: ID!) {
    getDashboard(id: $id) {
      id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
export const listDashboards = /* GraphQL */ `
  query ListDashboards(
    $filter: ModelDashboardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDashboards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        organizationId
        data
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
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
        username
        createdAt
        updatedAt
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
        username
        createdAt
        updatedAt
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
        name
        key
        createdAt
        updatedAt
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
        name
        key
        createdAt
        updatedAt
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
        _id
        organizationId
        name
        schema
        type
        pos_x
        pos_y
        rotation
        x
        y
        map_id
        children
        dashboards
        createdAt
        updatedAt
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
        _id
        organizationId
        change_key
        map_id
        name
        parent
        pos_x
        pos_y
        rotation
        schema
        type
        x
        y
        createdAt
        updatedAt
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
        _id
        organizationId
        device_types
        handoff
        load
        map_id
        name
        processes
        quantity
        track_quantity
        type
        unload
        obj
        route_object
        createdAt
        updatedAt
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
        _id
        organizationId
        name
        broken
        routes
        map_id
        createdAt
        updatedAt
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
        _id
        organizationId
        description
        map_id
        modelName
        name
        dimensions
        quantity
        createdAt
        updatedAt
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
        _id
        organizationId
        bins
        dates
        description
        flags
        lotNumber
        lotTemplateId
        name
        process_id
        totalQuantity
        processName
        count
        createdAt
        updatedAt
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
        _id
        organizationId
        bins
        dates
        description
        flags
        lotNumber
        lotTemplateId
        name
        process_id
        totalQuantity
        processName
        count
        createdAt
        updatedAt
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
        _id
        organizationId
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
        createdAt
        updatedAt
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
        _id
        organizationId
        name
        displayNames
        fields
        createdAt
        updatedAt
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
        _id
        organizationId
        battery_percentage
        connected
        current_task_queue_id
        dashboards
        device_model
        device_name
        distance_to_next_target
        idle_location
        map_id
        position
        shelf_attached
        state_text
        createdAt
        updatedAt
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
        _id
        organizationId
        active_map
        mir_connection
        pause_status
        createdAt
        updatedAt
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
        _id
        organizationId
        device_type
        mission_status
        owner
        task_id
        custom_task
        dashboard
        showModal
        hil_response
        quantity
        lot_id
        start_time
        end_time
        hil_station_id
        hil_message
        createdAt
        updatedAt
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
        data
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
