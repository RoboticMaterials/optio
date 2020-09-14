import React, { Component } from 'react';

export default function withPropsChecker(WrappedComponent) {
  return class PropsChecker extends Component {
    constructor(props) {
        super(props);

        this.logger = this.props.logger;
    }
    componentWillReceiveProps(nextProps) {
      Object.keys(nextProps)
        .filter(key => {
          return nextProps[key] !== this.props[key];
        })
        .map(key => {
          this.logger.debug(
            'changed property:',
            key,
            'from',
            this.props[key],
            'to',
            nextProps[key]
          );
        });
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
