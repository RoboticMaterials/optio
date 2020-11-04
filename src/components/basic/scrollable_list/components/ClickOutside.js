import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

class ClickOutside extends React.Component {
  container = React.createRef();

  componentDidMount() {
    document.addEventListener('click', this.handleClick, {capture:true, passive:true});
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
  }

  handleClick = (event) => {
    const container = this.container.current;
    const { target } = event;
    const { onClickOutside } = this.props;
    console.log('ClickOutside props', this.props)

    if ((container && container === target) || (container && !container.contains(target))) {
      onClickOutside(event);
    }
  };

  render() {
    const { className, children, ClickOutsideComponent } = this.props;

    return (
      <ClickOutsideComponent className={className} ref={this.container}>
        {children}
      </ClickOutsideComponent>
    );
  }
}

const DefaultClickOutsideComponent = styled.div`

`;

ClickOutside.propTypes = {
  onClickOutside: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

ClickOutside.defaultProps = {
  ClickOutsideComponent: DefaultClickOutsideComponent
};


export default ClickOutside;
