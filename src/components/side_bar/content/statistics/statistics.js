import React, { useEffect, useState, useRef, useContext, memo, lazy, Suspense } from 'react';
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

// Import Styles
import * as styled from './statistics.style'
import { ThemeContext } from 'styled-components';

// Import Components

const Statistics = () => {

    let params = useParams()
    const {
        page,
        subpage,
        id
    } = params
    const themeContext = useContext(ThemeContext);

    return null


}

export default Statistics
