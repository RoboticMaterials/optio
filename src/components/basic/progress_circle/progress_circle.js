import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from "./progress_circle.style"

const ProgressCircle = (props) => {

	const {
		progress,
		inactiveColor,
		activeColor
	} = props

	const [firstQuarterAngle, setFirstQuarterAngle] = useState(null)
	const [secondQuarterAngle, setSecondQuarterAngle] = useState(null)
	const [thirdQuarterAngle, setThirdQuarterAngle] = useState(null)
	const [fourthQuarterAngle, setFourthQuarterAngle] = useState(null)


	useEffect(() => {
		updateProgress()
	}, [])
	useEffect(() => {
		updateProgress()
	}, [progress])

	const updateProgress = () => {
		let tempProgress = Math.floor(progress);
		if(tempProgress<25){
			var angle = -90 + (tempProgress/100)*360;
			setFirstQuarterAngle(angle)
			setSecondQuarterAngle(null)
			setThirdQuarterAngle(null)
			setFourthQuarterAngle(null)
			// $(".animate-0-25-b").css("transform","rotate("+angle+"deg)");
		}
		else if(tempProgress>=25 && tempProgress<50){
			var angle = -90 + ((tempProgress-25)/100)*360;
			setFirstQuarterAngle(0)
			setSecondQuarterAngle(angle)
			setThirdQuarterAngle(null)
			setFourthQuarterAngle(null)

			// $(".animate-0-25-b").css("transform","rotate(0deg)");
			// $(".animate-25-50-b").css("transform","rotate("+angle+"deg)");
		}
		else if(tempProgress>=50 && tempProgress<75){
			var angle = -90 + ((tempProgress-50)/100)*360;
			setSecondQuarterAngle(0)
			setFirstQuarterAngle(0)
			setThirdQuarterAngle(angle)
			setFourthQuarterAngle(null)
			// $(".animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
			// $(".animate-50-75-b").css("transform","rotate("+angle+"deg)");
		}
		else if(tempProgress>=75 && tempProgress<=100){
			var angle = -90 + ((tempProgress-75)/100)*360;
			setFirstQuarterAngle(0)
			setSecondQuarterAngle(0)
			setThirdQuarterAngle(0)
			setFourthQuarterAngle(angle)
		}
		// $(".text").html(tempProgress+"%");
	}

	return (
		<styled.Container
			firstQuarterAngle={firstQuarterAngle}
			secondQuarterAngle={secondQuarterAngle}
			thirdQuarterAngle={thirdQuarterAngle}
			fourthQuarterAngle={fourthQuarterAngle}
			inactiveColor={inactiveColor}
			activeColor={activeColor}
		>
		<div
			className="loader"
			firstQuarterAngle={firstQuarterAngle}
			secondQuarterAngle={secondQuarterAngle}
			thirdQuarterAngle={thirdQuarterAngle}
			fourthQuarterAngle={fourthQuarterAngle}

		>
			<div className="loader-bg">
				<div className="text"></div>
			</div>
			<div angle={firstQuarterAngle} className="spiner-holder-one animate-0-25-a">
				<div angle={firstQuarterAngle} className="spiner-holder-two animate-0-25-b">
					<div className="loader-spiner"></div>
				</div>
			</div>
			<div angle={secondQuarterAngle} className="spiner-holder-one animate-25-50-a">
				<div angle={secondQuarterAngle} className="spiner-holder-two animate-25-50-b">
					<div className="loader-spiner"></div>
				</div>
			</div>
			<div angle={thirdQuarterAngle} className="spiner-holder-one animate-50-75-a">
				<div angle={thirdQuarterAngle} className="spiner-holder-two animate-50-75-b">
					<div className="loader-spiner"></div>
				</div>
			</div>
			<div angle={fourthQuarterAngle} className="spiner-holder-one animate-75-100-a">
				<div angle={fourthQuarterAngle} className="spiner-holder-two animate-75-100-b">
					<div className="loader-spiner"></div>
				</div>
			</div>
		</div>
		</styled.Container>

	);
};

ProgressCircle.propTypes = {
	progress: PropTypes.number,
	inactiveColor: PropTypes.string,
	activeColor: PropTypes.string,
};

ProgressCircle.defaultProps = {
	progress: 30,
	inactiveColor: "",
	activeColor: "",
};

export default ProgressCircle;
