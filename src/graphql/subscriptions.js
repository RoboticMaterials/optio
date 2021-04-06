/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onDeltaStation = /* GraphQL */ `
  subscription OnDeltaStation {
    onDeltaStation {
      id
      _id
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
      map_id
      children
      dashboards
    }
  }
`;
export const onDeltaPosition = /* GraphQL */ `
  subscription OnDeltaPosition {
    onDeltaPosition {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onDeltaTask = /* GraphQL */ `
  subscription OnDeltaTask {
    onDeltaTask {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onDeltaProcess = /* GraphQL */ `
  subscription OnDeltaProcess {
    onDeltaProcess {
      id
      _id
      organizationId
      createdAt
      updatedAt
      name
      broken
      routes
      map_id
    }
  }
`;
export const onDeltaObject = /* GraphQL */ `
  subscription OnDeltaObject {
    onDeltaObject {
      id
      _id
      organizationId
      createdAt
      updatedAt
      description
      map_id
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
      _id
      organizationId
      createdAt
      updatedAt
      bins
      flags
      lotNumber
      lotTemplateId
      name
      process_id
      templateValues
    }
  }
`;
export const onDeltaDevice = /* GraphQL */ `
  subscription OnDeltaDevice {
    onDeltaDevice {
      id
      _id
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
      map_id
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
      _id
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
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      organizationId
      createdAt
      updatedAt
      username
      organization {
        id
        organizationId
        createdAt
        updatedAt
        name
        key
      }
      owner
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      organizationId
      createdAt
      updatedAt
      username
      organization {
        id
        organizationId
        createdAt
        updatedAt
        name
        key
      }
      owner
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      organizationId
      createdAt
      updatedAt
      username
      organization {
        id
        organizationId
        createdAt
        updatedAt
        name
        key
      }
      owner
    }
  }
`;
export const onCreateOrganization = /* GraphQL */ `
  subscription OnCreateOrganization {
    onCreateOrganization {
      id
      organizationId
      createdAt
      updatedAt
      name
      key
      users {
        nextToken
      }
    }
  }
`;
export const onUpdateOrganization = /* GraphQL */ `
  subscription OnUpdateOrganization {
    onUpdateOrganization {
      id
      organizationId
      createdAt
      updatedAt
      name
      key
      users {
        nextToken
      }
    }
  }
`;
export const onDeleteOrganization = /* GraphQL */ `
  subscription OnDeleteOrganization {
    onDeleteOrganization {
      id
      organizationId
      createdAt
      updatedAt
      name
      key
      users {
        nextToken
      }
    }
  }
`;
export const onCreateStation = /* GraphQL */ `
  subscription OnCreateStation {
    onCreateStation {
      id
      _id
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
      map_id
      children
      dashboards
    }
  }
`;
export const onUpdateStation = /* GraphQL */ `
  subscription OnUpdateStation {
    onUpdateStation {
      id
      _id
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
      map_id
      children
      dashboards
    }
  }
`;
export const onDeleteStation = /* GraphQL */ `
  subscription OnDeleteStation {
    onDeleteStation {
      id
      _id
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
      map_id
      children
      dashboards
    }
  }
`;
export const onCreatePosition = /* GraphQL */ `
  subscription OnCreatePosition {
    onCreatePosition {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onUpdatePosition = /* GraphQL */ `
  subscription OnUpdatePosition {
    onUpdatePosition {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onDeletePosition = /* GraphQL */ `
  subscription OnDeletePosition {
    onDeletePosition {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask {
    onUpdateTask {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask {
    onDeleteTask {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onCreateProcess = /* GraphQL */ `
  subscription OnCreateProcess {
    onCreateProcess {
      id
      _id
      organizationId
      createdAt
      updatedAt
      name
      broken
      routes
      map_id
    }
  }
`;
export const onUpdateProcess = /* GraphQL */ `
  subscription OnUpdateProcess {
    onUpdateProcess {
      id
      _id
      organizationId
      createdAt
      updatedAt
      name
      broken
      routes
      map_id
    }
  }
`;
export const onDeleteProcess = /* GraphQL */ `
  subscription OnDeleteProcess {
    onDeleteProcess {
      id
      _id
      organizationId
      createdAt
      updatedAt
      name
      broken
      routes
      map_id
    }
  }
`;
export const onCreateObject = /* GraphQL */ `
  subscription OnCreateObject {
    onCreateObject {
      id
      _id
      organizationId
      createdAt
      updatedAt
      description
      map_id
      modelName
      name
      dimensions
      quantity
    }
  }
`;
export const onUpdateObject = /* GraphQL */ `
  subscription OnUpdateObject {
    onUpdateObject {
      id
      _id
      organizationId
      createdAt
      updatedAt
      description
      map_id
      modelName
      name
      dimensions
      quantity
    }
  }
`;
export const onDeleteObject = /* GraphQL */ `
  subscription OnDeleteObject {
    onDeleteObject {
      id
      _id
      organizationId
      createdAt
      updatedAt
      description
      map_id
      modelName
      name
      dimensions
      quantity
    }
  }
`;
export const onCreateCard = /* GraphQL */ `
  subscription OnCreateCard {
    onCreateCard {
      id
      _id
      organizationId
      createdAt
      updatedAt
      bins
      flags
      lotNumber
      lotTemplateId
      name
      process_id
      templateValues
    }
  }
`;
export const onUpdateCard = /* GraphQL */ `
  subscription OnUpdateCard {
    onUpdateCard {
      id
      _id
      organizationId
      createdAt
      updatedAt
      bins
      flags
      lotNumber
      lotTemplateId
      name
      process_id
      templateValues
    }
  }
`;
export const onDeleteCard = /* GraphQL */ `
  subscription OnDeleteCard {
    onDeleteCard {
      id
      _id
      organizationId
      createdAt
      updatedAt
      bins
      flags
      lotNumber
      lotTemplateId
      name
      process_id
      templateValues
    }
  }
`;
export const onCreateCardEvent = /* GraphQL */ `
  subscription OnCreateCardEvent {
    onCreateCardEvent {
      id
      organizationId
      cardId
      userId
      username
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onUpdateCardEvent = /* GraphQL */ `
  subscription OnUpdateCardEvent {
    onUpdateCardEvent {
      id
      organizationId
      cardId
      userId
      username
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onDeleteCardEvent = /* GraphQL */ `
  subscription OnDeleteCardEvent {
    onDeleteCardEvent {
      id
      organizationId
      cardId
      userId
      username
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onCreateSettings = /* GraphQL */ `
  subscription OnCreateSettings {
    onCreateSettings {
      id
      _id
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
  }
`;
export const onUpdateSettings = /* GraphQL */ `
  subscription OnUpdateSettings {
    onUpdateSettings {
      id
      _id
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
  }
`;
export const onDeleteSettings = /* GraphQL */ `
  subscription OnDeleteSettings {
    onDeleteSettings {
      id
      _id
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
  }
`;
export const onCreateLotTemplate = /* GraphQL */ `
  subscription OnCreateLotTemplate {
    onCreateLotTemplate {
      id
      _id
      organizationId
      createdAt
      updatedAt
      name
      displayNames
      fields
    }
  }
`;
export const onUpdateLotTemplate = /* GraphQL */ `
  subscription OnUpdateLotTemplate {
    onUpdateLotTemplate {
      id
      _id
      organizationId
      createdAt
      updatedAt
      name
      displayNames
      fields
    }
  }
`;
export const onDeleteLotTemplate = /* GraphQL */ `
  subscription OnDeleteLotTemplate {
    onDeleteLotTemplate {
      id
      _id
      organizationId
      createdAt
      updatedAt
      name
      displayNames
      fields
    }
  }
`;
export const onCreateDevice = /* GraphQL */ `
  subscription OnCreateDevice {
    onCreateDevice {
      id
      _id
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
      map_id
      position
      shelf_attached
      state_text
    }
  }
`;
export const onUpdateDevice = /* GraphQL */ `
  subscription OnUpdateDevice {
    onUpdateDevice {
      id
      _id
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
      map_id
      position
      shelf_attached
      state_text
    }
  }
`;
export const onDeleteDevice = /* GraphQL */ `
  subscription OnDeleteDevice {
    onDeleteDevice {
      id
      _id
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
      map_id
      position
      shelf_attached
      state_text
    }
  }
`;
export const onCreateStatus = /* GraphQL */ `
  subscription OnCreateStatus {
    onCreateStatus {
      id
      _id
      organizationId
      createdAt
      updatedAt
      active_map
      mir_connection
      pause_status
    }
  }
`;
export const onUpdateStatus = /* GraphQL */ `
  subscription OnUpdateStatus {
    onUpdateStatus {
      id
      _id
      organizationId
      createdAt
      updatedAt
      active_map
      mir_connection
      pause_status
    }
  }
`;
export const onDeleteStatus = /* GraphQL */ `
  subscription OnDeleteStatus {
    onDeleteStatus {
      id
      _id
      organizationId
      createdAt
      updatedAt
      active_map
      mir_connection
      pause_status
    }
  }
`;
export const onCreateTaskQueue = /* GraphQL */ `
  subscription OnCreateTaskQueue {
    onCreateTaskQueue {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onUpdateTaskQueue = /* GraphQL */ `
  subscription OnUpdateTaskQueue {
    onUpdateTaskQueue {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onDeleteTaskQueue = /* GraphQL */ `
  subscription OnDeleteTaskQueue {
    onDeleteTaskQueue {
      id
      _id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onCreateTaskQueueEvents = /* GraphQL */ `
  subscription OnCreateTaskQueueEvents {
    onCreateTaskQueueEvents {
      id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onUpdateTaskQueueEvents = /* GraphQL */ `
  subscription OnUpdateTaskQueueEvents {
    onUpdateTaskQueueEvents {
      id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onDeleteTaskQueueEvents = /* GraphQL */ `
  subscription OnDeleteTaskQueueEvents {
    onDeleteTaskQueueEvents {
      id
      organizationId
      createdAt
      updatedAt
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
    }
  }
`;
export const onCreateDashboard = /* GraphQL */ `
  subscription OnCreateDashboard {
    onCreateDashboard {
      id
      organizationId
      createdAt
      updatedAt
      data
    }
  }
`;
export const onUpdateDashboard = /* GraphQL */ `
  subscription OnUpdateDashboard {
    onUpdateDashboard {
      id
      organizationId
      createdAt
      updatedAt
      data
    }
  }
`;
export const onDeleteDashboard = /* GraphQL */ `
  subscription OnDeleteDashboard {
    onDeleteDashboard {
      id
      organizationId
      createdAt
      updatedAt
      data
    }
  }
`;
