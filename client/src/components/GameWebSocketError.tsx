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
        <h4>接続に失敗しました</h4>
        <div>
          <StyledButton onClick={backHome}>戻る</StyledButton>
        </div>
      </StyledPage>
    </>
  );
};
