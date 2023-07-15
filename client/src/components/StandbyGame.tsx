import { FC, useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setGameCount, setJoinNum } from "../app/user/userSlice";
import { GameState } from "../views/Game";
import { StyledButton, StyledHr, StyledPage, StyledUser, StyledCheckbox, StyledCheckboxLabel } from "../Styled";

type Props = {
  socketRef: React.MutableRefObject<WebSocket | undefined>;
  setGameState: (state: GameState) => void;
  moveError: () => void;
};

export const StandbyGame: FC<Props> = (props) => {
  const roomid = useSelector((state: any) => state.user.roomId);
  const isOwner = useSelector((state: any) => state.user.isOwner);
  const dispatch = useDispatch();
  console.log(isOwner);
  const socketRef = props.socketRef;
  const [userNames, setUserNames] = useState<string[]>([]);
  const [userNum, setUserNum] = useState<number>(2);
  // var userNum = 2;
  const navigate = useNavigate();
  var flag = 0;
  const [gameMode, setGameMode] = useState("normal");

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
              setUserNames(msg["content"]["user_name"]);
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
              else
                props.setGameState(GameState.Answerer);
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
    var sendJson = { command: "start_game", content: { game_mode: gameMode} };
    socketRef.current?.send(JSON.stringify(sendJson));
  };

  const cancelGame = function () {
    // ゲームをキャンセルするとき
    let sendJSON = { command: "close_room" }
    socketRef.current?.send(JSON.stringify(sendJSON))
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
        <StyledPage>
          {" "}
          <h5>部屋を検索中...</h5>
        </StyledPage>
      </>
    );
  }

  // 部屋が見つからないとき
  if (status == 1) {
    return (
      <>
        <StyledPage>
          <h5>部屋が見つかりませんでした</h5>
          <div>
            <StyledButton onClick={backHome}>戻る</StyledButton>
          </div>
        </StyledPage>
      </>
    );
  }

  const userList = [];
  for (const [idx, userName] of userNames.entries()) {
    userList.push(<StyledUser key={idx}>{userName}</StyledUser>);
  }

  // オーナー
  if (isOwner) {
    return (
      <>
        <StyledPage>
          <h4>部屋 ID</h4>
          <h1>{roomid}</h1>
          <StyledCheckbox align="left">
            <div>
              <label>
                <input
                  type="radio"
                  value="easy"
                  checked={gameMode === "easy"}
                  onChange={() => {
                    setGameMode("easy");
                  }}
                />
                <StyledCheckboxLabel>Easy</StyledCheckboxLabel>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="normal"
                  checked={gameMode === "normal"}
                  onChange={() => {
                    setGameMode("normal");
                  }}
                />
                <StyledCheckboxLabel>Normal</StyledCheckboxLabel>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="hard"
                  checked={gameMode === "hard"}
                  onChange={() => {
                    setGameMode("hard");
                  }}
                />
                <StyledCheckboxLabel>Hard</StyledCheckboxLabel>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="english"
                  checked={gameMode === "english"}
                  onChange={() => {
                    setGameMode("english");
                  }}
                />
                <StyledCheckboxLabel>English</StyledCheckboxLabel>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="chinese"
                  checked={gameMode === "chinese"}
                  onChange={() => {
                    setGameMode("chinese");
                  }}
                />
                <StyledCheckboxLabel>Chinese</StyledCheckboxLabel>
              </label>
            </div>
          </StyledCheckbox>
          <div>
            <StyledButton onClick={startGame}>ゲームを始める</StyledButton>
          </div>
          <div>
            <StyledButton onClick={cancelGame}>ゲームをキャンセル</StyledButton>
          </div>
          <StyledHr></StyledHr>
          <p>参加者</p>
          <div>{userList}</div>
        </StyledPage>
      </>
    );
  }

  // オーナーじゃない
  return (
    <>
      <StyledPage>
        <h4>部屋 ID</h4>
        <h1>{roomid}</h1>
        <div>
          <StyledButton onClick={startGame}>ゲームを始める</StyledButton>
        </div>
        <div>
          <StyledButton onClick={exitRoom}>部屋を抜ける</StyledButton>
        </div>
        <StyledHr></StyledHr>
        <p>参加者</p>
        <div>{userList}</div>
      </StyledPage>
    </>
  );
};