// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { listPositions } from '../graphql/queries'
import { 
  createPosition, 
  updatePosition 
} from '../graphql/mutations'

import { deletePosition as deletePositionbyID } from '../graphql/mutations'

export async function getPositions() {
  try {

    const res = await API.graphql({
      query: listPositions
    })
    
    const GQLdata = res.data.listPositions.items

    return GQLdata;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function deletePosition(ID) {
  try {

    const id = {id: ID}

    const dataJson = await API.graphql({
      query: deletePositionbyID,
      variables: { input: id }
    })

    return dataJson;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function postPosition(position) {
  try {

    // Amplify!

    const input = {
      ...position,
      pos_x: parseFloat(position.pos_x),
      pos_y: parseFloat(position.pos_y),
      _id: position._id.toString(),
      id: position._id
    }

    delete input.neame

    const pos = await API.graphql({
      query: createPosition,
      variables: { input: input }
    })

    return pos;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function putPosition(position, ID) {
  try {
    const input = {
      ...position,
      pos_x: parseFloat(position.pos_x),
      pos_y: parseFloat(position.pos_y),
      x: parseInt(position.x),
      y: parseInt(position.y),
      _id: position._id.toString()
    }

    // delete input.id
    delete input.createdAt
    delete input.updatedAt

    console.log(input)

    const dataJson = await API.graphql({
      query: updatePosition,
      variables: { input: input }
    })

    return dataJson;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}