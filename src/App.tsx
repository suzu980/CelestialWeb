import { NameDialog } from "./features/chat/components/NameDialog/NameDialog";
import { useDisplayNameStore } from "./store/namestore";
import { ChatWindow } from "./features/chat/components/ChatWindow/ChatWindow";

function App() {
  const { display_name, ip, port } = useDisplayNameStore();
  return (
    <>
      <NameDialog />
      {display_name !== null && ip !== null && port !== null && <ChatWindow />}
    </>
  );
}

export default App;
