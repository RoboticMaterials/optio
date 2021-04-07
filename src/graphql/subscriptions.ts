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
export const onUpdateStation = /* GraphQL */ `
  subscription OnUpdateStation {
    onUpdateStation {
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
export const onDeleteStation = /* GraphQL */ `
  subscription OnDeleteStation {
    onDeleteStation {
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
export const onCreateStationEvent = /* GraphQL */ `
  subscription OnCreateStationEvent {
    onCreateStationEvent {
      id
      organizationId
      createdAt
      updatedAt
      object
      outgoing
      quantity
      station
      time
    }
  }
`;
export const onUpdateStationEvent = /* GraphQL */ `
  subscription OnUpdateStationEvent {
    onUpdateStationEvent {
      id
      organizationId
      createdAt
      updatedAt
      object
      outgoing
      quantity
      station
      time
    }
  }
`;
export const onDeleteStationEvent = /* GraphQL */ `
  subscription OnDeleteStationEvent {
    onDeleteStationEvent {
      id
      organizationId
      createdAt
      updatedAt
      object
      outgoing
      quantity
      station
      time
    }
  }
`;
export const onCreatePosition = /* GraphQL */ `
  subscription OnCreatePosition {
    onCreatePosition {
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
export const onUpdatePosition = /* GraphQL */ `
  subscription OnUpdatePosition {
    onUpdatePosition {
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
export const onDeletePosition = /* GraphQL */ `
  subscription OnDeletePosition {
    onDeletePosition {
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
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask {
    onUpdateTask {
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask {
    onDeleteTask {
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
export const onCreateProcess = /* GraphQL */ `
  subscription OnCreateProcess {
    onCreateProcess {
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
export const onUpdateProcess = /* GraphQL */ `
  subscription OnUpdateProcess {
    onUpdateProcess {
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
export const onDeleteProcess = /* GraphQL */ `
  subscription OnDeleteProcess {
    onDeleteProcess {
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
export const onCreateObject = /* GraphQL */ `
  subscription OnCreateObject {
    onCreateObject {
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
export const onUpdateObject = /* GraphQL */ `
  subscription OnUpdateObject {
    onUpdateObject {
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
export const onDeleteObject = /* GraphQL */ `
  subscription OnDeleteObject {
    onDeleteObject {
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
export const onCreateCard = /* GraphQL */ `
  subscription OnCreateCard {
    onCreateCard {
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
export const onUpdateCard = /* GraphQL */ `
  subscription OnUpdateCard {
    onUpdateCard {
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
export const onDeleteCard = /* GraphQL */ `
  subscription OnDeleteCard {
    onDeleteCard {
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
export const onUpdateDevice = /* GraphQL */ `
  subscription OnUpdateDevice {
    onUpdateDevice {
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
export const onDeleteDevice = /* GraphQL */ `
  subscription OnDeleteDevice {
    onDeleteDevice {
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
export const onCreateStatus = /* GraphQL */ `
  subscription OnCreateStatus {
    onCreateStatus {
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
export const onUpdateStatus = /* GraphQL */ `
  subscription OnUpdateStatus {
    onUpdateStatus {
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
export const onDeleteStatus = /* GraphQL */ `
  subscription OnDeleteStatus {
    onDeleteStatus {
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
export const onCreateTaskQueue = /* GraphQL */ `
  subscription OnCreateTaskQueue {
    onCreateTaskQueue {
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
export const onUpdateTaskQueue = /* GraphQL */ `
  subscription OnUpdateTaskQueue {
    onUpdateTaskQueue {
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
export const onDeleteTaskQueue = /* GraphQL */ `
  subscription OnDeleteTaskQueue {
    onDeleteTaskQueue {
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
