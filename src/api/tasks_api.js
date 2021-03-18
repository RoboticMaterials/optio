/**
 * All of the API calls for Tasks
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 18 20201
 * Edited by: Daniel Castillo
 * 
 */

// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

import getUserOrgId from './user_api'

// import the GraphQL queries, mutations and subscriptions
import { tasksByOrgId } from '../graphql/queries';
import { createTask, updateTask } from '../graphql/mutations';
import { deleteTask as deleteTaskByID } from '../graphql/mutations';

export async function getTasks() {
  try {

    const userOrgId = await getUserOrgId()

    const res = await API.graphql({
      query: tasksByOrgId,
      variables: { organizationId: userOrgId }
    })

    let GQLdata = []

    res.data.TasksByOrgId.items.forEach(task => {
      GQLdata.push( {
        ...task,
        device_types: JSON.parse(task.device_types),
        processes: JSON.parse(task.processes),
        load: JSON.parse(task.load),
        unload: JSON.parse(task.unload),
        route_object: JSON.parse(task.route_object)
      })
    });
    
    return GQLdata;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function getTask(id) {
  try {

    const userOrgId = await getUserOrgId()

    const res = await API.graphql({
      query: tasksByOrgId,
      variables:{
        organizationId: userOrgId,
        filter: {_id: {eq: id}}
      }
    })

    return res.data.listTasks.items[0]
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function postTask(task) {
  try {

    const userOrgId = await getUserOrgId()

    const input = {
      ...task,
      organizationId: userOrgId,
      device_types: JSON.stringify(task.device_types),
      processes: JSON.stringify(task.processes),
      load: JSON.stringify(task.load),
      unload: JSON.stringify(task.unload),
      obj: task.obj === undefined ? '' : task.obj.toString(),
      route_object: task.route_object === undefined ? '{}' : JSON.stringify(task.route_object)
    }

    const dataJson = await API.graphql({
      query: createTask,
      variables: { input: input }
    })

    console.log(dataJson)

    return dataJson.data.createTask;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function deleteTask(id) {
  try {

    const userOrgId = await getUserOrgId()

    const res = await API.graphql({
      query: tasksByOrgId,
      variables:{
        organizationId: userOrgId,
        filter: {_id: {eq: id}}
      }
    })

    const dataJson = await API.graphql({
      query: deleteTaskByID,
      variables: { input: {id: res.data.TasksByOrgId.items[0].id} }
    })

    return dataJson;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function putTask(task, id) {
  try {
    const input = {
      ...task,
      device_types: JSON.stringify(task.device_types),
      processes: JSON.stringify(task.processes),
      load: JSON.stringify(task.load),
      unload: JSON.stringify(task.unload),
      obj: task.obj === undefined ? '' : task.obj.toString(),
      route_object: JSON.stringify(task.route_object)
    }

    delete input.createdAt
    delete input.updatedAt

    const dataJson = await API.graphql({
      query: updateTask,
      variables: { input: input }
    })
    
    return dataJson.data.updateTask;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}