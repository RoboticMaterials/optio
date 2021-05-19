export function getActionName(actionType) {
 if (typeof actionType !== 'string') {
   return null;
 }

 return actionType
   .split("_")
   .slice(0, -1)
   .join("_");
}

export const createActionType = (items) => {
    let actionType = ''

    items.forEach(item => actionType += item)

    return actionType
}