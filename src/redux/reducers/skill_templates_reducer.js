import {
    GET_SKILL_TEMPLATES,
    GET_SKILL_TEMPLATES_STARTED,
    GET_SKILL_TEMPLATES_SUCCESS,
    GET_SKILL_TEMPLATES_FAILURE,
} from '../types/skill_templates_types'

import { deepCopy } from '../../methods/utils/utils.js'


const defaultState = {
    skillTemplates: [],
    error: {},
    pending: false,
    returnedSkillTemplates : [],
  };
  
  let index;
  
  export default function skillTemplatesReducer(state = defaultState, action) {
      // let skillsClone = state.skills.map(skill => deepCopy(skill));
        switch (action.type) {
  
          case 'SKILL_TEMPLATES_RETURNED':
              return {
                  ...state,
                  returnedSkillTemplates: action.payload
              }
  
          case GET_SKILL_TEMPLATES:
              break;
  
          case GET_SKILL_TEMPLATES_STARTED:
              return  Object.assign({}, state, {
                  pending: true
              });
  
          case GET_SKILL_TEMPLATES_SUCCESS:
              return  {
                ...state,
                skillTemplates: action.payload
              };
  
          case GET_SKILL_TEMPLATES_FAILURE:
              return  Object.assign({}, state, {
                  error: action.payload,
                  pending: false
              });
  
          default:
              return state;
              break;
  
      }
  }
  