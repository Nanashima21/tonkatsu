import { useNavigate } from "react-router-dom";
import { StyledButton, StyledPage, StyledForm } from "../Styled";

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
