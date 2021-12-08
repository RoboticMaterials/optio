import styled from "styled-components";
import {Calendar} from "react-calendar";

export const StyledCalendar = styled(Calendar)`

  .react-calendar {
    width: 350px;
    max-width: 100%;
    background: white;
    border: 1px solid #a0a096;
    font-family: ${props => props.theme.font.primary};
    line-height: 1.125em;
  }
  .react-calendar--doubleView {
    width: 700px;
  }
  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    margin: -0.5em;
  }
  .react-calendar--doubleView .react-calendar__viewContainer > * {
    width: 50%;
    margin: 0.5em;
  }
  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
    
  }
  .react-calendar button:enabled:hover {
    cursor: pointer;
  }
  .react-calendar__navigation {
    height: 44px;
    justify-content: space-between;
    align-items: center;
    display: flex;
	  margin-bottom: 1em;
    //margin: 0 16em 1em 16em;

    font-size: 1.5rem;
    font-weight: 800;
  }
  .react-calendar__navigation__label {
    font-size: 1.5rem;
    font-weight: 600;
  }
  .react-calendar__navigation button {
    background: none;
    border: none;
    border-radius: 3rem !important;
    display: flex;
    justify-content: center;
    align-items: center;

    height: 2.5rem;
    width: 2.5rem;
    padding: 0 !important;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #e1e5e8 !important;
  }
  .react-calendar__navigation button[disabled] {
    background-color: #f0f0f0;
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75em;
  }
  abbr[title] {
    text-decoration: none;
    cursor: default;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
    color: #ababb8;
    font-size: 0.9rem;
  }
  .react-calendar__month-view__weekNumbers {
    font-weight: bold;
  }
  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75em;
    padding: calc(0.75em / 0.75) calc(0.5em / 0.75);
    
  }

  .react-calendar__month-view__days__day {
    font-weight: 600;
  }

  .react-calendar__tile--range {
    border-radius: 0 !important;
  }
  .react-calendar__tile--rangeStart {
    border-top-left-radius: 4rem !important;
    border-bottom-left-radius: 4rem !important;
  }
  .react-calendar__tile--rangeEnd {
    border-top-right-radius: 4rem !important;
    border-bottom-right-radius: 4rem !important;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #ff8589;
    
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
    
  }
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
    border-radius: 3rem !important;
  }
  .react-calendar__tile {
    text-align: center;
    padding: 0.75em 0.5em;
    background: none;
    border: none;

    margin 0.2rem 0;
  }
  .react-calendar__tile:disabled {
    // background-color: #f0f0f0;
    color: #d2d3d6 !important;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
    border-radius: 4rem;
  }
  .react-calendar__tile--now {
    // background: #e8f4ff;
  }
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #e8f4ff;
  }
  .react-calendar__tile--hasActive {
    background: #76baff;
  }
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #76baff;
  }
  .react-calendar__tile--active {
    background: #76baff;
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #76baff;
  }
  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #e6e6e6;
  }
  

`