// import {
//     GET_SKILL_TEMPLATES,
//     GET_SKILL_TEMPLATES_STARTED,
//     GET_SKILL_TEMPLATES_SUCCESS,
//     GET_SKILL_TEMPLATES_FAILURE,
// } from '../types/skill_templates_types'
//
// import * as api from '../../api/skill_templates_api'
//
// // get
// // ******************************
// export const getSkillTemplates = () => {
//   return async dispatch => {
//
//     function onStart() {
//       dispatch({ type: GET_SKILL_TEMPLATES_STARTED });
//     }
//     function onSuccess(response) {
//       dispatch({ type: GET_SKILL_TEMPLATES_SUCCESS, payload: response });
//       return response;
//     }
//     function onError(error) {
//       dispatch({ type: GET_SKILL_TEMPLATES_FAILURE, payload: error });
//       return error;
//     }
//
//     try {
//       onStart();
//       const skills = await api.getSkillTemplates();
//       return onSuccess(skills);
//     } catch (error) {
//       return onError(error);
//     }
//   };
// };
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~