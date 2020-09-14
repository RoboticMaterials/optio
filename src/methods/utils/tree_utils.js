import { randomHash, deepCopy } from './utils.js'


export function treeSearch(tree, id) {
  for (let i = 0; i < tree.children.length; i++) {
     if (tree.children[i]._id === id) {
       return tree.children[i];
     }
     else if (tree.children[i].children.length) {
       const result = treeSearch(tree.children[i].children, id);
       if(result) return result;
     }
   }
}


export function setObjectInTree(tree, id, newObject) {
    if (tree._nodeId === id) {
        tree = newObject
        return tree;
    }
    for (let i = 0; i < tree.children.length; i++) {
       if (tree.children[i]._nodeId === id) {
         tree.children[i] = newObject;
         return tree;
       }
       else if (tree.children[i].children.length) {
         const result = treeSearch(tree.children[i].children, id);
         if(result) {return result};
       }
     }
}

let prev = null;
let oldPrev = null;
export function flattenTree(tree) {
    prev = {};
    postOrderFlatten(tree);
    return prev;
}
function postOrderFlatten(node) {
    if (!node) {return;}
    if (!node.children) {return;}
    for (let i=0; i<node.children.length; i++) {
        postOrderFlatten(node.children[i])
    }
    oldPrev = Object.assign(prev);
    prev = node;
    if (!!oldPrev.action) {
        prev.children = [oldPrev];
    }
}

export function idifyTree(tree) {
    prev = {};
    postOrderIdify(tree);
    return prev;
}
function postOrderIdify(node) {
    if (!node) {return;}
    if (!node.children) {return;}
    for (let i=0; i<node.children.length; i++) {
        postOrderIdify(node.children[i])
    }
    oldPrev = Object.assign(prev);
    prev = {
        _id : node._id,
        children : node.children
    };
}

let skills = null;
let skill;
let height = 0;
export function tieSkillsToIds(tree, _skills) {
    prev = {};
    skills = _skills;
    return postOrderTieToId(tree);
}
function postOrderTieToId(node) {
    console.log('NODE', node);
    for (let i=0; i<node.children.length; i++) {
        node.children[i] = postOrderTieToId(node.children[i]);
    }
    if (!!node._id && node._id != "None") {
        skill = deepCopy(skills.find(skill => skill._id.$oid == node._id));
        skill.children = node.children;
        skill.name = randomHash();
        return skill;
    } else {
        return {
            name : randomHash(),
            action : {},
            userDefPreconditions : [],
            preconditions : [],
            postconditions : [{}, node.unmet_condition],
            children : []
        }
    }
}


let callback = null
export function traverseTree(tree, _callback) {
    prev = {};
    callback = _callback;
    postOrderTraversal(tree);
    return prev;
}
function postOrderTraversal(node) {
    if (!node) {return;}
    if (!node.children) {return;}
    for (let i=0; i<node.children.length; i++) {
        postOrderTraversal(node.children[i])
    }
    oldPrev = Object.assign(prev);
    prev = node;
    callback(node);
}

export function upwardTraversal(tree, _callback) {
    prev = {};
    callback = _callback;
    upwardTraverse(tree);
    return prev;
}
function upwardTraverse(node) {
    if (!node) {return;}
    if (!node.parent) {return;}
    upwardTraverse(node.parent);
    oldPrev = Object.assign(prev);
    prev = node;
    callback(node);
}