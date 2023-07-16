import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCookies } from "react-cookie";
import { ErrorMessage } from "@hookform/error-message";
import { useDispatch } from "react-redux";
import { becomeOwner, createRoom } from "../app/user/userSlice";
import { StyledButton, StyledPage, StyledForm, StyledErrorMessage, StyledInput, StyledHr, StyledLogo } from "../Styled";

type RoomId = {
  id: string;
};

export const LoginedHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [cookies, setCookie, removeCookie] = useCookies(["userID"]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<RoomId>({
    mode: "onChange",
  });

  const joinButton: SubmitHandler<RoomId> = (data) => {
    if (data.id.length != 6) {
      setErrorMsg("6桁で入力してください");
    } else {
      console.log(data.id);
      dispatch(createRoom(data.id));
      dispatch(becomeOwner(false));
      roomSuccess();
    }
    reset();
  };

  const createButton = () => {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.withCredentials = true
    let url = "http://localhost:8000/room";
    xmlHttpRequest.open("POST", url);
    xmlHttpRequest.send();

    xmlHttpRequest.onreadystatechange = () => {
      if (xmlHttpRequest.readyState == 4) {
        if (xmlHttpRequest.status == 201) {
          const jsonObj = JSON.parse(xmlHttpRequest.responseText);
          dispatch(createRoom(jsonObj.roomId));
          dispatch(becomeOwner(true));
          roomSuccess();
        } else if (xmlHttpRequest.status == 401) {
          navigate("/login");
        }
      }
    };
  };

  const roomSuccess = () => {
    navigate("/game");
  };

  const logout = () => {
    removeCookie("userID");
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.withCredentials = true;
    let url = "http://localhost:8000/logout";
    xmlHttpRequest.open("POST", url);
    xmlHttpRequest.send()

    xmlHttpRequest.onreadystatechange = () => {
      navigate("/")
    }
  };

  return (
    <>
      <StyledPage>
        <StyledForm>
          <StyledLogo style={{width: 300}} src="/src/assets/logo.png"></StyledLogo>
          <h5>userID : {cookies.userID}</h5>
          <form onSubmit={handleSubmit(joinButton)}>
            <div>
              <StyledInput
                type="text"
                placeholder="6桁の部屋ID"
                {...register("id", {
                  required: "部屋IDを入力してください",
                  maxLength: {
                    value: 6,
                    message: "6桁で入力してください",
                  },
                  pattern: {
                    value: /^[0-9-]+$/i,
                    message: "部屋IDの形式が不正です",
                  },
                })}
              />
            </div>
            <StyledErrorMessage>
              <ErrorMessage
                errors={errors}
                name="id"
                render={({ message }) => <span>{message}</span>}
              />
            </StyledErrorMessage>
            <StyledButton type="submit">部屋IDで参加</StyledButton>
            <StyledErrorMessage>{errorMsg}</StyledErrorMessage>
          </form>
          <div>
            <StyledButton onClick={createButton}>部屋を作成</StyledButton>
          </div>
          <StyledHr></StyledHr>
          <div>
            <StyledButton onClick={logout}>ログアウト</StyledButton>
          </div>
        </StyledForm>
      </StyledPage>
    </>
  );
};