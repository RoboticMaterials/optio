import React, { useState } from 'react';

import * as styled from './dropdown_menu_button.style';

const DropdownMenuButton = (props) => {

    const {
        label,
        schema,
        buttons,
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{position: 'relative'}}>
            <styled.Button schema={schema} isActive={isOpen} onClick={() => {
                setIsOpen(!isOpen)
            }}>
                <styled.Icon isActive={isOpen} schema={schema} className={isOpen ? "fas fa-times" : "fas fa-bars"}/>
                {!isOpen && label}
            </styled.Button>
            <>
                {buttons.map((btn, ind) => (
                    <styled.SubButton 
                        schema={!!btn.schema ? btn.schema : schema}
                        onClick={btn.onClick}
                        style={{top: `${((isOpen?1:0)*(1+ind)*2.8)}rem`}}
                    >{btn.label}</styled.SubButton>
                ))}
            </>
        </div>
    )

}

export default DropdownMenuButton;