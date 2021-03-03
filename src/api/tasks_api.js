import * as log from "loglevel";

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
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.error("error.response.data", error.response.data);
      console.error("error.response.status", error.response.status);
      console.error("error.response.headers", error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.error("error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.error("error.message", error.message);
    }
    throw error;
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
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.error("getTask: error.response.data", error.response.data);
      console.error("getTask: error.response.status", error.response.status);
      console.error("getTask: error.response.headers", error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.error("getTask: error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.error("getTask: error.message", error.message);
    }
    throw error;
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
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.error("postTask: error.response.data", error.response.data);
      console.error("postTask: error.response.status", error.response.status);
      console.error("postTask: error.response.headers", error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.error("postTask: error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.error("postTask: error.message", error.message);
    }
    throw error;
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
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      log.debug("error.response.data", error.response.data);
      log.debug("error.response.status", error.response.status);
      log.debug("error.response.headers", error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      log.debug("error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      log.debug("error.message", error.message);
    }
    throw error;
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
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      log.debug("error.response.data", error.response.data);
      log.debug("error.response.status", error.response.status);
      log.debug("error.response.headers", error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      log.debug("error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      log.debug("error.message", error.message);
    }
    throw error;
  }
}
