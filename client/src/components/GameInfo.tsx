import { FC } from "react";
import { useSelector } from "react-redux";
import { GameState } from "../views/Game";
import { StyledUser, StyledUsers, StyledIcon, StyledVr } from "../Styled";
import { Grid, VStack } from "@chakra-ui/react";

type Props = {
  state: GameState;
  userNames: string[];
};

export const GameInfo: FC<Props> = (props) => {
  const roomid = useSelector((state: any) => state.user.roomId);
  const gameCount = useSelector((state: any) => state.user.gameCount);

  const userList = [];
  for (const [idx, userName] of props.userNames.entries()) {
    userList.push(
      <VStack width="100%">
        <StyledIcon src="/src/assets/icon-user.png" />
        <StyledUser key={idx}>{userName}</StyledUser>
      </VStack>
    );
  }

  return (
    <>
      <VStack width="30%" height="100%">
        {props.state === GameState.Standby ? (
          <h3>部屋 ID : {roomid}</h3>
        ) : (
          <h3>
            現在のターン : {gameCount + 1}/{userList.length}
          </h3>
        )}
        <p>現在のプレイヤー : {userList.length}人</p>
        <StyledUsers>
          <h5>参加者</h5>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {userList}
          </Grid>
        </StyledUsers>
      </VStack>
      <StyledVr />
    </>
  );
};
