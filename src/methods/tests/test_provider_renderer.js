import * as React from 'react'
import { render } from "@testing-library/react";
import { ThemeProvider } from 'styled-components';
import { Provider } from "react-redux";
import theme from '../../theme'

export default function TestProviderRender(component, { store, ...props }) {
    return render(
        <ThemeProvider theme={theme['main']}>
            <Provider store={store}>
                {component}
            </Provider>
        </ThemeProvider>,
        props
    )
}
