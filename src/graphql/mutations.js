/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const manageTaskQueue = /* GraphQL */ `
  mutation ManageTaskQueue(
    $id: ID!
    $task_id: ID!
    $lot_id: ID!
    $quantity: Int!
  ) {
    manageTaskQueue(
      id: $id
      task_id: $task_id
      lot_id: $lot_id
      quantity: $quantity
    ) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createOrganization = /* GraphQL */ `
  mutation CreateOrganization(
    $input: CreateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    createOrganization(input: $input, condition: $condition) {
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
export const updateOrganization = /* GraphQL */ `
  mutation UpdateOrganization(
    $input: UpdateOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    updateOrganization(input: $input, condition: $condition) {
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
export const deleteOrganization = /* GraphQL */ `
  mutation DeleteOrganization(
    $input: DeleteOrganizationInput!
    $condition: ModelOrganizationConditionInput
  ) {
    deleteOrganization(input: $input, condition: $condition) {
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
export const createStation = /* GraphQL */ `
  mutation CreateStation(
    $input: CreateStationInput!
    $condition: ModelStationConditionInput
  ) {
    createStation(input: $input, condition: $condition) {
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
  }
`;
export const updateStation = /* GraphQL */ `
  mutation UpdateStation(
    $input: UpdateStationInput!
    $condition: ModelStationConditionInput
  ) {
    updateStation(input: $input, condition: $condition) {
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
  }
`;
export const deleteStation = /* GraphQL */ `
  mutation DeleteStation(
    $input: DeleteStationInput!
    $condition: ModelStationConditionInput
  ) {
    deleteStation(input: $input, condition: $condition) {
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
  }
`;
export const createPosition = /* GraphQL */ `
  mutation CreatePosition(
    $input: CreatePositionInput!
    $condition: ModelPositionConditionInput
  ) {
    createPosition(input: $input, condition: $condition) {
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
export const updatePosition = /* GraphQL */ `
  mutation UpdatePosition(
    $input: UpdatePositionInput!
    $condition: ModelPositionConditionInput
  ) {
    updatePosition(input: $input, condition: $condition) {
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
export const deletePosition = /* GraphQL */ `
  mutation DeletePosition(
    $input: DeletePositionInput!
    $condition: ModelPositionConditionInput
  ) {
    deletePosition(input: $input, condition: $condition) {
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
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
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
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
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
  }
`;
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
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
  }
`;
export const createProcess = /* GraphQL */ `
  mutation CreateProcess(
    $input: CreateProcessInput!
    $condition: ModelProcessConditionInput
  ) {
    createProcess(input: $input, condition: $condition) {
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
export const updateProcess = /* GraphQL */ `
  mutation UpdateProcess(
    $input: UpdateProcessInput!
    $condition: ModelProcessConditionInput
  ) {
    updateProcess(input: $input, condition: $condition) {
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
export const deleteProcess = /* GraphQL */ `
  mutation DeleteProcess(
    $input: DeleteProcessInput!
    $condition: ModelProcessConditionInput
  ) {
    deleteProcess(input: $input, condition: $condition) {
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
export const createObject = /* GraphQL */ `
  mutation CreateObject(
    $input: CreateObjectInput!
    $condition: ModelObjectConditionInput
  ) {
    createObject(input: $input, condition: $condition) {
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
export const updateObject = /* GraphQL */ `
  mutation UpdateObject(
    $input: UpdateObjectInput!
    $condition: ModelObjectConditionInput
  ) {
    updateObject(input: $input, condition: $condition) {
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
export const deleteObject = /* GraphQL */ `
  mutation DeleteObject(
    $input: DeleteObjectInput!
    $condition: ModelObjectConditionInput
  ) {
    deleteObject(input: $input, condition: $condition) {
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
export const createCard = /* GraphQL */ `
  mutation CreateCard(
    $input: CreateCardInput!
    $condition: ModelCardConditionInput
  ) {
    createCard(input: $input, condition: $condition) {
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
  }
`;
export const updateCard = /* GraphQL */ `
  mutation UpdateCard(
    $input: UpdateCardInput!
    $condition: ModelCardConditionInput
  ) {
    updateCard(input: $input, condition: $condition) {
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
  }
`;
export const deleteCard = /* GraphQL */ `
  mutation DeleteCard(
    $input: DeleteCardInput!
    $condition: ModelCardConditionInput
  ) {
    deleteCard(input: $input, condition: $condition) {
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
  }
`;
export const createSettings = /* GraphQL */ `
  mutation CreateSettings(
    $input: CreateSettingsInput!
    $condition: ModelSettingsConditionInput
  ) {
    createSettings(input: $input, condition: $condition) {
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
export const updateSettings = /* GraphQL */ `
  mutation UpdateSettings(
    $input: UpdateSettingsInput!
    $condition: ModelSettingsConditionInput
  ) {
    updateSettings(input: $input, condition: $condition) {
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
export const deleteSettings = /* GraphQL */ `
  mutation DeleteSettings(
    $input: DeleteSettingsInput!
    $condition: ModelSettingsConditionInput
  ) {
    deleteSettings(input: $input, condition: $condition) {
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
export const createLotTemplate = /* GraphQL */ `
  mutation CreateLotTemplate(
    $input: CreateLotTemplateInput!
    $condition: ModelLotTemplateConditionInput
  ) {
    createLotTemplate(input: $input, condition: $condition) {
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
export const updateLotTemplate = /* GraphQL */ `
  mutation UpdateLotTemplate(
    $input: UpdateLotTemplateInput!
    $condition: ModelLotTemplateConditionInput
  ) {
    updateLotTemplate(input: $input, condition: $condition) {
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
export const deleteLotTemplate = /* GraphQL */ `
  mutation DeleteLotTemplate(
    $input: DeleteLotTemplateInput!
    $condition: ModelLotTemplateConditionInput
  ) {
    deleteLotTemplate(input: $input, condition: $condition) {
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
export const createDevice = /* GraphQL */ `
  mutation CreateDevice(
    $input: CreateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    createDevice(input: $input, condition: $condition) {
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
export const updateDevice = /* GraphQL */ `
  mutation UpdateDevice(
    $input: UpdateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    updateDevice(input: $input, condition: $condition) {
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
export const deleteDevice = /* GraphQL */ `
  mutation DeleteDevice(
    $input: DeleteDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    deleteDevice(input: $input, condition: $condition) {
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
export const createStatus = /* GraphQL */ `
  mutation CreateStatus(
    $input: CreateStatusInput!
    $condition: ModelStatusConditionInput
  ) {
    createStatus(input: $input, condition: $condition) {
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
export const updateStatus = /* GraphQL */ `
  mutation UpdateStatus(
    $input: UpdateStatusInput!
    $condition: ModelStatusConditionInput
  ) {
    updateStatus(input: $input, condition: $condition) {
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
export const deleteStatus = /* GraphQL */ `
  mutation DeleteStatus(
    $input: DeleteStatusInput!
    $condition: ModelStatusConditionInput
  ) {
    deleteStatus(input: $input, condition: $condition) {
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
export const createTaskQueue = /* GraphQL */ `
  mutation CreateTaskQueue(
    $input: CreateTaskQueueInput!
    $condition: ModelTaskQueueConditionInput
  ) {
    createTaskQueue(input: $input, condition: $condition) {
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
export const updateTaskQueue = /* GraphQL */ `
  mutation UpdateTaskQueue(
    $input: UpdateTaskQueueInput!
    $condition: ModelTaskQueueConditionInput
  ) {
    updateTaskQueue(input: $input, condition: $condition) {
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
export const deleteTaskQueue = /* GraphQL */ `
  mutation DeleteTaskQueue(
    $input: DeleteTaskQueueInput!
    $condition: ModelTaskQueueConditionInput
  ) {
    deleteTaskQueue(input: $input, condition: $condition) {
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
export const createTaskQueueEvents = /* GraphQL */ `
  mutation CreateTaskQueueEvents(
    $input: CreateTaskQueueEventsInput!
    $condition: ModelTaskQueueEventsConditionInput
  ) {
    createTaskQueueEvents(input: $input, condition: $condition) {
      id
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
export const updateTaskQueueEvents = /* GraphQL */ `
  mutation UpdateTaskQueueEvents(
    $input: UpdateTaskQueueEventsInput!
    $condition: ModelTaskQueueEventsConditionInput
  ) {
    updateTaskQueueEvents(input: $input, condition: $condition) {
      id
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
export const deleteTaskQueueEvents = /* GraphQL */ `
  mutation DeleteTaskQueueEvents(
    $input: DeleteTaskQueueEventsInput!
    $condition: ModelTaskQueueEventsConditionInput
  ) {
    deleteTaskQueueEvents(input: $input, condition: $condition) {
      id
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
export const createDashboard = /* GraphQL */ `
  mutation CreateDashboard(
    $input: CreateDashboardInput!
    $condition: ModelDashboardConditionInput
  ) {
    createDashboard(input: $input, condition: $condition) {
      id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
export const updateDashboard = /* GraphQL */ `
  mutation UpdateDashboard(
    $input: UpdateDashboardInput!
    $condition: ModelDashboardConditionInput
  ) {
    updateDashboard(input: $input, condition: $condition) {
      id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
export const deleteDashboard = /* GraphQL */ `
  mutation DeleteDashboard(
    $input: DeleteDashboardInput!
    $condition: ModelDashboardConditionInput
  ) {
    deleteDashboard(input: $input, condition: $condition) {
      id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
