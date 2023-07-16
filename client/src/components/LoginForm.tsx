import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Link, useNavigate } from "react-router-dom";
import { StyledButton, StyledPage, StyledForm, StyledErrorMessage, StyledInput, StyledMessage } from "../Styled";

type Props = {
  isLogin: boolean;
};

type AccountData = {
  userName: string;
  password: string;
};

export const LoginForm: FC<Props> = (props) => {
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [cookies, setCookie] = useCookies(["userID"]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountData>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<AccountData> = (data) => {
    console.log(data.userName);
    console.log(data.password);
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.withCredentials = true
    let url;
    if (props.isLogin) {
      url = "http://localhost:8000/login";
      setCookie("userID", data.userName);
    } else {
      url = "http://localhost:8000/account";
    }
    xmlHttpRequest.open("POST", url);
    let jsonData = JSON.stringify(data);
    xmlHttpRequest.send(jsonData);

    xmlHttpRequest.onreadystatechange = () => {
      if (xmlHttpRequest.readyState == 4) {
        if (xmlHttpRequest.status == 200) {
          console.log(xmlHttpRequest);
          loginSuccess();
        } else {
          // if (xmlHttpRequest.status == 401) {
          loginErrorMsg();
        }
      }
    };

    reset();
  };

  const loginSuccess = () => {
    navigate("/");
  };

  const loginErrorMsg = () => {
    if (!props.isLogin) {
      setErrorMsg("このユーザIDは既に使われてます");
    } else {
      setErrorMsg("ユーザIDまたはパスワードが違います");
    }
  };

  return (
    <>
      <StyledPage>
        <StyledForm>
          {props.isLogin ? <h4>ログイン</h4> : <h4>新規登録</h4>}
          <form
            action={props.isLogin ? "/" : "/account"}
            method="GET"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div>
                <StyledInput
                  id="userID"
                  type="text"
                  placeholder="userID"
                  {...register("userName", {
                    required: "ユーザーIDを入力してください",
                    maxLength: {
                      value: 20,
                      message: "20文字以内で入力してください",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9-]+$/i,
                      message: "ユーザーIDの形式が不正です",
                    },
                  })}
                />
              </div>
              <StyledErrorMessage>
                <ErrorMessage
                  errors={errors}
                  name="userName"
                  render={({ message }) => <span>{message}</span>}
                />
              </StyledErrorMessage>
              <div>
                <StyledInput
                  id="password"
                  type="password"
                  placeholder="password"
                  role="password"
                  {...register("password", {
                    required: "パスワードを入力してください",
                    maxLength: {
                      value: 20,
                      message: "20文字以内で入力してください",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9]+$/i,
                      message: "パスワードの形式が不正です",
                    },
                  })}
                />
              </div>
              <StyledErrorMessage>
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => <span>{message}</span>}
                />
              </StyledErrorMessage>
              <StyledButton type="submit">
                {props.isLogin ? "ログイン" : "新規登録"}
              </StyledButton>
              <StyledErrorMessage>{errorMsg}</StyledErrorMessage>
            </div>
          </form>
          {props.isLogin ? (
            <StyledMessage>
              新規登録は<Link to={`/account/`}>こちら</Link>
            </StyledMessage>
          ) : (
            <StyledMessage>
              ログインは<Link to={`/Login/`}>こちら</Link>
            </StyledMessage>
          )}
        </StyledForm>
      </StyledPage>
    </>
  );
};

export default LoginForm;
