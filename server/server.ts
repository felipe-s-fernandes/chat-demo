import { config } from "dotenv";
import App from "./app";

config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

const app = new App();

app.server.listen(PORT, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);
});
