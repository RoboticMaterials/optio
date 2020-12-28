import React, {useState, useEffect, useRef} from 'react';
import { createPortal } from "react-dom";
import DropDownSearch, {DefaultReactDropdownSelect} from "../components/basic/drop_down_search_v2/drop_down_search";

const Portal = (props) => {

	const {
		children,
		mountElement
	} = props

	const mount = document.getElementById(mountElement);
	const el = document.createElement("div");

	useEffect(() => {
		mount && mount.appendChild(el);

		return () => mount && mount.removeChild(el);
	}, [el, mount]);

	return createPortal(children, el)
};


Portal.defaultProps = {
	mountElement: "root",
};
export default Portal;