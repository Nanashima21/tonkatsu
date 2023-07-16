import React, { FC, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";
import { GameState, ResultJson } from "../views/Game";
import { Explanation, DescriptionList, CorrectUserList } from "./GameComponents";
import { useCookies } from "react-cookie";
import { StyledButton, StyledPage, StyledForm, StyledErrorMessage, StyledInput, StyledHr } from "../Styled";

const AnswerState = {
  WaitQuestionerAnswer: 0,
  SubmittingAnswer: 1,
  WaitJudge: 2,
  Result: 3,
  Error: 4
};

type AnswerState = (typeof AnswerState)[keyof typeof AnswerState];

type Props = {
  socketRef: React.MutableRefObject<WebSocket | undefined>;
  setGameState: (state: GameState) => void;
  moveResult: (json: ResultJson, flag: boolean) => void;
  moveError: () => void;
  explanations: Explanation[];
  setExplanations: (state: Explanation[]) => void;
  topic: string,
  setTopic: (state: string) => void;
  question: string,
  setQuestion: (state: string) => void;
};

type Topic = {
  answer: string;
};

type ButtonProps = {
  isCorrect?: boolean;
};

type answerer = {
  user: string;
  answer: string;
  isCorrect: number;
};

export const Answerer: FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Topic>({
    mode: "onChange",
  });

  const navigate = useNavigate();
  const socketRef = props.socketRef;
  var flag = 0;
  const [status, setStatus] = useState<AnswerState>(AnswerState.WaitQuestionerAnswer);
  const [answer, setAnswer] = useState("");
  const [userid, setUserid, removeUserid] = useCookies(["userID"]);
  const [correctUserList, setCorrectUserList] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  // WebSocket
  useEffect(() => {
    if (flag == 0) {
      flag = 1;

      // ソケットエラー
      if (socketRef.current) {
        socketRef.current.onerror = function () {
          setStatus(AnswerState.Error);
        };
      }

      // サーバーからのソケット受け取り
      if (socketRef.current) {
        socketRef.current.onmessage = function (event) {
          var msg = JSON.parse(event.data);
          switch (msg["command"]) {
            case "game_description":
              props.setTopic(msg["content"]["topic"]);
              props.setQuestion(msg["content"]["question"]);
              const explanationArgs: Explanation = {
                description: msg["content"]["description"],
                index: msg["content"]["index"],
              }
              props.setExplanations(props.explanations.concat(explanationArgs));
              if (isCorrect) {
                props.setGameState(GameState.AnsweredAnswerer);
                break;
              }
              setStatus(AnswerState.SubmittingAnswer);
              break;
            case "game_answerer_checked":
              setCorrectUserList(msg["content"]["correctUserList"]);
              for (const correctUser of msg["content"]["correctUserList"]) {
                if (correctUser == userid.userID as string)
                  setIsCorrect(true);
              }
              setStatus(AnswerState.Result);
              break;
            case "game_show_result":
              props.setExplanations([]);
              props.moveResult(msg, false);
              break;
            case "game_disconnect":
              props.moveError();
              break;
          }
        };
      }
    }
  }, [isCorrect, props.explanations]);

  const onSubmit: SubmitHandler<Topic> = (data) => {
    setAnswer(data.answer);
    var sendJson = {
      command: "game_answerer_answer",
      content: {
        answer: data.answer
      },
    };
    socketRef.current?.send(JSON.stringify(sendJson));
    setStatus(AnswerState.WaitJudge);
    reset();
  };

  switch (status) {

  // 出題者の回答待ち  
  case AnswerState.WaitQuestionerAnswer:
    return (
      <>
        <StyledPage>
          <h3>待機中...</h3>
        </StyledPage>
      </>
    );

  // 解答を入力するとき
  case AnswerState.SubmittingAnswer:
    return (
      <>
        <StyledPage>
          <DescriptionList explanations={props.explanations}></DescriptionList>
          <StyledForm>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div>
                  <StyledInput
                    id="answer"
                    type="text"
                    {...register("answer", {
                      required: "解答を入力してください",
                      maxLength: {
                        value: 30,
                        message: "30文字以内で入力してください",
                      },
                      pattern: {
                        value: /^[A-Za-z0-9ぁ-んーァ-ヶーｱ-ﾝﾞﾟ一-龠]+$/i,
                        message: "入力の形式が不正です",
                      },
                    })}
                  />
                </div>
                <StyledErrorMessage>
                  <ErrorMessage
                    errors={errors}
                    name="answer"
                    render={({ message }) => <span>{message}</span>}
                  />
                </StyledErrorMessage>
                <StyledButton>送信</StyledButton>
              </div>
            </form>
          </StyledForm>
        </StyledPage>
      </>
    );
  
  case AnswerState.WaitJudge:
    return (
      <>
        <StyledPage>
          <DescriptionList explanations={props.explanations}></DescriptionList>
          <p>あなたの解答</p>
          <h2>{answer}</h2>
        </StyledPage>
      </>
    );
  
  case AnswerState.Result:
    return (
      <>
        <StyledPage>
          <p>あなたは...</p>
          <div>
          {isCorrect ? <h2 className="big_raibow">正解</h2>: <h2 className="sad_black">不正解</h2>}
          </div>
          <StyledHr />
          <CorrectUserList correctUsers={correctUserList}></CorrectUserList>
        </StyledPage>
      </>
    );

  default:
    break;
  }

  // エラー
  return (
    <>
      <StyledPage>
        <h3>接続に失敗しました</h3>
        <div>
          <StyledButton>戻る</StyledButton>
        </div>
      </StyledPage>
    </>
  );
};