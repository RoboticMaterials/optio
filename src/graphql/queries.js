/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getStation = /* GraphQL */ `
  query GetStation($id: ID!) {
    getStation(id: $id) {
      id
      name
      schema
      type
      pox_x
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
        name
        schema
        type
        pox_x
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
