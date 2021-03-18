/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPosition = /* GraphQL */ `
  query GetPosition($id: ID!) {
    getPosition(id: $id) {
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
  }
`;
export const listPositions = /* GraphQL */ `
  query ListPositions(
    $filter: ModelPositionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPositions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
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
      createdAt
      updatedAt
    }
  }
`;
export const listTasks = /* GraphQL */ `
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProcess = /* GraphQL */ `
  query GetProcess($id: ID!) {
    getProcess(id: $id) {
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
  }
`;
export const listProcesss = /* GraphQL */ `
  query ListProcesss(
    $filter: ModelProcessFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProcesss(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getCard = /* GraphQL */ `
  query GetCard($id: ID!) {
    getCard(id: $id) {
      id
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
      createdAt
      updatedAt
    }
  }
`;
export const listCards = /* GraphQL */ `
  query ListCards(
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getObject = /* GraphQL */ `
  query GetObject($id: ID!) {
    getObject(id: $id) {
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
  }
`;
export const listObjects = /* GraphQL */ `
  query ListObjects(
    $filter: ModelObjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listObjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getSchedule = /* GraphQL */ `
  query GetSchedule($id: ID!) {
    getSchedule(id: $id) {
      id
      _id
      organizationId
      days_on {
        friday
        monday
        saturday
        sunday
        thursday
        tuesday
        wednesday
      }
      interval_on
      name
      schedule_on
      start_time
      task_id
      time_interval
      createdAt
      updatedAt
    }
  }
`;
export const listSchedules = /* GraphQL */ `
  query ListSchedules(
    $filter: ModelScheduleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchedules(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        _id
        organizationId
        interval_on
        name
        schedule_on
        start_time
        task_id
        time_interval
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDevice = /* GraphQL */ `
  query GetDevice($id: ID!) {
    getDevice(id: $id) {
      id
      _id
      organizationId
      battery_percentage
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
  }
`;
export const listDevices = /* GraphQL */ `
  query ListDevices(
    $filter: ModelDeviceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDevices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        _id
        organizationId
        battery_percentage
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
export const getStatus = /* GraphQL */ `
  query GetStatus($id: ID!) {
    getStatus(id: $id) {
      id
      _id
      organizationId
      active_map
      mir_connection
      pause_status
      createdAt
      updatedAt
    }
  }
`;
export const listStatuss = /* GraphQL */ `
  query ListStatuss(
    $filter: ModelStatusFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStatuss(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
