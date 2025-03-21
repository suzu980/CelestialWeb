import { useDisplayNameStore } from "@/store/namestore";
import { Button, Dialog, Field, Input } from "@chakra-ui/react";
import { FormEvent, useState } from "react";

export const NameDialog = () => {
  const [open, setOpen] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [enteredIp, setEnteredIp] = useState<string | null>(null);
  const [enteredPort, setEnteredPort] = useState<string | null>(null);
  const [enteredName, setEnteredName] = useState<string | null>(null);
  const { setDisplayName, setIp, setPort } = useDisplayNameStore();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enteredName != null) {
      setDisplayName(enteredName);
      setOpen(false);
    }
    const defaultIp = "localhost";
    const defaultPort = "6969";
    const ip = enteredIp?.trim();
    const port = enteredPort?.trim();
    const resolvedIp = ip != null && ip != "" ? ip : defaultIp;
    const resolvedPort = port != null && port != "" ? port : defaultPort;
    setIp(resolvedIp);
    setPort(resolvedPort);
  };
  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };
  if (animationComplete) return null;
  return (
    <Dialog.Root
      onExitComplete={() => handleAnimationComplete()}
      open={open}
      defaultOpen
      onOpenChange={() => null}
    >
      <Dialog.Trigger />
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Celestial Chat App</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <form onSubmit={handleSubmit}>
              <Field.Root>
                <Field.Label>IP Address to connect to:</Field.Label>
                <Input
                  placeholder="IP (Default: localhost)"
                  variant={"flushed"}
                  onChange={(e) => setEnteredIp(e.target.value)}
                />
                <Field.Label>Port number to connect to:</Field.Label>
                <Input
                  placeholder="Port (Default: 6969 *nice*)"
                  variant={"flushed"}
                  onChange={(e) => setEnteredPort(e.target.value)}
                />
                <Field.Label>Enter your display name:</Field.Label>
                <Input
                  placeholder="Your display name"
                  variant={"flushed"}
                  required
                  onChange={(e) => setEnteredName(e.target.value)}
                />
              </Field.Root>
              <Button type="submit" my={2}>
                Enter
              </Button>
            </form>
          </Dialog.Body>
          <Dialog.Footer />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
