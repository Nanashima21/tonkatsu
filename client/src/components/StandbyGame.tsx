import { FC, useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setGameCount, setJoinNum } from "../app/user/userSlice";
import { GameState } from "../views/Game";
import {
  StyledButton,
  StyledHr,
  StyledVr,
  StyledRadioButtonGroup,
} from "../Styled";
import { HStack, VStack, Box } from "@chakra-ui/react";

type Props = {
  setUserNames: (state: string[]) => void;
  socketRef: React.MutableRefObject<WebSocket | undefined>;
  setGameState: (state: GameState) => void;
  moveError: () => void;
};

export const StandbyGame: FC<Props> = (props) => {
  const isOwner = useSelector((state: any) => state.user.isOwner);
  const dispatch = useDispatch();
  console.log(isOwner);
  const socketRef = props.socketRef;
  const [userNum, setUserNum] = useState<number>(2);
  // var userNum = 2;
  const navigate = useNavigate();
  var flag = 0;
  const [gameMode, setGameMode] = useState("normal");
  const [langMode, setLangMode] = useState("japanese");

  // status:
  // 0: WebSocket 接続前
  // 1: WebSocket 接続失敗
  // 2: WebSocket 接続成功
  const [status, setStatus] = useState(0);

  useEffect(() => {
    localStorage.setItem("isOwner", isOwner);
  }, [isOwner]);

  // WebSocket
  useEffect(() => {
    if (flag == 0) {
      flag = 1;
      // ソケットエラー
      if (socketRef.current) {
        socketRef.current.onerror = function () {
          setStatus(1);
        };
      }

      // サーバーからのソケット受け取り
      if (socketRef.current) {
        console.log("socket connect");
        socketRef.current.onmessage = function (event) {
          var msg = JSON.parse(event.data);
          switch (msg["command"]) {
            case "update_members":
              console.log(msg["content"]["user_name"]);
              props.setUserNames(msg["content"]["user_name"]);
              setUserNum(msg["content"]["user_name"].length);
              //userNum =  msg["content"]["user_name"].length
              break;
            case "close_room":
              localStorage.removeItem("isOwner");
              socketRef.current?.close();
              props.setGameState(GameState.Init);
              navigate("/");
              break;
            case "role":
              dispatch(setGameCount(0));
              dispatch(setJoinNum(userNum));
              if (msg["content"]["isQuestioner"])
                props.setGameState(GameState.Questioner);
              else props.setGameState(GameState.Answerer);
              break;
            case "game_disconnect":
              props.moveError();
              break;
          }
          setStatus(2);
        };
      }
    }
  }, [userNum]);

  const startGame = function () {
    // ゲームを開始するとき
    var sendJson = { command: "start_game", content: { game_mode: gameMode } };
    socketRef.current?.send(JSON.stringify(sendJson));
  };

  const cancelGame = function () {
    // ゲームをキャンセルするとき
    let sendJSON = { command: "close_room" };
    socketRef.current?.send(JSON.stringify(sendJSON));
    localStorage.removeItem("isOwner");
    socketRef.current?.close();
    props.setGameState(GameState.Init);
    navigate("/");
  };

  const exitRoom = function () {
    // 部屋を抜けるとき
    var sendJson = { command: "leave" };
    socketRef.current?.send(JSON.stringify(sendJson));
    socketRef.current?.close();
    props.setGameState(GameState.Init);
    navigate("/");
  };

  const backHome = function () {
    socketRef.current?.close();
    navigate("/");
  };

  // 部屋検索中
  if (status == 0) {
    return (
      <>
        <Box width="70%">
          {isOwner ? <h4>部屋を作成中...</h4> : <h4>部屋を検索中...</h4>}
        </Box>
      </>
    );
  }

  // 部屋が見つからないとき
  if (status == 1) {
    return (
      <>
        <VStack width="70%">
          <h4>部屋が見つかりませんでした</h4>
          <StyledButton onClick={backHome}>戻る</StyledButton>
        </VStack>
      </>
    );
  }

  return (
    <>
      <VStack width="70%" height="100%">
        {isOwner ? (
          <h4>難易度と言語を選択してください</h4>
        ) : (
          <h4>ホストの選択を待機しています</h4>
        )}
        <HStack width="100%" height="60%" gap="5%" marginLeft="15%">
          <VStack width="35%">
            <h4>難易度</h4>
            <StyledRadioButtonGroup>
              <div className="item">
                <input
                  type="radio"
                  value="easy"
                  id="easy"
                  className="radio-button"
                  disabled={!isOwner}
                  checked={gameMode === "easy"}
                  onChange={() => {
                    setGameMode("easy");
                  }}
                />
                <label htmlFor="easy">かんたん</label>
              </div>
              <div className="item">
                <input
                  type="radio"
                  value="normal"
                  id="normal"
                  className="radio-button"
                  disabled={!isOwner}
                  checked={gameMode === "normal"}
                  onChange={() => {
                    setGameMode("normal");
                  }}
                />
                <label htmlFor="normal">ふつう</label>
              </div>
              <div className="item">
                <input
                  type="radio"
                  value="hard"
                  id="hard"
                  className="radio-button"
                  disabled={!isOwner}
                  checked={gameMode === "hard"}
                  onChange={() => {
                    setGameMode("hard");
                  }}
                />
                <label htmlFor="hard">むずかしい</label>
              </div>
            </StyledRadioButtonGroup>
          </VStack>
          <StyledVr />
          <VStack width="35%">
            <h4>言語</h4>
            <StyledRadioButtonGroup>
              <div className="item">
                <input
                  type="radio"
                  value="japanese"
                  id="japanese"
                  className="radio-button"
                  disabled={!isOwner}
                  checked={langMode === "japanese"}
                  onChange={() => {
                    setLangMode("japanese");
                  }}
                />
                <label htmlFor="japanese">日本語</label>
              </div>
              <div className="item">
                <input
                  type="radio"
                  value="english"
                  id="english"
                  className="radio-button"
                  disabled={!isOwner}
                  checked={langMode === "english"}
                  onChange={() => {
                    setLangMode("english");
                  }}
                />
                <label htmlFor="english">English</label>
              </div>
              <div className="item">
                <input
                  type="radio"
                  value="chinese"
                  id="chinese"
                  className="radio-button"
                  disabled={!isOwner}
                  checked={langMode === "chinese"}
                  onChange={() => {
                    setLangMode("chinese");
                  }}
                />
                <label htmlFor="chinese">中文体</label>
              </div>
            </StyledRadioButtonGroup>
          </VStack>
        </HStack>
        <StyledHr />
        <HStack width="80%" height="20%" gap="10%" marginRight="5%">
          <StyledButton onClick={startGame} disabled={!isOwner}>
            ゲームを始める
          </StyledButton>
          {isOwner ? (
            <StyledButton onClick={cancelGame}>ゲームをキャンセル</StyledButton>
          ) : (
            <StyledButton onClick={exitRoom}>部屋を抜ける</StyledButton>
          )}
        </HStack>
      </VStack>
    </>
  );
};
