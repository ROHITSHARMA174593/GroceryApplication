import {io, Socket} from 'socket.io-client'


let socket:Socket|null=null;

const port = process.env.NEXT_PUBLIC_SOCKET_SERVER

export const getSocket = () => {
    if(!socket){
        socket = io(port)
    }
    return socket
}