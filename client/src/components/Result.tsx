import React, { FC, useEffect, useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { GameState, ResultJson, AllResultJson } from "../views/Game";
import { setGameCount } from "../app/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { StyledButton, StyledHr } from "../Styled";

type Props = {
  socketRef: React.MutableRefObject<WebSocket | undefined>;
  setGameState: (state: GameState) => void;
  result: ResultJson;
  setTopic: (state: string) => void;
  resetTopic: () => string;
  isQuestioner: boolean;
  moveAllResult: (json: AllResultJson) => void;
  moveError: () => void;
};

type Userscore = {
  rank?: number;
  userName: string;
  score: number;
};

type Topic = {
  questioner: string;
  question: string;
};

export const Result: FC<Props> = (props) => {
  const socketRef = props.socketRef;
  var flag = 0;
  const joinNum = useSelector((state: any) => state.user.joinNum);
  const gameCount = useSelector((state: any) => state.user.gameCount);
  const [isLast, setIsLast] = useState(false);
  const dispatch = useDispatch();

  const [topic, setTopic] = useState<Topic>({
    questioner: "",
    question: "",
  });
  const [gameResults, setGameResults] = useState<Userscore[]>([]);

  // WebSocket
  useEffect(() => {
    if (flag == 0) {
      flag = 1;
      if (gameCount == joinNum - 1) {
        setIsLast(true);
      }

      // ソケットエラー
      if (socketRef.current) {
        socketRef.current.onerror = function () {
          props.moveError();
        };
      }

      // サーバーからのソケット受け取り
      if (socketRef.current) {
        console.log("socket connect");
        socketRef.current.onmessage = function (event) {
          var msg = JSON.parse(event.data);
          switch (msg["command"]) {
            case "game_show_all_result":
              props.moveAllResult(msg);
              socketRef.current?.close();
              break;
            case "role":
              dispatch(setGameCount(gameCount + 1));
              if (msg["content"]["isQuestioner"]) {
                props.setGameState(GameState.Questioner);
                props.setTopic(props.resetTopic());
              } else props.setGameState(GameState.Answerer);
              break;
            case "game_disconnect":
              props.moveError();
              break;
          }
        };
      }

      const objTopic: Topic = {
        questioner: props.result["content"]["questioner"],
        question: props.result["content"]["question"],
      };
      setTopic(objTopic);
      setGameResults(rank_array(props.result["content"]["result"]));
    }
  }, [props.result]);

  const rank_array = (array: Userscore[]) => {
    const rankedArray: Userscore[] = [];
    const sortedArray = array.sort((a: Userscore, b: Userscore) => {
      return b.score - a.score;
    });
    var curscore = -1;
    var curindex = 0;
    for (const user of sortedArray) {
      if (user.userName == props.result["content"]["questioner"]) continue;
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
    return [...rankedArray];
  };

  const next_question = () => {
    var sendJson = { command: "game_next_game" };
    socketRef.current?.send(JSON.stringify(sendJson));
  };

  const finish_game = () => {
    var sendJson = { command: "game_finish_game" };
    socketRef.current?.send(JSON.stringify(sendJson));
  };

  return (
    <>
      <VStack width="70%">
        <VStack>
          <h3>順位</h3>
          <h4>
            {topic.questioner}さんの回答 : {topic.question}
          </h4>
        </VStack>
        <VStack alignItems="left" py="20px" px="150px" spacing="20px">
          {gameResults.map((gameResult, i) => (
            <HStack key={i}>
              <Box width="50px">
                <h5>{gameResult.rank}位</h5>
              </Box>
              <Box width="200px">
                <h5>{gameResult.userName}</h5>
              </Box>
              <Box width="50px">
                <h5>{gameResult.score}pt</h5>
              </Box>
            </HStack>
          ))}
        </VStack>
        {isLast ? (
          <>
            <StyledHr />
            <StyledButton onClick={finish_game}>最終結果を見る</StyledButton>
          </>
        ) : (
          <>
            {props.isQuestioner ? (
              <>
                <StyledHr />
                <StyledButton onClick={next_question}>
                  次の問題に移る
                </StyledButton>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </VStack>
    </>
  );
};

export default Result;
