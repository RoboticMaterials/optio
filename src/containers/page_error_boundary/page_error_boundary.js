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

            showStackTrace: false
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
                        Oops! Something went wrong... {this.state.error}
                    </styled.Text>
                    <styled.ReloadButton
                        onClick={this.handleReloadPage}
                        className="btn btn-outline-danger"
                    >
                        Reload Page
                    </styled.ReloadButton>
                    <styled.Text style={{color: 'blue'}} onClick={() => this.setState({showStackTrace: !this.state.showStackTrace})}>Show Stack Trace</styled.Text>
                    {this.state.showStackTrace &&
                        <styled.Text>{this.state.error}</styled.Text>
                    }
                </styled.Container>
            );
        } else {
            return this.props.children;
        }
    }
}

export default withRouter(PageErrorBoundary);
