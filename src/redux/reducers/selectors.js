import _ from "lodash";

export const createLoadingSelector = (actions) => (state) => {
  // returns true only when all actions is not loading
  return _(actions).some((action) => _.get(state, `api.loading.${action}`));
};

export const createErrorMessageSelector = (actions) => (state) => {
  // returns the first error messages for actions
  // * We assume when any request fails on a page that
  //   requires multiple API calls, we shows the first error
  // console.log('createErrorMessageSelector actions', actions)
  // console.log('createErrorMessageSelector state', state)
  return (
    _(actions)
      .map((action) => {
        // console.log('createErrorMessageSelector map before', state)
        return {
          action: action,
          error: _.get(state, `errorReducer.${action}`),
        };
        return _.get(state, `errorReducer.${action}`);
        // console.log('createErrorMessageSelector map after', state)
      })
      .compact()
      .first() || ""
  );
};
