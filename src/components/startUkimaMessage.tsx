import { useRecoilState, useRecoilValue } from "recoil";

import {
    Box,
    Button,
    Container,
    createStyles,
    Flex,
    LoadingOverlay,
    Title,
    Text,
    Anchor,
    useMantineTheme,
    Modal,
    FocusTrap,
    Center,
    Chip,
} from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

export type FormValuesType = {
    pass: string;
};

const messageSet = {
    title: "ネイバーズ浮間公園のみなさま",
    message:
        "はじめまして、10月16日から206号に入居する清水 光です。年齢は52才。妻と子供2人、自宅は隣の駅  北赤羽に住んでいます。ネイバーズ浮間公園は主に仕事場として利用しますので朝 来て夜帰る生活になります。\n\n時々、子どもたち（中3女、小5男）が遊びに来ると思いますが、なるべくうるさくしないよう言い聞かせています。多少迷惑かけてしまったらゴメンナサイ。\n\n<プロフィール>\n清水 光（しみず ひかる）52才\n武蔵野美術大学卒→広告代理店でアートディレクターとして勤務→独立して今年で12年目→コロナの影響を受け仕事激減→大ピンチ",
};
const StartUkimaMessage = ({
    displayUkimaMessage,
    setDisplayUkimaMessage,
}: {
    displayUkimaMessage: boolean;
    setDisplayUkimaMessage: Dispatch<SetStateAction<boolean>>;
}) => {
    //

    return (
        <Modal
            size="lg"
            opened={displayUkimaMessage}
            onClose={() => {
                setDisplayUkimaMessage(false);
            }}
            overlayProps={{
                color: "#999",
                opacity: 0.5,
                blur: 20,
            }}
            padding="2em"
            trapFocus={false}
        >
            <Title
                order={4}
                w="fit-content"
                fz="1em"
                p="0 2em"
                ff="Futura-PT"
                bg="#AAA"
                color="white"
                sx={{ borderRadius: "9999px" }}
            >
                Message
            </Title>
            <Title order={2} fz="1.2em" fw="normal" mt="1em">
                {messageSet.title}
            </Title>
            <Text mt="1em" fz="1em" lh="1.8em" ta="justify" sx={{ whiteSpace: "pre-wrap" }}>
                {messageSet.message}
            </Text>

            <Flex mt="3em" w="100%" justify="flex-end">
                <Button
                    variant="outline"
                    px="3em"
                    onClick={() => {
                        setDisplayUkimaMessage(false);
                    }}
                >
                    CLOSE
                </Button>
            </Flex>
        </Modal>
    );
};

export default StartUkimaMessage;
