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
  StyledModal,
  StyledHeader,
} from "../Styled";
import {
  HStack,
  VStack,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

type Props = {
  setUserNames: (state: string[]) => void;
  socketRef: React.MutableRefObject<WebSocket | undefined>;
  setGameState: (state: GameState) => void;
  moveError: () => void;
};

export const StandbyGame: FC<Props> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isOwner = useSelector((state: any) => state.user.isOwner);
  const dispatch = useDispatch();
  console.log(isOwner);
  const socketRef = props.socketRef;
  const [userNum, setUserNum] = useState<number>(2);
  // var userNum = 2;
  const navigate = useNavigate();
  var flag = 0;
  const [difficulty, setdifficulty] = useState("normal");
  const [language, setlanguage] = useState("japanese");

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
    var sendJson = {
      command: "start_game",
      content: { game_mode: difficulty + "," + language },
    };
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
        <Box>
          {isOwner ? <h4>部屋を作成中...</h4> : <h4>部屋を検索中...</h4>}
        </Box>
      </>
    );
  }

  // 部屋が見つからないとき
  if (status == 1) {
    return (
      <>
        <VStack>
          <h4>部屋が見つかりませんでした</h4>
          <StyledButton onClick={backHome}>戻る</StyledButton>
        </VStack>
      </>
    );
  }

  return (
    <>
      <Box height="100%" overflowY="scroll">
        <VStack width="100%" height="100%" justifyContent="space-between">
          <HStack>
            {isOwner ? (
              <h4>難易度と言語を選択してください</h4>
            ) : (
              <h4>ホストの選択を待機しています</h4>
            )}
            <a style={{ cursor: "pointer" }} onClick={onOpen}>
              <QuestionOutlineIcon boxSize={20} />
            </a>
          </HStack>
          <HStack width="100%" gap="5%" marginLeft="15%">
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
                    checked={difficulty === "easy"}
                    onChange={() => {
                      setdifficulty("easy");
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
                    checked={difficulty === "normal"}
                    onChange={() => {
                      setdifficulty("normal");
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
                    checked={difficulty === "hard"}
                    onChange={() => {
                      setdifficulty("hard");
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
                    checked={language === "japanese"}
                    onChange={() => {
                      setlanguage("japanese");
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
                    checked={language === "english"}
                    onChange={() => {
                      setlanguage("english");
                    }}
                  />
                  <label htmlFor="english">英語</label>
                </div>
                <div className="item">
                  <input
                    type="radio"
                    value="chinese"
                    id="chinese"
                    className="radio-button"
                    disabled={!isOwner}
                    checked={language === "chinese"}
                    onChange={() => {
                      setlanguage("chinese");
                    }}
                  />
                  <label htmlFor="chinese">中国語</label>
                </div>
              </StyledRadioButtonGroup>
            </VStack>
          </HStack>
          <StyledHr />
          <HStack width="80%" gap="10%" marginRight="5%" paddingBottom="5%">
            <StyledButton onClick={startGame} disabled={!isOwner}>
              ゲームを始める
            </StyledButton>
            {isOwner ? (
              <StyledButton onClick={cancelGame}>
                ゲームをキャンセル
              </StyledButton>
            ) : (
              <StyledButton onClick={exitRoom}>部屋を抜ける</StyledButton>
            )}
          </HStack>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <StyledModal style={{ marginTop: "8%" }}>
            <ModalHeader>
              <h3>難易度について</h3>
            </ModalHeader>
            <ModalBody>
              <h5 style={{ textAlign: "left", paddingLeft: "5%" }}>
                かんたん : 特に指定はしていません。
                <br /> <br />
                &nbsp; &nbsp;
                例）・食材は豚肉を使い、パン粉で衣を付けて揚げる料理です。
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                ・通常は豚ロースや豚ヒレを使用し、薄くスライスして調理されます。
              </h5>
              <h5 style={{ textAlign: "left", paddingLeft: "5%" }}>
                ふつう : 「極めて抽象的に記述してください。」と指定しています。
                <br /> <br />
                &nbsp; &nbsp; 例）・柔らかい肉を衣で包み、揚げる料理。
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                ・香ばしくて外側はサクサク、内側はジューシーな食感。
              </h5>
              <h5 style={{ textAlign: "left", paddingLeft: "5%" }}>
                むずかしい :
                「極めて抽象的に、分かりにくく記述してください。」と指定しています。
                <br /> <br />
                &nbsp; &nbsp;
                例）・通常はタレやソースをつけて食べるが、その他の調味料とも相性が良い。
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                ・日本の伝統的な食文化において重要な位置を占め、多くの食事の一部として愛されている。
              </h5>
            </ModalBody>

            <ModalFooter>
              <StyledButton style={{ width: 100 }} onClick={onClose}>
                閉じる
              </StyledButton>
            </ModalFooter>
          </StyledModal>
        </ModalContent>
      </Modal>
    </>
  );
};
