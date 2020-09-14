import React from 'react'
import * as style from './checkbox.style'

const Checkbox = (props) => {
    return(
        <React.Fragment>
            <div className='checkbox'>
                <style.Label>
                    <style.Input 
                        type='checkbox' 
                        onClick={props.onClick} 
                        checked={props.checked}
                    />
                {props.title}
                </style.Label>
            </div>
        </React.Fragment>
    )
}

export default Checkbox