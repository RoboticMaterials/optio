import React from "react";
import * as style from "./checkbox.style";

const Checkbox = (props) => {
  const { onClick, checked, title } = props;

  return (
    <React.Fragment>
      <div className="checkbox">
        <style.Label>
          <style.Input type="checkbox" onClick={onClick} checked={checked} />
          {title}
        </style.Label>
      </div>
    </React.Fragment>
  );
};

export default Checkbox;
