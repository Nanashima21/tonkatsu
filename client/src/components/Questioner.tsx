import React, { FC, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";
import { HStack, VStack } from "@chakra-ui/react";
import styled from "styled-components";
import { GameState, ResultJson } from "../views/Game";
import { Explanation, DescriptionList, CorrectUserList } from "./GameComponents";
import { useSelector } from "react-redux";
import { Answerer } from "./Answerer";
import { StyledButton, StyledHr, StyledPage, StyledScreen, StyledAnswer, StyledErrorMessage, StyledForm, StyledInput, StyledUser } from "../Styled";


type Props = {
  socketRef: React.MutableRefObject<WebSocket | undefined>;
  setGameState: (state: GameState) => void;
  moveResult: (json: ResultJson) => void;
  moveError: () => void;
  isQuestioner: boolean;
  explanations: Explanation[];
  setExplanations: (state: Explanation[]) => void;
  topic: string,
  setTopic: (state: string) => void;
  question: string,
  setQuestion: (state: string) => void;
};

type Topic = {
  topic: string;
  question: string;
};

type ButtonProps = {
  isCorrect?: boolean;
};

type Answerer = {
  user: string;
  answer: string;
  isCorrect: number;
  isJudged: boolean;
};

const QuestionerState = {
  SubmittingQuestion: 0,
  JudgingAnswer: 1,
  Result: 2,
  Wait: 3
};

type QuestionerState = (typeof QuestionerState)[keyof typeof QuestionerState];

export const Questioner: FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Topic>({
    mode: "onChange",
  });

  const socketRef = props.socketRef;
  var flag = 0;

  const joinNum = useSelector((state: any) => state.user.joinNum);
  const allAnswererNum = joinNum - 1;
  const [answererNum, setAnswererNum] = useState<number>(allAnswererNum);

  const [answerers, setAnswerers] = useState<Answerer[]>(() => []);
  const [correctUserList, setCorrectUserList] = useState<string[]>([]);

  const [status, setStatus] = useState<QuestionerState>(QuestionerState.SubmittingQuestion);

  useEffect(() => {
    console.log(answerers);
    let judgedCnt = answerers.reduce((cnt: number, answerer: Answerer) => {
      return cnt + (answerer.isJudged ? 1 : 0)
    }, 0);
    let CorrectCnt = answerers.reduce((cnt: number, answerer: Answerer) => {
      return cnt + (answerer.isCorrect == 1 ? 1 : 0)
    }, 0);
    console.log(judgedCnt, CorrectCnt, answererNum);
    if (judgedCnt == answererNum) {
      setAnswererNum((answererNum) => answererNum - CorrectCnt)
      var sendJsonCheck = {
        command: "game_questioner_check",
        content: { correctUserList },
      };
      socketRef.current?.send(JSON.stringify(sendJsonCheck));
    }  
  }, [answerers])

  // WebSocket
  useEffect(() => {
    if (flag == 0) {
      flag = 1;
      if (!props.isQuestioner) {
        setStatus(QuestionerState.JudgingAnswer);
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
            case "game_description":
              setAnswerers(() => []);
              setCorrectUserList(() => []);
              props.setTopic(msg["content"]["topic"]);
              props.setQuestion(msg["content"]["question"]);
              const explanationArgs: Explanation = {
                description: msg["content"]["description"],
                index: msg["content"]["index"],
              }
              props.setExplanations(props.explanations.concat(explanationArgs));
              setStatus(QuestionerState.JudgingAnswer);
              break;
            case "game_questioner_recieve":
              const answererArgs: Answerer = {
                ...msg["content"],
                isCorrect: 0,
                isJudged: false,
              };
              setAnswerers((answerers) => answerers.concat(answererArgs));
              break;
            case "game_answerer_checked":
              setCorrectUserList(msg["content"]["correctUserList"]);
              setStatus(QuestionerState.Result);
              break;
            case "game_show_result":
              props.setExplanations([]);
              props.moveResult(msg);
              break;
            case "game_disconnect":
              props.moveError();
              break;
          }
        };
      }
    }
  }, [props.explanations]);

  const onSubmit: SubmitHandler<Topic> = (data) => {
    props.setQuestion(data.question);
    var sendJson = {
      command: "game_questioner_question",
      content: {
        topic: props.topic,
        question: data.question,
      },
    };
    socketRef.current?.send(JSON.stringify(sendJson));
    setStatus(QuestionerState.Wait);
    reset();
  };

  const judge = (flag: boolean, ans: Answerer) => {
    let idx = 0;
    for (const [index, answerer] of answerers.entries()) {
      if (ans.user == answerer.user) idx = index;
    }
    setAnswerers((answerers) => {
      answerers[idx].isJudged = true;
      answerers[idx].isCorrect = flag ? 1 : 2
      return [...answerers];
    });

    if (flag) setCorrectUserList((CorrectUserList) => CorrectUserList.concat(ans.user));
  };

  const next_explanation = () => {
    var sendJsonNext = { command: "game_next_description" };
    socketRef.current?.send(JSON.stringify(sendJsonNext));
  };

  const question_done = () => {
    var sendJson = { command: "game_questioner_done" };
    socketRef.current?.send(JSON.stringify(sendJson));
  };

  switch (status) {

    case QuestionerState.SubmittingQuestion:
      if (props.isQuestioner) {
        return (
          <>
            <StyledPage>
              <StyledForm>
                <p>質問：{props.topic}</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <div>
                      <StyledInput
                        id="question"
                        type="text"
                        {...register("question", {
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
                        name="question"
                        render={({ message }) => <span>{message}</span>}
                      />
                    </StyledErrorMessage>
                    <StyledButton type="submit">送信</StyledButton>
                  </div>
                </form>
              </StyledForm>
            </StyledPage>
          </>
        );
      }

      return (
        <>
          <StyledPage>
            <h3>待機中...</h3>
          </StyledPage>
        </>
      );

    
    case QuestionerState.JudgingAnswer:
      return (
        <>
          <StyledPage>
            <StyledScreen>
              <VStack>
                <p>質問：{props.topic}</p>
                <p>{props.isQuestioner ? "送信したお題" : "お題"} : {props.question}</p>
                <p>
                  {props.explanations.map((explanation, i) => (
                    <div align="left">
                    <p key={i}>
                      {explanation.description}
                    </p>
                    </div>
                  ))}
                </p>
              </VStack>
              <VStack alignItems="left" p="20px" spacing="20px">
                {answerers.map((answerer, i) => (
                  <HStack key={i}>
                    <p>{answerer.user}:</p>
                    {props.isQuestioner ? (
                      // 出題者
                      <>
                        {answerer.isCorrect != 0 ? (
                          <>
                            <StyledAnswer>
                              {answerer.isCorrect == 1 ? "正解！" : "不正解..."}
                            </StyledAnswer>
                          </>
                        ) : (
                          <>
                            <StyledAnswer>{answerer.answer}</StyledAnswer>
                            <StyledQuizButton
                              onClick={() => judge(true, answerer)}
                              color="#98FB98"
                            >
                              o
                            </StyledQuizButton>
                            <StyledQuizButton
                              onClick={() => judge(false, answerer)}
                              color="#FA8072"
                            >
                              x
                            </StyledQuizButton>
                          </>
                        )}
                      </>
                    ) : (
                      // 正解した解答者
                      <>
                        <StyledAnswer>{answerer.answer}</StyledAnswer>
                      </>
                    )}
                  </HStack>
                ))}
              </VStack>
            </StyledScreen>
          </StyledPage>
        </>
      );
  
    case QuestionerState.Result:
      if (props.isQuestioner) {
        return (
          <>
            <StyledPage>
              <CorrectUserList correctUsers={correctUserList}></CorrectUserList>
              <StyledHr />
              <HStack>
                { props.explanations.length < 5 && answererNum > 0 ? (
                  <StyledButton onClick={next_explanation}>
                    次の説明に移る
                  </StyledButton>
                ):(<></>) }
                <StyledButton onClick={question_done}>
                  この問題を終了する
                </StyledButton>
              </HStack>
            </StyledPage>
          </>
        );
      }

      return (
        <>
          <StyledPage>
            <CorrectUserList correctUsers={correctUserList}></CorrectUserList>
          </StyledPage>
        </>
      );


    // chatGPT の回答待ち  
    case QuestionerState.Wait:
      return (
        <>
          <StyledPage>
            <h3>待機中...</h3>
          </StyledPage>
        </>
      );

    default:
      break;
  }

  return (
    <></>
  );
};

const StyledQuizButton = styled.button<ButtonProps>`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  color: #fff;
  text-decoration: none;
  text-align: center;
  margin: 10px 0;
  background-color: ${(props) => (props.color ? props.color : "white")};
`;