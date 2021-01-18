import React from "react";
import ConfirmDeleteModal from '../modals/confirm_delete_modal/confirm_delete_modal'


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log('error')
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (

        <h1>hi</h1>
        //<ConfirmDeleteModal
          //  isOpen={true}
            //title={"Are you sure you want to delete this process?"}
            //button_1_text={"Delete process and KEEP associated routes"}
            //button_2_text={"Delete process and DELETE associated routes"}
      //  />
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
