/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStation = /* GraphQL */ `
  query GetStation($id: ID!) {
    getStation(id: $id) {
      id
      _id
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
  }
`;
export const listStations = /* GraphQL */ `
  query ListStations(
    $filter: ModelStationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        _id
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
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
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
      _id
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
        _id
        obj
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPosition = /* GraphQL */ `
  query GetPosition($id: ID!) {
    getPosition(id: $id) {
      id
      _id
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
export const getDevice = /* GraphQL */ `
  query GetDevice($id: ID!) {
    getDevice(id: $id) {
      id
      _id
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
