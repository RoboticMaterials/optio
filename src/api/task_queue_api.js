import log from "../logger";

// import the amplify modules needed
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { listTaskQueues } from '../graphql/queries';
import { createTaskQueue, updateTaskQueue } from '../graphql/mutations';
import { deleteTaskQueue as deleteTaskQueueByID } from '../graphql/mutations';

export async function getTaskQueue() {
  try {

    // get the data
    const res = await API.graphql({
      query: listTaskQueues
    })

    const GQLdata = []

    // change the data into json
    res.data.listTaskQueues.items.forEach(task => {
      if (task.custom_task){
        GQLdata.push( {
          ...task,
          custom_task: JSON.parse(task.custom_task) 
        })
      }else{
        GQLdata.push(task)
      }
    });

    return GQLdata;
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
    log.debug("error", error);
    throw error;
  }
}

export async function postTaskQueue(taskQueueItem) {
  try {

    let input

    if (taskQueueItem.custom_task){
      input = {
        ...taskQueueItem,
        custom_task: JSON.stringify(taskQueueItem.custom_task),
      }
    }else{
      input = taskQueueItem
    }

    delete input.neame

    const dataJSON = await API.graphql({
      query: createTaskQueue,
      variables: { input: input }
    })

    return dataJSON;

  } catch (error) { 
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.error("postTaskQueue: error.response.data", error.response.data);
      console.error(
        "postTaskQueue: error.response.status",
        error.response.status
      );
      console.error(
        "postTaskQueue: error.response.headers",
        error.response.headers
      );
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.error("postTaskQueue: error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.error("postTaskQueue: error.message", error.message);
    }
    console.error("postTaskQueue: error", error);
    throw error;
  }
}

export async function deleteTaskQueueAll() {
  try {

    const res = await API.graphql({
      query: listTaskQueues
    })

    await res.data.listTaskQueues.items.forEach(task => {

      const id = {id: task.id}

      API.graphql({
        query: deleteTaskQueueByID,
        variables: { input: id }
      })
        
    });

    return 'All Deleted';
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.error(
        "deleteTaskQueueAll: error.response.data",
        error.response.data
      );
      console.error(
        "deleteTaskQueueAll: error.response.status",
        error.response.status
      );
      console.error(
        "deleteTaskQueueAll: error.response.headers",
        error.response.headers
      );
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.error("deleteTaskQueueAll: error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.error("deleteTaskQueueAll: error.message", error.message);
    }
    console.error("deleteTaskQueueAll: error", error);
    throw error;
  }
}

export async function deleteTaskQueueItem(id) {
  try {

    const res = await API.graphql({
      query: listTaskQueues,
      variables:{
        filter: {_id: {eq: id}}
      }
    })

    console.log(res)

    await API.graphql({
      query: deleteTaskQueueByID,
      variables: { input: {id: res.data.listTaskQueues.items[0].id} }
    })

    return 'All Deleted';
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.error(
        "deleteTaskQueueItem: error.response.data",
        error.response.data
      );
      console.error(
        "deleteTaskQueueItem: error.response.status",
        error.response.status
      );
      console.error(
        "deleteTaskQueueItem: error.response.headers",
        error.response.headers
      );
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.error("deleteTaskQueueItem: error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.error("deleteTaskQueueItem: error.message", error.message);
    }
    throw error;
  }
}

export async function putTaskQueueItem(item, ID) {
  try {

    const dataJson = await API.graphql({
      query: updateTaskQueue,
      variables: { input: item }
    })

    console.log(dataJson)

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
    log.debug("error", error);
  }
}
