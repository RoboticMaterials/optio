import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

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

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
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
        this.props.history.push('/')
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <styled.Container>
                    <styled.Text>
                        Oops! Something went wrong...
                    </styled.Text>
                    <styled.ReloadButton
                        onClick={this.handleReloadPage}
                        className="btn btn-outline-danger"
                    >
                        Reload Page
                    </styled.ReloadButton>
                    {/* <styled.ReloadButton onClick={this.props.deleteLocalSettings} className="btn btn-outline-danger">
            Delete Local Storage
          </styled.ReloadButton> */}
                </styled.Container>
            );
        } else {
            return this.props.children;
        }
    }
}

export default withRouter(PageErrorBoundary);
