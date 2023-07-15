import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const StyledPage = styled.div`
  padding: 50px 0px;
`;

const StyledButton = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  margin: 1em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  width: 330px;
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