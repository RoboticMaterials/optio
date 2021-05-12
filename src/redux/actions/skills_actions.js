// import {
//     GET_SKILLS,
//     GET_SKILLS_STARTED,
//     GET_SKILLS_SUCCESS,
//     GET_SKILLS_FAILURE,
//
//     POST_SKILLS,
//     POST_SKILLS_STARTED,
//     POST_SKILLS_SUCCESS,
//     POST_SKILLS_FAILURE,
//
//     PUT_SKILLS,
//     PUT_SKILLS_STARTED,
//     PUT_SKILLS_SUCCESS,
//     PUT_SKILLS_FAILURE,
//
//     DELETE_SKILLS,
//     DELETE_SKILLS_STARTED,
//     DELETE_SKILLS_SUCCESS,
//     DELETE_SKILLS_FAILURE
// } from '../types/skills_types'
//
// import * as api from '../../api/skills_api'
//
// // get
// // ******************************
// export const getSkills = () => {
//   return async dispatch => {
//
//     function onStart() {
//       dispatch({ type: GET_SKILLS_STARTED });
//     }
//     function onSuccess(response) {
//       dispatch({ type: GET_SKILLS_SUCCESS, payload: response });
//       return response;
//     }
//     function onError(error) {
//       dispatch({ type: GET_SKILLS_FAILURE, payload: error });
//       return error;
//     }
//
//     try {
//       onStart();
//       const skills = await api.getSkills();
//       return onSuccess(skills);
//     } catch (error) {
//       return onError(error);
//     }
//   };
// };
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//
// // post
// // ******************************
// export const postSkill = (skill) => {
//   return async dispatch => {
//
//     function onStart() {
//       dispatch({ type: POST_SKILLS_STARTED });
//     }
//     function onSuccess(response) {
//       dispatch({ type: POST_SKILLS_SUCCESS, payload: response});
//       return response;
//     }
//     function onError(error) {
//       dispatch({ type: POST_SKILLS_FAILURE, payload: error });
//       return error;
//     }
//
//     try {
//       onStart();
//       const response = await api.postSkill(skill);
//       return onSuccess(response);
//     } catch (error) {
//       return onError(error);
//     }
//   };
// };
//
// export const putSkill = (skill, ID) => {
//   return async dispatch => {
//       function onStart() {
//           dispatch({ type: PUT_SKILLS_STARTED });
//         }
//         function onSuccess(response) {
//           dispatch({ type: PUT_SKILLS_SUCCESS, payload: response});
//           return response;
//         }
//         function onError(error) {
//           dispatch({ type: PUT_SKILLS_FAILURE, payload: error });
//           return error;
//         }
//
//       try {
//           onStart();
//           delete skill.id;
//           const response = await api.putSkill(skill, ID);
//           return onSuccess(response)
//       } catch(error) {
//           return onError(error)
//       }
//   }
// }
//
// export const deleteSkill = (skillId) => {
//   return async dispatch => {
//
//     function onStart() {
//       dispatch({ type: DELETE_SKILLS_STARTED });
//     }
//     function onSuccess(skillId) {
//       const payload = {skillId};
//       dispatch({ type: DELETE_SKILLS_SUCCESS, payload});
//       console.log('delete skill success');
//       return skillId;
//     }
//     function onError(error) {
//       dispatch({ type: DELETE_SKILLS_FAILURE, payload: error });
//       console.log('delete skill FAIL');
//       return error;
//     }
//
//     try {
//       onStart();
//       const response = await api.deleteSkill(skillId);
//       return onSuccess(skillId);
//     } catch (error) {
//       return onError(error);
//     }
//   };
// };
