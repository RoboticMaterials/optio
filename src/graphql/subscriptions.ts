/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onDeltaStation = /* GraphQL */ `
  subscription OnDeltaStation {
    onDeltaStation {
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
  }
`;
export const onDeltaPosition = /* GraphQL */ `
  subscription OnDeltaPosition {
    onDeltaPosition {
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
  }
`;
export const onDeltaTask = /* GraphQL */ `
  subscription OnDeltaTask {
    onDeltaTask {
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
  }
`;
export const onDeltaProcess = /* GraphQL */ `
  subscription OnDeltaProcess {
    onDeltaProcess {
      id
      organizationId
      createdAt
      updatedAt
      name
      broken
      routes
      mapId
    }
  }
`;
export const onDeltaObject = /* GraphQL */ `
  subscription OnDeltaObject {
    onDeltaObject {
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
  }
`;
export const onDeltaCard = /* GraphQL */ `
  subscription OnDeltaCard {
    onDeltaCard {
      id
      organizationId
      createdAt
      updatedAt
      bins
      flags
      templateValues
      lotNumber
      lotTemplateId
      name
      processId
    }
  }
`;
export const onDeltaDevice = /* GraphQL */ `
  subscription OnDeltaDevice {
    onDeltaDevice {
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
  }
`;
export const onDeltaStatus = /* GraphQL */ `
  subscription OnDeltaStatus {
    onDeltaStatus {
      id
      organizationId
      createdAt
      updatedAt
      active_map
      mir_connection
      pause_status
    }
  }
`;
export const onDeltaTaskQueue = /* GraphQL */ `
  subscription OnDeltaTaskQueue {
    onDeltaTaskQueue {
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
  }
`;
