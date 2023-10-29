import { useNavigate } from "react-router-dom";
import { StyledButton } from "../Styled";
import { VStack } from "@chakra-ui/react";

export const GameWebSocketError = () => {
  const navigate = useNavigate();
  const backHome = function () {
    navigate("/");
  };

  // エラー
  return (
    <>
      <VStack>
        <h4>接続に失敗しました</h4>
        <StyledButton onClick={backHome}>戻る</StyledButton>
      </VStack>
    </>
  );
};
