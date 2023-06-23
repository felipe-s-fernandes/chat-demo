import express, { Request, Response } from "express";
import http, { Server } from "http";
import { WebSocket } from "ws";
import {
	uniqueNamesGenerator,
	animals,
	adjectives,
} from "unique-names-generator";

interface IConnection {
	socket: WebSocket;
	username: String;
}

export default class App {
	public server: Server;
	private app: express.Application;
	private connections: IConnection[] = [];

	constructor() {
		this.app = express();
		this.middleware();
		this.router();
		this.server = http.createServer(this.app);
		this.websocket();
	}

	private middleware(): void {
		this.app.use(express.json());
		this.app.use(express.static("./client/dist"));
	}

	private websocket(): void {
		const wsServer = new WebSocket.Server({ server: this.server });

		wsServer.on("connection", (ws) => {
			const newConnection: IConnection = {
				username: uniqueNamesGenerator({
					dictionaries: [adjectives, animals],
				}),
				socket: ws,
			};
			console.log(newConnection.username);
			this.connections.forEach((connection) => {
				connection.socket.send(
					`${newConnection.username} entrou na sala!`
				);
			});
			this.connections.push(newConnection);

			ws.on("message", (message) => {
				this.connections.forEach((connection) => {
					connection.socket.send(
						`${newConnection.username}: ${message}`
					);
				});
			});

			ws.on("close", () => {
				this.connections = this.connections.filter(
					(connection) =>
						connection.username !== newConnection.username
				);
			});
		});
	}

	private router(): void {
		const router = express.Router();

		router.get("/api", (req: Request, res: Response) => {
			res.status(200).send({ message: "you got me" });
		});

		this.app.use(router);
	}
}
