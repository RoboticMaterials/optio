/*
 * This components behaves similar to PureComponent, but accepts a prop called 'ignoreProps'
 * any prop names listed in 'ignoreProps' will be ignored in regards to triggering re-renders
 *
 */

import React, { Component } from "react";

export default function makePure(WrappedComponent) {
  return class MyPureComponent extends Component {
    constructor(props) {
      super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
      const oldProps = this.props;
      const oldState = this.state;

      return (
        !this.shallowEqual(oldProps, nextProps) ||
        !this.shallowEqual(oldState, nextState)
      );
    }

    shallowEqual = (objA, objB) => {
      const { ignoreProps } = this.props;

      if (Object.is(objA, objB)) {
        return true;
      }

      if (
        typeof objA !== "object" ||
        objA === null ||
        typeof objB !== "object" ||
        objB === null
      ) {
        return false;
      }

      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);

      if (keysA.length !== keysB.length) {
        return false;
      }

      // Test for A's keys different from B.
      for (let i = 0; i < keysA.length; i++) {
        // ignore props listed in ignoreProps
        if (!(ignoreProps.includes(keysA[i]) || keysA[i] === "ignoreProps")) {
          if (
            !hasOwnProperty.call(objB, keysA[i]) ||
            !Object.is(objA[keysA[i]], objB[keysA[i]])
          ) {
            return false;
          }
        }
      }

      return true;
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
