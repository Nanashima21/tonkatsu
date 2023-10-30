import styled from "styled-components";

export const StyledNavbar = styled.nav`
  background-color: #666;
  justify-content: space-between;
  display: flex;
  width: 100%;
  height: 65px;
  a {
    text-decoration: none;
    color: #fff;
    padding: 10px 20px 10px 10px;
    display: block;
    font-size: x-large;
    font-weight: 800;
  }
`;

export const StyledFooter = styled.footer`
  background-color: #666;
  height: 100px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 100vh;
`;

export const StyledCheckboxLabel = styled.div`
  margin-left: 10px;
  display: inline-block;
`;

export const StyledCheckbox = styled.div`
  padding: 5px 0 5px 140px;
`;

export const StyledRadioButtonGroup = styled.div`
  width: 100%;
  .item {
    width: 100%;
    margin-bottom: 10%;
  }
  .radio-button {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
  .radio-button + label {
    border-radius: 8px;
    padding: 10px 10px;
    width: auto;
    cursor: pointer;
    border: 1px solid #ccc;
    color: #555;
    background-color: #ffffff;
    display: block;
    &:hover {
      border-color: #646cff;
    }
    &:focus,
    &:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
  }
  .radio-button:checked + label {
    background-color: #1ba0ff;
    color: #fff;
  }
  .radio-button:disabled + label {
    background-color: #999;
    color: #fff;
  }
`;

export const StyledHr = styled.hr`
  border-color: #646cff;
  margin-top: 0px;
  margin-bottom: 0px;
  width: 95%;
`;

export const StyledVr = styled.hr`
  border-color: #646cff;
  margin-left: 0px;
  margin-right: 0px;
  height: 95%;
`;

export const StyledUser = styled.h5`
  padding: 0;
  margin: 0;
  font-weight: 500;
`;

export const StyledPage = styled.div`
  height: 90%;
  background-color: #ba7d5b;
  padding-top: 50px;
`;

export const StyledButton = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  margin: 1em auto 1em auto;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  width: 50%;
  background-color: #d9d9d9;
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
  border-radius: 30px;
  position: relative;
  background: #ffffff;
  width: 85%;
  height: 90%;
  margin-left: 7.5%;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
`;

export const StyledUsers = styled.div`
  border-radius: 30px;
  position: relative;
  background: #d9d9d9;
  width: 85%;
  height: 90%;
  margin-bottom: 7.5%;
  text-align: center;
`;

export const StyledIcon = styled.img`
  border-radius: 100px;
  width: 60%;
`;

export const StyledForm = styled.div`
  overflow: scroll;
  border-radius: 30px;
  position: relative;
  background: #ffffff;
  width: 100%;
  height: 90%;
  padding: 10px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
`;

export const Styledform = styled.form`
  width: 100%;
`;

export const StyledInput = styled.input`
  border-radius: 10px;
  border: 1px solid #535bf2;
  padding: 16px 16px;
  margin-bottom: 10px;
  width: 50%;
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
  }
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
`;

export const StyledUserListElem = styled.div`
  flex: 1 1 50%;
  width: 100%;
  border-bottom: solid 3px #e0e0e0;
  margin: 0 auto;
  padding-top: 15px;
`;

export const StyledLogo = styled.img`
  margin: 0 auto 20px;
  width: 60%;
`;

export const StyledModal = styled.div`
  overflow: scroll;
  border-radius: 30px;
  position: relative;
  background: #ffffff;
  width: 85%;
  height: 90%;
  margin-top: 5%;
  margin-left: 7.5%;
  padding: 10px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
`;

export const StyledDescription = styled.h5`
  padding: 0;
  margin: 0;
  font-weight: 500;
`;

export const StyledHeader = styled.h4`
  padding: 0;
  margin: 0;
  font-weight: 800;
`;
