import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<String[]>([]);

	const inputRef = useRef<HTMLInputElement>(null);
	const { current: ws } = useRef(new WebSocket(`ws://localhost:3001/wss`));

	useEffect(() => {
		ws.addEventListener("open", () => {
			console.log(" Connected to WebSocket server");
		});

		ws.addEventListener("message", (event) => {
			console.log("From server: ", event.data);
			setMessages((previousMessages) => [
				...previousMessages,
				event.data,
			]);
		});

		ws.addEventListener("close", () => {
			console.log("Disconnected from WebSocket server");
		});
	}, []);

	function updateMessage(event: React.ChangeEvent<HTMLInputElement>): void {
		setMessage(event.target.value);
	}

	function sendMessage() {
		if (message !== "") {
			ws.send(message);
			setMessage("");
			if (inputRef.current !== null) {
				inputRef.current.value = "";
			}
		}
	}

	return (
		<>
			<h1>Hello from dumbville</h1>
			<p>ps: check out the devtools</p>
			<div
				style={{
					border: "1px solid black",
					height: "400px",
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "flex-start",
					overflow: "scroll",
				}}
			>
				{messages.map((message, index) => (
					<p key={index}>{message}</p>
				))}
			</div>
			<input
				type="text"
				onChange={updateMessage}
				placeholder="Type here..."
				ref={inputRef}
			/>
			<button onClick={sendMessage}>Send</button>
		</>
	);
}

export default App;
