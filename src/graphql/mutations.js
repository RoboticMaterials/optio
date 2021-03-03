/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createStation = /* GraphQL */ `
  mutation CreateStation(
    $input: CreateStationInput!
    $condition: ModelStationConditionInput
  ) {
    createStation(input: $input, condition: $condition) {
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
export const updateStation = /* GraphQL */ `
  mutation UpdateStation(
    $input: UpdateStationInput!
    $condition: ModelStationConditionInput
  ) {
    updateStation(input: $input, condition: $condition) {
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
export const deleteStation = /* GraphQL */ `
  mutation DeleteStation(
    $input: DeleteStationInput!
    $condition: ModelStationConditionInput
  ) {
    deleteStation(input: $input, condition: $condition) {
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
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
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
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
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
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
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
