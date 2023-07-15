import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StandbyGame } from "../components/StandbyGame";
import { Questioner } from "../components/Questioner";
import { Result } from "../components/Result";
import { AllResult } from "../components/AllResult";
import { Answerer } from "../components/Answerer";
import { GameWebSocketError } from "../components/GameWebSocketError";
import { useSelector } from "react-redux";

export const GameState = {
  Init: 0,
  Standby: 1,
  Questioner: 2,
  AnsweredAnswerer: 3,
  Answerer: 4,
  Result: 5,
  AllResult: 6,
  Error: 7,
};

export type GameState = (typeof GameState)[keyof typeof GameState];

export type ResultJson = {
  command: string; 
  content: {
    result: {
      userName: string;
      score: number;
    }[]; 
    question: string; 
    questioner: string
  }
};

export type AllResultJson = {
  command: string; 
  content: {
    result: {
      userName: string;
      score: number;
    }[];
  }
};

export const Game = function () {
  const roomid = useSelector((state: any) => state.user.roomId);
  const [gameState, setGameState] = useState<GameState>(GameState.Init);
  const [result, setResult] = useState<ResultJson>({
    command: "", 
  content: {
    result: [], 
    question: "", 
    questioner: ""
  }
  });
  const [allResult, setAllResult] = useState<AllResultJson>({
    command: "", 
  content: {
    result: [],
  }
  });

  const navigate = useNavigate();
  const socketRef = React.useRef<WebSocket>();
  var flag = 0;

  // WebSocket
  useEffect(() => {
    if (gameState == GameState.Init && flag == 0) {
      flag = 1;
      setGameState(GameState.Standby);
      var socket = new WebSocket("ws://localhost:8000/ws?roomid=" + roomid);
      socket.onerror = () => {
        navigate("/login");
      }
      socketRef.current = socket;
      console.log("SocketRef OK");
    }
  }, []);

  const moveResult = (json: ResultJson) => {
    setResult(json);
    setGameState(GameState.Result);
  }

  const moveAllResult = (json: AllResultJson) => {
    setAllResult(json);
    setGameState(GameState.AllResult);
  }

  const moveError = () => {
    socketRef.current?.close();
    setGameState(GameState.Error);
  }

  switch (gameState) {
    case GameState.Standby:
      return (
        <>
          <StandbyGame socketRef={socketRef} setGameState={setGameState} moveError={moveError} />
        </>
      );
    case GameState.Questioner:
      return (
        <>
          <Questioner socketRef={socketRef} setGameState={setGameState} moveResult={moveResult} isQuestioner={true} moveError={moveError} />
        </>
      );
    case GameState.AnsweredAnswerer:
      return (
        <>
          <Questioner socketRef={socketRef} setGameState={setGameState} moveResult={moveResult} isQuestioner={false} moveError={moveError} />
        </>
      );
    case GameState.Answerer:
      return (
        <>
          <Answerer socketRef={socketRef} setGameState={setGameState} moveResult={moveResult} moveError={moveError} />
        </>
      );
    case GameState.Result:
      return (
        <>
          <Result socketRef={socketRef} setGameState={setGameState} result={result} moveAllResult={moveAllResult} moveError={moveError} />
        </>
      );
    case GameState.AllResult:
      return (
        <>
          <AllResult setGameState={setGameState} result={allResult}/>
        </>
      );
    default:
      return (
        <>
          <GameWebSocketError />
        </>
      );
      break;
  }

  return <></>;
};
