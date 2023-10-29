import { useNavigate } from "react-router-dom";
import { StyledButton, StyledForm, StyledHr, StyledLogo } from "../Styled";
import { Box } from "@chakra-ui/react";

export const NotLoginedHome = () => {
  const navigate = useNavigate();

  const handleClickLogin = () => {
    navigate("/login");
  };

  const handleClickRegister = () => {
    navigate("/account");
  };

  return (
    <>
      <Box minWidth="450px" maxWidth="900px" height="fit-content" width="50%" marginX="auto">
        <StyledForm>
          <StyledLogo src="/src/assets/logo.png"></StyledLogo>
          <Box fontFamily="arial black" p="10px">
            会話が苦手でも、Tonkatsuがあれば全然大丈夫!
            <br />
            ChatGPTを使ってアイスブレイクをしよう!!
          </Box>
          <StyledHr />
          <div>
            <StyledButton onClick={handleClickLogin}>ログイン</StyledButton>
          </div>
          <div>
            <StyledButton onClick={handleClickRegister}>新規登録</StyledButton>
          </div>
        </StyledForm>
      </Box>
    </>
  );
};
