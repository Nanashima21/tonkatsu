import { useState } from "react";
import { StyledButton, StyledNavbar } from "../Styled";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { StyledModal, StyledHeader } from "../Styled";

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [dialogPage, setDialogpage] = useState<number>(1);

  const dialogPageNum = 5;

  const movePage = (dir: number) => {
    setDialogpage((dialogPage) => {
      if (dialogPage + dir <= 0 || dialogPageNum < dialogPage + dir)
        return dialogPage;
      return dialogPage + dir;
    });
  };

  const dialogContent = () => {
    switch (dialogPage) {
      case 1:
        return (
          <>
            <img width="80%" src="/src/assets/img0.png"></img>
            <h5>
              TonkatsuはChatGPTを用いたアイスブレイクアプリです！
              <br />
              クイズ形式でお互いのことを知ることができます！！
            </h5>
          </>
        );
      case 2:
        return (
          <>
            <img width="80%" src="/src/assets/img1.png"></img>
            <p>
              プレイヤーはホストによって作成された部屋のIDを用いて部屋に参加します。
              <br />
              ホストが難易度と言語を選択してゲームを開始します。
            </p>
          </>
        );

      case 3:
        return (
          <>
            <img width="80%" src="/src/assets/img2.png"></img>
            <p>
              参加者の中で1名が出題者として割り当てられます。
              <br />
              出題者は与えられた質問に対してお題を入力して送信します。
            </p>
          </>
        );

      case 4:
        return (
          <>
            <img width="90%" src="/src/assets/img3.png"></img>
            <p>
              ChatGPTはお題について説明の箇条書きで返し、参加者の画面に随時お題のヒントとして出力します。
              <br />
              ヒントは全部で5つあります。
              <br />
              回答者は質問とヒントを予想してを回答を入力して送信します。
              <br />
              出題者は回答者の回答が合っているかの答え合わせをします。
            </p>
          </>
        );

      case 5:
        return (
          <>
            <img width="80%" src="/src/assets/img4.png"></img>
            <p>
              全ての回答者が正解する、または、5回回答をすることで1つのターンが終了します。
              <br />
              より少ないヒントで正解できた回答者ほど高得点を得ることができます。
              <br />
              全ての参加者が出題者を経験することでゲームは終了します。
            </p>
          </>
        );

      default:
        return;
    }
  };

  return (
    <>
      <StyledNavbar>
        <a href="http://localhost:5173/">
          <img height="100%" src="/src/assets/title.png"></img>
        </a>
        <a style={{ cursor: "pointer" }} onClick={onOpen}>
          使い方
        </a>
      </StyledNavbar>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <StyledModal>
            <ModalHeader>
              {dialogPage > 1 ? (
                <>
                  <h3>Tonkatsuの使い方</h3>
                  <StyledHeader>
                    使用イメージ {dialogPage - 1}/{dialogPageNum - 1}
                  </StyledHeader>
                </>
              ) : (
                <>
                  <h3>Tonkatsuとは？</h3>
                </>
              )}
            </ModalHeader>
            <ModalBody>
              <HStack justifyContent="space-between">
                <a
                  type="button"
                  style={{ cursor: "pointer" }}
                  onClick={() => movePage(-1)}
                >
                  <ChevronLeftIcon boxSize={50} />
                </a>
                <Box>{dialogContent()}</Box>
                <a style={{ cursor: "pointer" }} onClick={() => movePage(1)}>
                  <ChevronRightIcon boxSize={50} />
                </a>
              </HStack>
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
