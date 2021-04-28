import React, {useEffect, useRef, useState, useContext } from "react"

// components internal
import ErrorTooltip from '../error_tooltip/error_tooltip'
import NumberInput, {NUMBER_INPUT_BUTTON_TYPES} from "../../number_input/number_input"

// functions external
import PropTypes from 'prop-types'
import { useField, useFormikContext } from "formik"
import {
	isMobile
} from "react-device-detect";

// hooks
import useLongPress from "../../../../hooks/useLongPress"

// styles
import * as styled from './number_field.style'
import { ThemeContext } from 'styled-components'

// utils
import {setAcceleratingInterval} from "../../../../methods/utils/utils"

// options for useLongPress hook
const longPressOptions = {
	shouldPreventDefault: true,
	delay: 500,
}

const NumberField = (props) => {

	const {
		maxValue,
		minValue,
		...rest
	} = props

	const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, validateForm, ...context } = useFormikContext()
	const [field, meta] = useField(props)
	const {
		value: fieldValue,
		name: fieldName
	} = field

	const timeoutRef = useRef(null)

	const [longPressing, setLongPressing] = useState(false)	// is button being long pressed??
	const [valueState, setValueState] = useState(fieldValue)			// temp stores field value for long press. Necessary because useState allows for using callback with previous value, which setFieldValue does not
	const [previousValue, setPreviousValue] = useState(fieldValue)
	const [focused, setFocused] = useState(false)

	// extract meta data
	const { touched, error } = meta

	// does the field contain an error?
	const hasError = touched && error

	const themeContext = useContext(ThemeContext);

	useEffect(() => {
		setFieldValue(fieldName, parseInt(valueState))
	}, [valueState])

	const createLongPressHandler = (buttonType) => {
		return () => {
			setLongPressing(true)
			setValueState(parseInt(fieldValue) ||  0)

			setAcceleratingInterval(
				() => {

					// evaluate as plus press
					if(buttonType === NUMBER_INPUT_BUTTON_TYPES.PLUS) {

						// if maxValue is provided, value must not exceed maxValue
						if(maxValue !== null) {
							setValueState((previous) => {
								// if previous value is less than maxValue, go ahead and increment
								if(previous < maxValue) {
									return parseInt(previous) + 1
								}

								// *** OTHERWISE ***
								timeoutRef.current && clearTimeout(timeoutRef.current)	// clear timeout to cancel callback
								return parseInt(previous)	// return previous value
							})
						}

						// otherwise, value can be anything
						else {
							setValueState((previous) => {
								return parseInt(previous) + 1
							})
						}
					}

					// evaluate as minus press
					else {
						// if min value is provided, value cannot be set lower than minValue
						if(minValue !== null) {
							setValueState((previous) => {
								// if previous is still greater than minValue, go ahead and decrement
								if(previous > minValue) {
									return parseInt(previous) - 1
								}

								// *** otherwise ***
								timeoutRef.current && clearTimeout(timeoutRef.current)	// clear timeout to cancel callback
								return previous		// return previous value
							})
						}

						// otherwise value can be anything
						else {
							setValueState((previous) => {
								return parseInt(previous) - 1
							})
						}
					}
				},
				50,
				500,
				99999999,
				25,
				timeoutRef
			)
		}
	}

	const onLongPressEnd = () => {
		setLongPressing(false)	// set pressing to false
		timeoutRef.current && clearTimeout(timeoutRef.current)	// clear timeout to stop callback
	}

	const handleFocus = () => {
		if(isMobile) {
			setFocused(true)
			setPreviousValue(parseInt(fieldValue))
			setFieldValue(fieldName, "")
		}

	}


	const handleBlur = () => {
		if(isMobile) {
			setTimeout(() => {
				setFocused(false)
				if(!longPressing)
					setFieldValue(fieldName,
						Number.isInteger(parseInt(fieldValue)) ? parseInt(fieldValue) :
							Number.isInteger(parseInt(previousValue)) ? parseInt(previousValue) :
								0
					)
			}, 500)
		}
	}

	const handleMinusClick = () => {
		if(!touched) {
			setFieldTouched(fieldName, true)
		}

		if (maxValue) {
			if (fieldValue > maxValue) {
				// fieldValue should not exceed count, it may have been set higher before a lot was selected
				// reduce fieldValue to lot count
				setFieldValue(fieldName, parseInt(maxValue))
			}
		}

		// fieldValue cannot be negative
		if (fieldValue > minValue) setFieldValue(fieldName,parseInt(fieldValue - 1))
		// setFieldValue(fieldName,fieldValue - 1)
	}

	const handlePlusClick = () => {
		if(!touched) {
			setFieldTouched(fieldName, true)
		}

		// if there is a maxValue, fieldValue cannot exceed maxValue
		if (maxValue) {
			if (fieldValue < maxValue) {
				setFieldValue(fieldName,parseInt(fieldValue + 1))
			}

			// fieldValue is greater than count (probably was set before lot was selected), reduce to count
			else {
				setFieldValue(fieldName, parseInt(maxValue))
			}

		}
		// otherwise fieldValue can be anything
		else {
			setFieldValue(fieldName,parseInt(fieldValue + 1))
		}
	}

	// create events for long press (plus and minus)
	const longPlusPressEvent = useLongPress(createLongPressHandler(NUMBER_INPUT_BUTTON_TYPES.PLUS), onLongPressEnd, handlePlusClick, longPressOptions)
	const longMinusPressEvent = useLongPress(createLongPressHandler(NUMBER_INPUT_BUTTON_TYPES.MINUS), onLongPressEnd, handleMinusClick, longPressOptions)

	return (
			<NumberInput
				onBlur={handleBlur}
				onFocus={handleFocus}
				longPlusPressEvent={longPlusPressEvent}
				longMinusPressEvent={longMinusPressEvent}
				inputCss={hasError ? styled.errorCss : null}
				themeContext={themeContext}
				// onMinusClick={handleMinusClick}
				minusDisabled={!(fieldValue > minValue)}
				hasError={hasError}
				onInputChange={(e) => {

					if(!touched) {
						setFieldTouched(fieldName, true)
					}

					const enteredValue = e.target.value
					const enteredValueInt = parseInt(enteredValue)

					if (isNaN(enteredValueInt)) {
						if(enteredValue === "-") {
							setFieldValue(fieldName, -0)
						}
						else {
							setFieldValue(fieldName, 0)
						}
					}
					else {
						// if there is a maxValue, the fieldValue cannot exceed this
						if (maxValue) {
							if (enteredValueInt <= maxValue) setFieldValue(fieldName,enteredValueInt)
						}

						// otherwise the value can be anything
						else {
							setFieldValue(fieldName, enteredValueInt)
						}
					}


				}}
				value={longPressing ? valueState : fieldValue}
				plusDisabled={(maxValue) && !(fieldValue < maxValue)}
				// onPlusClick={handlePlusClick}
				inputChildren={<ErrorTooltip
					visible={hasError && !focused}
					text={error}
					color={themeContext.bad}
					ContainerComponent={styled.IconContainerComponent}
				/>}

			/>
	)
}

// Specifies propTypes
NumberField.propTypes = {
	maxValue: PropTypes.number,
	minValue: PropTypes.number,
}

// Specifies the default values for props:
NumberField.defaultProps = {
	maxValue: null,
	minValue: null,
}

export default NumberField
