// @ts-nocheck
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

            showTrace: false
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
            console.log(this.state)
            // You can render any custom fallback UI
            return (
                <styled.Container>
                    <styled.Label>
                        Oops! Something went wrong... {this.state.error?.message || String(this.state.error)}
                    </styled.Label>
                    <styled.Text style={{color: 'grey', marginTop: '1rem', cursor: 'pointer'}} onClick={() => this.setState({showTrace: !this.state.showTrace})}>Show Trace</styled.Text>
                    {this.state.showTrace &&
                        <>
                            <styled.Text style={{whiteSpace:'pre-wrap',fontSize:'0.75rem'}}>{this.state.error?.stack || 'NA'}</styled.Text>
                            <styled.Text style={{whiteSpace:'pre-wrap',fontSize:'0.75rem'}}>{this.state.info?.componentStack || 'NA'}</styled.Text>
                        </>
                    }
                </styled.Container>
            );
        } else {
            return this.props.children;
        }
    }
}

export default withRouter(PageErrorBoundary);
