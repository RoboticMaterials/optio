"""
This is the task module and supports all the REST actions for the
task data
"""

from flask import make_response, abort
from bson.json_util import dumps
from bson.objectid import ObjectId
from pymongo import MongoClient

# from context import rmengine

client = MongoClient('localhost:27017')
db = client.ContactDB
collection = db.tasks
skills_collection = db.skills

# collection.delete_many({})

def read_all(map_id):
    """
    This function responds to a request for /api/tasks
    with the complete lists of tasks

    :return:        json string of list of tasks
    """
    # Create the list of tasks from our data
    tasks = collection.find({'map_id': map_id})
    return dumps(tasks)


def read_one(task_id):
    """
    This function responds to a request for /api/tasks/{task_id}
    with one matching task from tasks

    :param task_id:   Id of task to find
    :return:            task matching id
    """
    # Create the list of tasks from our data
    task = collection.find_one({"_id": task_id})
    if task:
        return dumps(task)
    # Otherwise, nope, didn't find that task
    else:
        abort(
            404,
            "Task not found for Id: {task_id}".format(task_id=task_id),
        )


# def plan_task(task_dict):
#     skill_list = list(skills_collection.find())
    
#     task = rmengine.task.Task() 
#     task.convert_dict_to_task(task_dict)
#     task.create_task_tree(skill_list)
#     task.print_task()

#     #Convert to dict
#     task_dict = task.convert_task_to_dict()
        
#     return task_dict
        
def create(task):
    """
    This function creates a new task in the tasks structure
    based on the passed in task data

    :param task:  task to create in tasks structure
    :return:        201 on success, 406 on task exists
    """
    # Send to data base
    result = collection.insert_one(task)
    task_with_id = collection.find_one({'_id' : result.inserted_id})
    return dumps(task_with_id)    
    
#     rtnd_task = collection.find({"name" : task["name"]})
#     # Can we insert this task?
#     if rtnd_task.count() == 0:
#         # Plan Task
#         # planned_task_dict = plan_task(task)
        
#         # Send to data base
#         result = collection.insert_one(task)
#         task_with_id = collection.find_one({'_id' : result.inserted_id})
#         return dumps(task_with_id)

#     # Otherwise, nope, task exists already
#     else:
#         abort(
#             409,
#             "Task {name} exists already".format(
#                 name=task["name"]
#             ),
#         )

def update(task_id, task):
    """
    This function updates an existing task in the tasks structure
    Throws an error if a task with the name we want to update to
    already exists in the database.

    :param task_id:   Id of the task to update in the tasks structure
    :param task:      task to update
    :return:            updated task structure
    """
    # Create the list of tasks from our data
    test_task = collection.find({"_id": task_id})

    # Are we trying to find a schedule that does not exist?
    if test_task is None:
        abort(
            404,
            "Task not found for Id: {task_id}".format(task_id=task_id),
        )

    # Otherwise go ahead and update!
    else:
        # Plan Task
        # planned_task_dict = plan_task(task)
        # Send to data base
        result = collection.replace_one({"_id" : task_id}, task)
        task_with_id = collection.find_one({"_id" : task_id})
        return dumps(task_with_id)


def delete(task_id):
    """
    This function deletes a task from the tasks structure

    :param task_id:   Id of the task to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_task = collection.find({"_id" : task_id})
    # Can we insert this task?
    if len(list(rtnd_task.clone()))  != 0:
        collection.delete_one({"_id" : task_id})

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Task not found for Id: {task_id}".format(task_id=task_id),
        )
