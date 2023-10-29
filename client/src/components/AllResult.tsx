import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { GameState, AllResultJson } from "../views/Game";
import { StyledButton, StyledHr } from "../Styled";
import snareRoll from "../assets/snare_roll.mp3";

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
  const audio = new Audio(snareRoll);

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

  useEffect(() => {
    audio.play();
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

  const styles = {
    appeal: {
      animation: "appeal infinite 20s linear;",
    },
  };

  return (
    <>
      <VStack>
        <VStack>
          <h2>最終順位</h2>
        </VStack>
        <VStack alignItems="center" py="20px" px="150px" spacing="20px">
          {gameResults.map((gameResult, i) => (
            <div style={styles.appeal}>
              {Appeal}
              <style>
                {`@keyframes toLeft {
                    0% {
                      opacity: 0;
                      transform: translateX(900%);
                    }
                    100% {
                      opacity:1;
                      transform: translateX(0);
                    }
                  }
                  @keyframes dissappear{
                    0% {
                      transform: translateX(900%);
                    } 100% {
                      transform: translateX(900%);
                    }
                  }`}
              </style>

              <HStack
                key={i}
                style={{
                  opacity: `0`,
                  animation: `toLeft 1s ${
                    3.5 - 0.7 * (gameResult.rank as number)
                  }s forwards ${
                    (gameResult.rank as number) === 1
                      ? ", rainbow 0.5s infinite"
                      : ""
                  }`,
                  fontSize: `${0.6 * (5 - (gameResult.rank as number))}em`,
                }}
              >
                <Box width="100px">{gameResult.rank}位</Box>
                <Box width="300px">{gameResult.userName}</Box>
                <Box width="200px">{gameResult.score}pt</Box>
              </HStack>
            </div>
          ))}
        </VStack>
        <StyledHr />
        <StyledButton onClick={backHome}>終了</StyledButton>
      </VStack>
    </>
  );
};

export default AllResult;
