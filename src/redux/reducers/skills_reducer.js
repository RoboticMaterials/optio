import {
    GET_SKILLS,
    GET_SKILLS_STARTED,
    GET_SKILLS_SUCCESS,
    GET_SKILLS_FAILURE,

    POST_SKILLS,
    POST_SKILLS_STARTED,
    POST_SKILLS_SUCCESS,
    POST_SKILLS_FAILURE,

    PUT_SKILLS,
    PUT_SKILLS_STARTED,
    PUT_SKILLS_SUCCESS,
    PUT_SKILLS_FAILURE,

    DELETE_SKILLS,
    DELETE_SKILLS_STARTED,
    DELETE_SKILLS_SUCCESS,
    DELETE_SKILLS_FAILURE
} from '../types/skills_types'

import { deepCopy } from '../../methods/utils/utils.js'


const defaultState = {
  skills: [],
  error: {},
  pending: false,
  currentSkill : {},
  skillUpdated : false,
  allFieldsFilled: false,
};

let index;

export default function skillsReducer(state = defaultState, action) {
    let skillsClone = {}

    switch (action.type) {

        case 'SKILL_SELECTED':
            return {
                ...state,
                currentSkill: action.payload
            }

        case 'ALL_FIELDS_FILLED':
            return{
                ...state,
                allFieldsFilled: action.payload
            }

        case 'SKILL_UPDATED':
            return{
                ...state,
                skillUpdated: action.payload
            }

        case GET_SKILLS:
            break;

        case GET_SKILLS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

        case GET_SKILLS_SUCCESS:
            return  Object.assign({}, state, {
                skills: [...action.payload],
                pending: false
            });

        case GET_SKILLS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_SKILLS:
            break;

        case POST_SKILLS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

        case POST_SKILLS_SUCCESS:
            skillsClone = deepCopy(state.skills);
            return  Object.assign({}, state, {
                skills: [...skillsClone, action.payload],
                pending: false
            });

        case POST_SKILLS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case PUT_SKILLS:
            break;

        case PUT_SKILLS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

        case PUT_SKILLS_SUCCESS:
            skillsClone = deepCopy(state.skills);
            index = skillsClone.findIndex(s => {
                return s.id === action.payload.id
            });
            skillsClone.splice(index, 1, action.payload);
            return  Object.assign({}, state, {
                skills: skillsClone,
                pending: false
            });

        case PUT_SKILLS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_SKILLS:
            break;

        case DELETE_SKILLS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

        case DELETE_SKILLS_SUCCESS:
            skillsClone = deepCopy(state.skills);
            index = skillsClone.findIndex(s => {
                return s.id === action.payload.skillId;
            })
            skillsClone.splice(index, 1);
            return  Object.assign({}, state, {
                skills: skillsClone,
                pending: false
            });

        case DELETE_SKILLS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        default:
            return state;

    }
}
