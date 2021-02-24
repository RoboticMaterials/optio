import React, { Component } from "react";

// import styles
import * as styled from "./page_error_boundary.style";

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
    };
  }

  getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // log the error to an error reporting service
    this.setState({
      hasError: true,
      error: error,
      info: info,
    });
  }

  handleReloadPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <styled.Container>
          <styled.Text>
            There was an issue loading the page... sorry!
          </styled.Text>
          <styled.ReloadButton
            onClick={this.handleReloadPage}
            className="btn btn-outline-danger"
          >
            Reload Page
          </styled.ReloadButton>
          <styled.ReloadButton
            onClick={this.props.deleteLocalSettings}
            className="btn btn-outline-danger"
          >
            Delete Local Storage
          </styled.ReloadButton>
        </styled.Container>
      );
    } else {
      return this.props.children;
    }
  }
}

export default PageErrorBoundary;
