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
	// el.style.cssText ='position:absolute;top:300rem;left:300rem; z-index: 1000; width:200px;height:200px;-moz-border-radius:100px;border:1px  solid #ddd;-moz-box-shadow: 0px 0px 8px  #fff;display:none; background: red;';
	useEffect(() => {
		mount && mount.appendChild(el);

		return () => mount && mount.removeChild(el);
	}, [el, mount]);

	return createPortal(children, el)
};


Portal.defaultProps = {
	mountElement: "body",
};
export default Portal;