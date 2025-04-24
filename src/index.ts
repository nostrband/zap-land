
import { WebSocket } from "ws";
import { lnaddrServer } from "./lnaddr";

// @ts-ignore
global.WebSocket ??= WebSocket;

console.log("args", process.argv);
const port = parseInt(process.argv[2]);
lnaddrServer({ port });
