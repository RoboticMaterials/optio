import {gql} from "@apollo/client";


const typeDefs = gql`
  # Your schema will go here
  input StationInput {
    name: String!
    schema: String!
    type: String!
    pos_x: Float
    pos_y: Float
    rotation: Int!
    x: Float!
    y: Float!
    mapId: String!
    children: [String]!
    dashboards: [String]!
  }
`;


export const createStation = gql`mutation CreateStation($input: StationInput!) {
  createStation(input: $input) {
    id
    name
  }
}`
