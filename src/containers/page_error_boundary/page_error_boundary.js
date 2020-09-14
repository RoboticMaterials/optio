import React, {Component} from 'react';

// import styles
import * as styled from './page_error_boundary.style'

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // log the error to an error reporting service
    console.log(error, errorInfo);
  }

  handleReloadPage = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return(
        <styled.Container>
          <styled.Text>There was an issue loading the page... sorry!</styled.Text>
          <styled.ReloadButton onClick={this.handleReloadPage} className="btn btn-outline-danger">
            Reload Page
          </styled.ReloadButton>
        </styled.Container>
      )

    }
    return null
    // return this.props.children;
  }
}

export default PageErrorBoundary;
