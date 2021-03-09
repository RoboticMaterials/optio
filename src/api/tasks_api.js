// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { listTasks } from '../graphql/queries';
import { createTask, updateTask } from '../graphql/mutations';
import { deleteTask as deleteTaskByID } from '../graphql/mutations';

export async function getTasks() {
  try {

    const res = await API.graphql({
      query: listTasks
    })

    let GQLdata = []

    res.data.listTasks.items.forEach(task => {
      GQLdata.push( {
        ...task,
        device_types: JSON.parse(task.device_types),
        processes: JSON.parse(task.processes),
        load: JSON.parse(task.load),
        unload: JSON.parse(task.unload),
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
    const res = await API.graphql({
      query: listTasks,
      variables:{
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
    const input = {
      ...task,
      device_types: JSON.stringify(task.device_types),
      processes: JSON.stringify(task.processes),
      load: JSON.stringify(task.load),
      unload: JSON.stringify(task.unload),
      obj: task.obj === undefined ? '' : task.obj.toString()
    }

    const dataJson = await API.graphql({
      query: createTask,
      variables: { input: input }
    })

    return dataJson;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function deleteTask(id) {
  try {

    const res = await API.graphql({
      query: listTasks,
      variables:{
        filter: {_id: {eq: id}}
      }
    })

    const dataJson = await API.graphql({
      query: deleteTaskByID,
      variables: { input: {id: res.data.listTasks.items[0].id} }
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
      obj: task.obj === undefined ? '' : task.obj.toString()
    }

    delete input.createdAt
    delete input.updatedAt

    const dataJson = await API.graphql({
      query: updateTask,
      variables: { input: input }
    })
    
    return dataJson;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}