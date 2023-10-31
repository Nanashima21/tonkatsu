import { FC } from "react";
import { useTypewriter } from "react-simple-typewriter";
import {
  StyledDescription,
  StyledHeader,
  StyledUser,
  StyledUserList,
  StyledUserListElem,
} from "../Styled";
import { VStack } from "@chakra-ui/react";

export type Explanation = {
  description: string;
  index: number;
};

type DescriptionProps = {
  explanations: Explanation[];
  isQuestioner: boolean;
};

type CorrectUserProps = {
  correctUsers: string[];
};

export const DescriptionList: FC<DescriptionProps> = (props) => {
  const descriptionList: JSX.Element[] = [
    <StyledDescription key={-1} style={{ color: "white", height: "1px" }}>
      ・{props.explanations[0].description}
    </StyledDescription>,
  ];
  for (const [idx, content] of props.explanations.entries()) {
    if (idx == props.explanations.length - 1) {
      const [description] = useTypewriter({
        words: [content.description],
        typeSpeed: 100,
        loop: 1,
      });
      descriptionList.push(
        <StyledDescription key={content.index} style={{ fontWeight: 800 }}>
          ・{description}
        </StyledDescription>
      );
    } else {
      descriptionList.push(
        <StyledDescription key={content.index}>
          ・{content.description}
        </StyledDescription>
      );
    }
  }

  return (
    <>
      <VStack width="90%" alignItems="left" textAlign="left">
        {descriptionList}
      </VStack>
    </>
  );
};

export const CorrectUserList: FC<CorrectUserProps> = (props) => {
  const correctUserList = [];
  if (props.correctUsers.length == 0) {
    correctUserList.push(<h4>いませんでした...</h4>);
  }

  for (const [index, correctUser] of props.correctUsers.entries()) {
    correctUserList.push(
      <StyledUserListElem>
        <StyledUser key={index}>{correctUser}</StyledUser>
      </StyledUserListElem>
    );
  }

  return (
    <>
      <StyledHeader style={{ marginTop: 20 }}>正解者</StyledHeader>
      <StyledUserList>{correctUserList}</StyledUserList>
    </>
  );
};
