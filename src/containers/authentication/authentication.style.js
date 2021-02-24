import styled from "styled-components";

export const Container = styled.div`
  height: 40%;
  width: 35%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  border-radius: 10px;
`;

export const LogoContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 5%;
  margin-top: 5%;
`;

export const LogoIcon = styled.i`
  font-size: 10rem;
  margin-top: -0.5rem;
  margin-right: 0.1rem;
  color: ${(props) => props.theme.fg.secondary};
`;

export const LogoSubtitle = styled.h2`
  color: ${(props) => props.theme.bg.senary};
  font-family: "Montserrat";
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: -10rem;
  padding: 0;
`;

export const LogoWelcome = styled.h1`
  color: ${(props) => props.theme.bg.senary};
  font-family: "Montserrat";
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  padding: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  display: flex;
  position: relative;
  margin-bottom: 2%;
  margin-top: 5%;
`;

export const SignInUpContainer = styled.div``;

export const CheckBoxWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

export const Button = styled.button`
  cursor: "pointer";
  width: 10rem;
  border-radius: 0.5rem;
  display: flex;
  background-color: #ff4b4b;
  color: white;
  border-color: white;
  align-self: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0.5rem;
`;
