import styled from "styled-components";

export const Container = styled.div`
 
     height: 6rem;

    display: flex;
    flex-direction: row;
        
    background: white;
    border-radius: 0.6rem;
    overflow: visible;
        
    // margins
    margin: 0 2rem 0.5rem 2rem;
        
    // padding
    padding: 0.5rem 1rem 0.5rem 1rem;
    
    outline: none;
    &:focus {
        outline: none;
    }

    letter-spacing: 1.5px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    
    outline: none;
    user-select: none;

    transition: transform 0.2s ease;

    cursor: grab;
    &:active {
        box-shadow: 2px 2px 2px rgba(0,0,0,0.5);
        transform: translateY(-2px);
        cursor: grabbing;
    }

}
    
`