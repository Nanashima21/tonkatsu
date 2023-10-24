import { useNavigate } from "react-router-dom";
import {
  StyledButton,
  StyledPage,
  StyledForm,
  StyledHr,
  StyledLogo,
} from "../Styled";
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
      <StyledPage>
        <StyledForm>
          <StyledLogo
            style={{ width: 300 }}
            src="/src/assets/logo.png"
          ></StyledLogo>
          <Box fontFamily="arial black">
            会話が苦手でも、Tonkatsuがあれば全然大丈夫!
          </Box>
          <StyledHr />
          <div>
            <StyledButton onClick={handleClickLogin}>ログイン</StyledButton>
          </div>
          <div>
            <StyledButton onClick={handleClickRegister}>新規登録</StyledButton>
          </div>
        </StyledForm>
      </StyledPage>
    </>
  );
};
