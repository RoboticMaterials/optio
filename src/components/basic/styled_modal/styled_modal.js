import React from "react";
import Modal from "react-modal";

function ReactModalAdapter({ className, modalClassName, ...props }) {
  return (
    <Modal className={modalClassName} portalClassName={className} {...props} />
  );
}

export default ReactModalAdapter;
