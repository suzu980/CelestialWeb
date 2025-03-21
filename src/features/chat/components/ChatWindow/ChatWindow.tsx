import {
  Button,
  HStack,
  Input,
  Stack,
  Text,
  useSlider,
  VStack,
} from "@chakra-ui/react";
import { useDisplayNameStore } from "@/store/namestore";
import Ansi from "@/utils/ansi-to-react";
import Dice from "@/assets/dice.wav";
import { FormEvent, useEffect, useRef, useState } from "react";
export const ChatWindow = () => {
  const { display_name, ip, port } = useDisplayNameStore();
  const [chatArr, setChatArr] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);
  const slider = useSlider({
    defaultValue: [0.2],
    thumbAlignment: "center",
    min: 0,
    max: 1,
    step: 0.01,
  });
  const scrollToBottom = () => {
    if (chatWindowRef.current == null) return;
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  };
  useEffect(() => {
    if (audioRef.current == null) return;
    audioRef.current.volume = slider.value[0];
  }, [slider.value]);
  useEffect(() => {
    if (!socketRef.current) {
      try {
        socketRef.current = new WebSocket(`ws://${ip}:${port}/ws`);

        socketRef.current.onopen = () => {
          if (socketRef.current != null && display_name != null) {
            setChatArr((prev) => [
              ...prev,
              "Welcome to \u001b[33m✨ Celestial Chat ✨ \u001b[0m",
              "\u001b[36m Hope you enjoy your stay here <3 \u001b[0m",
            ]);
            socketRef.current.send(display_name);
          }
        };

        socketRef.current.onmessage = (event) => {
          setChatArr((prev) => [...prev, event.data]);
          if (audioRef.current == null) return;
          //audioRef.current.currentTime = 0;
          //audioRef.current.play();
        };

        socketRef.current.onclose = () => {};

        socketRef.current.onerror = () => {
          setChatArr((prev) => [
            ...prev,
            "There seems to be an error attempting to connect to the server",
          ]);
        };
      } catch (err: unknown) {
        setChatArr((prev) => [
          ...prev,
          "There seems to be an error attempting to connect to the server",
        ]);
      }
    }
    if (audioRef.current == null) return;
    audioRef.current.volume = 0.2;

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [chatArr]);
  const chatRef = useRef<HTMLInputElement | null>(null);
  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socketRef?.current == null) return;
    if (chatRef.current == null) return;
    const msg = chatRef.current.value;
    if (msg?.trim() === "" || msg === null || msg === undefined) return;
    const ansimsg = `\u001b[32m${display_name}\u001b[0m: ${msg}`;
    socketRef.current.send(ansimsg);
    chatRef.current.value = "";
  };
  return (
    <Stack w={"100%"} h={"100vh"} justify={"space-between"} p={5} gapY={5}>
      <VStack
        ref={chatWindowRef}
        alignItems={"start"}
        h="100%"
        overflowY={"auto"}
        gapY={1}
        fontSize={"1.0rem"}
      >
        {chatArr.map((i, idx) => {
          return (
            <Text key={idx} overflowWrap={"break-word"} w={"100%"}>
              <Ansi>{i}</Ansi>
            </Text>
          );
        })}
      </VStack>
      <VStack h="fit" bg={"bg"} w="100%">
        <HStack h="full" w="100%" bg={"bg"}>
          {/*
          <Slider.RootProvider
            value={slider}
            maxW={"120px"}
            w={"100%"}
            size="sm"
          >
            <Slider.Label>Volume</Slider.Label>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.RootProvider>
					*/}
        </HStack>
        <audio ref={audioRef}>
          <source src={Dice} type="audio/wav" />
        </audio>
        <form onSubmit={handleSend} className="form-control">
          <HStack h="full" w="100%" bg={"bg"}>
            <Input ref={chatRef} placeholder={`Chatting as: ${display_name}`} />
            <Button type="submit">Send</Button>
          </HStack>
        </form>
      </VStack>
    </Stack>
  );
};
