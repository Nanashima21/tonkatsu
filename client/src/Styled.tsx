import styled from "styled-components";

export const StyledCheckboxLabel = styled.div`
  margin-left: 10px;
  display: inline-block;
`

export const StyledCheckbox = styled.div`
  padding: 5px 0 5px 140px;
`

export const StyledHr = styled.hr`
  border-color: #646cff;
  margin-top: 30px;
  margin-bottom: 10px;
  width: 100%;
`;

export const StyledUser = styled.h5`
  padding: 0;
  margin: 0;
  font-weight: 500;
`;

export const StyledPage = styled.div`
  padding: 100px 0px;
  min-width: 400px;
`;

export const StyledButton = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  margin: 1em auto 1em auto;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  width: 300px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.25s;
  &:hover {
    border-color: #646cff;
  }
  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

export const StyledScreen = styled.div`
  border-radius: 20px;
  position: relative;
  z-index: 1;
  background: #ffffff;
  width: 700px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
`;

export const StyledForm = styled.div`
  border-radius: 20px;
  position: relative;
  z-index: 1;
  background: #ffffff;
  width: 500px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
`;

export const StyledInput = styled.input`
  border-radius: 100px;
  border: 1px solid #535bf2;
  padding: 8px 16px;
  margin: 10px;
  width: 80%;
  height: 40px;
  font-size: 1em;
`;

export const StyledErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;

export const StyledAnswer = styled.div`
  width: 60%;
  display: inline-block;
  position: relative; 
  margin: 5px 0 0 16px;
  padding: 17px 13px;
  border-radius: 100px;
  background: #eeeeee;
  &:p {
  margin: 0;
  padding: 0;
`;

export const StyledMessage = styled.p`
  margin: 15px 0 0;
  color: #b3b3b3;
`;

export const StyledUserList = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding-top: 15px;
  margin: 0 0 60px;
`

export const StyledUserListElem = styled.div`
  flex: 1 1 50%;
  width: 40%;
  border-bottom: solid 3px #e0e0e0;
  margin: 0 auto;
  padding-top: 15px;
`

export const StyledLogo = styled.img`
  margin: 0 auto 20px;
  width: 300px;
`
