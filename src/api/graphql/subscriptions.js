/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onDeltaStation = /* GraphQL */ `
  subscription OnDeltaStation($id: ID) {
    onDeltaStation(id: $id) {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaPosition = /* GraphQL */ `
  subscription OnDeltaPosition($id: ID) {
    onDeltaPosition(id: $id) {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaTask = /* GraphQL */ `
  subscription OnDeltaTask($id: ID) {
    onDeltaTask(id: $id) {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaProcess = /* GraphQL */ `
  subscription OnDeltaProcess($id: ID) {
    onDeltaProcess(id: $id) {
      id
      organizationId
      name
      broken
      routes
      mapId
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaObject = /* GraphQL */ `
  subscription OnDeltaObject($id: ID) {
    onDeltaObject(id: $id) {
      id
      organizationId
      description
      mapId
      modelName
      name
      dimensions
      quantity
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaCard = /* GraphQL */ `
  subscription OnDeltaCard($id: ID) {
    onDeltaCard(id: $id) {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaDevice = /* GraphQL */ `
  subscription OnDeltaDevice($id: ID) {
    onDeltaDevice(id: $id) {
      id
      organizationId
      battery_percentage
      connected
      currentTaskQueueId
      dashboards
      device_model
      device_name
      distance_to_next_target
      idle_location
      mapId
      position
      shelf_attached
      state_text
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaStatus = /* GraphQL */ `
  subscription OnDeltaStatus($id: ID) {
    onDeltaStatus(id: $id) {
      id
      organizationId
      active_map
      mir_connection
      pause_status
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaTasQueue = /* GraphQL */ `
  subscription OnDeltaTasQueue($id: ID) {
    onDeltaTasQueue(id: $id) {
      id
      organizationId
      device_type
      mission_status
      owner
      taskId
      custom_task
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      organizationId
      username
      organization {
        id
        organizationId
        name
        key
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      organizationId
      username
      organization {
        id
        organizationId
        name
        key
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      organizationId
      username
      organization {
        id
        organizationId
        name
        key
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateOrganization = /* GraphQL */ `
  subscription OnCreateOrganization {
    onCreateOrganization {
      id
      organizationId
      name
      key
      users {
        nextToken
      }
      stations {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOrganization = /* GraphQL */ `
  subscription OnUpdateOrganization {
    onUpdateOrganization {
      id
      organizationId
      name
      key
      users {
        nextToken
      }
      stations {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOrganization = /* GraphQL */ `
  subscription OnDeleteOrganization {
    onDeleteOrganization {
      id
      organizationId
      name
      key
      users {
        nextToken
      }
      stations {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateStation = /* GraphQL */ `
  subscription OnCreateStation {
    onCreateStation {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateStation = /* GraphQL */ `
  subscription OnUpdateStation {
    onUpdateStation {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteStation = /* GraphQL */ `
  subscription OnDeleteStation {
    onDeleteStation {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePosition = /* GraphQL */ `
  subscription OnCreatePosition {
    onCreatePosition {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePosition = /* GraphQL */ `
  subscription OnUpdatePosition {
    onUpdatePosition {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePosition = /* GraphQL */ `
  subscription OnDeletePosition {
    onDeletePosition {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask {
    onUpdateTask {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask {
    onDeleteTask {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProcess = /* GraphQL */ `
  subscription OnCreateProcess {
    onCreateProcess {
      id
      organizationId
      name
      broken
      routes
      mapId
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProcess = /* GraphQL */ `
  subscription OnUpdateProcess {
    onUpdateProcess {
      id
      organizationId
      name
      broken
      routes
      mapId
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProcess = /* GraphQL */ `
  subscription OnDeleteProcess {
    onDeleteProcess {
      id
      organizationId
      name
      broken
      routes
      mapId
      createdAt
      updatedAt
    }
  }
`;
export const onCreateObject = /* GraphQL */ `
  subscription OnCreateObject {
    onCreateObject {
      id
      organizationId
      description
      mapId
      modelName
      name
      dimensions
      quantity
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateObject = /* GraphQL */ `
  subscription OnUpdateObject {
    onUpdateObject {
      id
      organizationId
      description
      mapId
      modelName
      name
      dimensions
      quantity
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteObject = /* GraphQL */ `
  subscription OnDeleteObject {
    onDeleteObject {
      id
      organizationId
      description
      mapId
      modelName
      name
      dimensions
      quantity
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCard = /* GraphQL */ `
  subscription OnCreateCard {
    onCreateCard {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCard = /* GraphQL */ `
  subscription OnUpdateCard {
    onUpdateCard {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCard = /* GraphQL */ `
  subscription OnDeleteCard {
    onDeleteCard {
      id
      organizationId
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateDevice = /* GraphQL */ `
  subscription OnCreateDevice {
    onCreateDevice {
      id
      organizationId
      battery_percentage
      connected
      currentTaskQueueId
      dashboards
      device_model
      device_name
      distance_to_next_target
      idle_location
      mapId
      position
      shelf_attached
      state_text
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDevice = /* GraphQL */ `
  subscription OnUpdateDevice {
    onUpdateDevice {
      id
      organizationId
      battery_percentage
      connected
      currentTaskQueueId
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
export const onDeleteDevice = /* GraphQL */ `
  subscription OnDeleteDevice {
    onDeleteDevice {
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
  }
`;
export const onCreateStatus = /* GraphQL */ `
  subscription OnCreateStatus {
    onCreateStatus {
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
export const onUpdateStatus = /* GraphQL */ `
  subscription OnUpdateStatus {
    onUpdateStatus {
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
export const onDeleteStatus = /* GraphQL */ `
  subscription OnDeleteStatus {
    onDeleteStatus {
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
export const onCreateTaskQueue = /* GraphQL */ `
  subscription OnCreateTaskQueue {
    onCreateTaskQueue {
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
export const onUpdateTaskQueue = /* GraphQL */ `
  subscription OnUpdateTaskQueue {
    onUpdateTaskQueue {
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
export const onDeleteTaskQueue = /* GraphQL */ `
  subscription OnDeleteTaskQueue {
    onDeleteTaskQueue {
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
export const onCreateDashboard = /* GraphQL */ `
  subscription OnCreateDashboard {
    onCreateDashboard {
      id
      _id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDashboard = /* GraphQL */ `
  subscription OnUpdateDashboard {
    onUpdateDashboard {
      id
      _id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDashboard = /* GraphQL */ `
  subscription OnDeleteDashboard {
    onDeleteDashboard {
      id
      _id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
