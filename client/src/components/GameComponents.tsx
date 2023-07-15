import { FC } from "react";
import styled from "styled-components";
import Typical from "react-typical";

export type Explanation = {
  description: string;
  index: number;
}

type DescriptionProps = {
  explanations: Explanation[]
};

type CorrectUserProps = {
  correctUsers: string[]
};

export const DescriptionList: FC<DescriptionProps> = (props) => {
  const descriptionList = [];
  for (const [idx, content] of props.explanations.entries()) {
    const steps = [content.description, 10];
    
    if (idx == props.explanations.length - 1) {
      descriptionList.push(<StyledUser key={content.index}><Typical steps={steps} loop={Infinity} wrapper="span" /></StyledUser>);
    } else {
      descriptionList.push(<StyledUser key={content.index}>{content.description}</StyledUser>);
    }
  }

  return (
    <>
      <div align="left">{descriptionList}</div>
    </>
  )
};

export const CorrectUserList: FC<CorrectUserProps> = (props) => {
  const correctUserList = [];
  for (const [index, correctUser] of props.correctUsers.entries()) {
    correctUserList.push(<StyledUser key={index}>{correctUser}</StyledUser>);
  }

  return (
    <>
      <h2>正解者</h2>
      <div>{correctUserList}</div>
    </>
  )
};

const StyledUser = styled.h2`
  padding: 0;
  margin: 0;
  font-weight: 500;
`;