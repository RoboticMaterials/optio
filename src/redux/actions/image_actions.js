// import {
//   GET_IMAGE,
//   GET_IMAGE_STARTED,
//   GET_IMAGE_SUCCESS,
//   GET_IMAGE_FAILURE,
//
// } from '../types/image_types';
//
// import * as api from '../../api/image_api';
//
// // import logger
// import log from '../../logger.js';
//
//
// import { poseSchema, posesSchema } from '../../normalizr/poses_schema';
//
// import { normalize, schema } from 'normalizr';
//
// const logger = log.getLogger("Images", "Images");
//
// export const getImage = () => {
//     return async dispatch => {
//         function onStart() {
//             dispatch({ type: GET_IMAGE_STARTED });
//           }
//           function onSuccess(poseEntities) {
//             dispatch({ type: GET_IMAGE_SUCCESS, payload: poseEntities });
//             return poseEntities;
//           }
//           function onError(error) {
//             dispatch({ type: GET_IMAGE_FAILURE, payload: error });
//             return error;
//           }
//
//         try {
//             onStart();
//             const image = await api.getImage();
//             logger.debug("getImagez: image", image)
//             /*
//             const normalizedData = normalize(poses, posesSchema);
//             logger.debug("normalizedData", normalizedData)
//
//             const poseEntities = normalizedData.entities.poses;
//             logger.debug("poseEntities", poseEntities)
//             */
//
//             return onSuccess(image)
//         } catch(error) {
//             return onError(error)
//         }
//     }
// }
