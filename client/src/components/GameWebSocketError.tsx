import { useNavigate } from "react-router-dom";
import { StyledButton, StyledPage } from "../Styled";

export const GameWebSocketError = () => {
  const navigate = useNavigate();
  const backHome = function () {
    navigate("/");
  };

  // エラー
  return (
    <>
      <StyledPage>
        <h3>接続に失敗しました</h3>
        <div>
          <StyledButton onClick={backHome}>戻る</StyledButton>
        </div>
      </StyledPage>
    </>
  );
};