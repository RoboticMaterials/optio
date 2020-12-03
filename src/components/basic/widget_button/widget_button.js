import React from 'react';


import * as styled from './widget_button.style';


const WidgetButton = props => {

	// extract props
	const {
		label,
		color,
		iconClassName,
		selected,
		onClick,
		containerStyle,
		children,
		labelSize
	} = props

	return(
		<styled.WidgetButton
			type={"button"}
			onClick={onClick}
			selected={selected}
			style={containerStyle}
		>
			{children && children}
			<styled.WidgetIcon selected={selected} color={color} className={iconClassName}/>
			{label &&
				<styled.WidgetText labelSize={labelSize}>{label}</styled.WidgetText>
			}
		</styled.WidgetButton>

	)
}

export default WidgetButton
