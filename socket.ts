import { Socket, io } from "socket.io-client";
import { checkEnvironment } from "./utils/base_url";

export const socket: Socket = io(checkEnvironment());
