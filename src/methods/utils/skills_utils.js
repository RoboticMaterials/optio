import React, { Text } from 'react'
import { useDispatch, useSelector } from "react-redux";

import { deepCopy } from './utils'

/**
 * inserts \n chars to split a string at a certain length (while not splitting words)
 * 
 * @param {string} str 
 * @param {int} maxWidth 
 */
function wrapText(str, maxWidth) {
    function testWhite(x) {
        var white = new RegExp(/^\s$/);
        return white.test(x.charAt(0));
    };

    let newLineStr = "\n"; 
    let done = false; 
    let res = '';
    while (str.length > maxWidth) {                 
        let found = false;
        // Inserts new line at first whitespace of the line
        for (let i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

    }

    return res + str;
}

/**
 * Generates a string-based summary of the condition
 * 
 * @param {object} condition skill's condition - differs in the case of condition templates
 * @param {object} skill 
 * @param {array} skills 
 * @param {array} objects 
 * @param {array} locations 
 * @param {boolean} bound maximum length of a line
 * @param {boolean} embolden should the string have bold text
 */
export const conditionSummary = (condition, skill, skills, objects, locations, bound, embolden) => {
    
    let summary
    switch (condition.type) {
        case 'object_at_location':

            let location = ''
            try {
                if (condition.location == 'cart'){
                    location = 'Cart'
                }else {
                    location = locations.filter(location => location.id == condition.location);
                    if (location.length) {location = location[0].name}
                    else {location = ''}
                }
            } catch (error) {
                location = ''
            }


            let object, quantity;
            if (condition.object == 'cart') {
                object = 'Cart';
                quantity = '';
            } else {
                object = objects.filter(object => object.id == condition.object);
                if (object.length) {object = object[0].name}
                else {object = ''}
                quantity = condition.quantity;
            }
            
            if (embolden != false) {
                summary = `${quantity ? '<b>' + quantity + '</b> x ' : ''}` + '<b>' + object + '</b> at <b>' + location + '</b>'
            } else{
                summary = `${quantity ? quantity + ' x ' : ''}` + object + ' at ' + location
            }

            if (bound != false) {
                return wrapText(summary, 56) // Wrapping at specific point allows Tree/Links to know how many lines the summary is
            } else {
                return summary + '\n'
            }
            

        case 'hil_complete':
            let name;
            if (!!skills) {
                if (!!skill.skillId) {
                    name = skills.filter(s => s.id == skill.skillId);
                    if (name.length) {name = name[0].name}
                    else {name = ''}
                } else {
                    name = 'New HIL'
                }
            } else {
                name = skill.name;
            }

            if (embolden != false) {
                summary = 'HIL <b>' + name + '</b> complete'
            } else {
                summary = 'HIL ' + name + ' complete'
            }
            
            if (bound != false) {
                return wrapText(summary, 56) // Wrapping at specific point allows Tree/Links to know how many lines the summary is
            } else {
                return summary + '\n'
            }return wrapText(summary, 56) // Wrapping at specific point allows Tree/Links to know how many lines the summary is
    }
  };


export function getHILSkills(skills) {
    let postcond;
    let hils = [];

    for (var i=0; i<skills.length; i++) {
        try {
            if (!!skills[i].template && skills[i].template == 'human_in_the_loop') {
                hils.push(skills[i]);
            }
        } catch (error) {
            
        }

    }

    return hils;
}

export function methodLabel(method, verbose=false) {
    switch (method) {
        case "null":
            return "Goal"
        case "move_cart_to_x":
            return "Drive"
        case "human_in_the_loop":
            if (verbose) {
                return "Human in the Loop"
            } else {
                return "HIL"
            }            
        case "pick_object":
            return "Pick"
        case "place_object":
            return "Place"
        case "load":
            return "Load"
        case "unload":
            return "Unload"
        case "human_load":
            return "Human Load"
        case "human_unload":
            return "Human Unload"
        case "robot_load":
            return "Autonomous Load"
        case "robot_unload":
            return "Autonomous Unload"
        default:
            return "Auto"
    }
}

export function skillName(skill, locations, skills) {

    let filteredSkills = skills.filter(skillz => skillz.id == skill.skillId)
    let skillName = !!filteredSkills[0] && filteredSkills[0].name
    return skillName;
}

export function parseCondition(cond, skills) {
    var desc = cond.type + " "
    Object.entries(cond).forEach((entry, index, entries) => {
        if(entry[0] != "type" && entry[0] != "id") {
            desc += '[' + entry[0] + ': ' + entry[1] + ']';
        }
    });
    switch (cond.type) {
        case "object_at_location":
            if (cond.object == 'cart') { desc = 'Cart at \''+cond.location+'\'';}
            else if (cond.location == 'hand') { desc = '\''+cond.object+'\' in Hand';}
            else { desc = '\''+cond.object+'\' at \''+cond.location+'\''}
            break;
        case "stack_complete":
            desc = "Skill '"+cond.name+"' complete";
            break;
        case "hil_complete":
            desc = "HIL '"+cond.name+"' complete";
            break;
    }
    return desc
}

export const getCurrentSkill = (skills, skillID) => {


    const skillIndex = skills.findIndex(d => {
        return d.id == skillID
    })

    return deepCopy(skills[skillIndex])
}