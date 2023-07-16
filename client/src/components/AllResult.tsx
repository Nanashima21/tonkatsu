import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { GameState, AllResultJson } from "../views/Game";
import { StyledButton, StyledPage, StyledScreen, StyledHr } from "../Styled";
import App from "../App";

type Props = {
  setGameState: (state: GameState) => void;
  result: AllResultJson;
};

type Userscore = {
  rank?: number;
  userName: string;
  score: number;
};

export const AllResult: FC<Props> = (props) => {
  const navigate = useNavigate();
  const [gameResults, setGameResults] = useState<Userscore[]>([]);

  const rank_array = (array: Userscore[]) => {
    const rankedArray: Userscore[] = [];
    const sortedArray = array.sort((a: Userscore, b: Userscore) => {
      return b.score - a.score;
    });
    var curscore = -1;
    var curindex = 0;
    for (const user of sortedArray) {
      if (curscore != user.score) {
        curscore = user.score;
        curindex += 1;
      }
      const rankedUser: Userscore = {
        ...user,
        rank: curindex,
      };
      rankedArray.push(rankedUser);
    }
    return rankedArray;
  };

  useEffect(() => {
    setGameResults(rank_array(props.result["content"]["result"]));
  }, []);

  const backHome = function () {
    props.setGameState(GameState.Init);
    navigate("/");
  };

  const Appeal = (
    <style>
      {`
        @keyframes appeal {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  );

  const styles = ({
    appeal: {
      animation: "appeal infinite 20s linear;",
    },
  });
  

  return (
    <>
      
      <StyledPage>
        <StyledScreen>
          <VStack>
            <h2>最終順位</h2>
          </VStack>
          <VStack alignItems="left" py="20px" px="150px" spacing="20px">
            {gameResults.map((gameResult, i) => (
              
              <div style={styles.appeal}>
                {Appeal}

              <HStack key={i} className={"ranking-"+i}>
              <style>
        {`@keyframes toLeft {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }`}
      </style>
                <Box width="50px">{gameResult.rank}位</Box>
                <Box width="200px" style={{
                  animation: `toLeft 1s infinite`
                }}>{gameResult.userName}</Box>
                <Box width="50px">{gameResult.score}pt</Box>
              </HStack>
              </div>
            ))}
          </VStack>
          <StyledHr />
          <StyledButton onClick={backHome}>終了</StyledButton>
        </StyledScreen>
      </StyledPage>
    </>
  );
};

export default AllResult;