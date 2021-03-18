/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
