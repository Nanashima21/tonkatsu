import { FC } from "react";
import Typical from "react-typical";
import { StyledUser } from "../Styled";

export type Explanation = {
  description: string;
  index: number;
}

type DescriptionProps = {
  explanations: Explanation[]
  isQuestioner: boolean
};

type CorrectUserProps = {
  correctUsers: string[]
};

export const DescriptionList: FC<DescriptionProps> = (props) => {
  const descriptionList = [];
  for (const [idx, content] of props.explanations.entries()) {
    const steps = [content.description, 10];
    
    if (idx == props.explanations.length - 1 && !props.isQuestioner) {
      descriptionList.push(<li key={content.index}><h5><Typical steps={steps} loop={Infinity} wrapper="span" /></h5></li>);
    } else {
      descriptionList.push(<li><h5 key={content.index}>{content.description}</h5></li>);
    }
  }

  return (
    <>
      <div align="left"><ul>{descriptionList}</ul></div>
    </>
  )
};

export const CorrectUserList: FC<CorrectUserProps> = (props) => {
  const correctUserList = [];
  if (props.correctUsers.length == 0) {
    correctUserList.push(<h4>いませんでした...</h4>)
  }

  for (const [index, correctUser] of props.correctUsers.entries()) {
    correctUserList.push(<StyledUser key={index}>{correctUser}</StyledUser>);
  }

  return (
    <>
      <h5>正解者</h5>
      <div>{correctUserList}</div>
    </>
  )
};