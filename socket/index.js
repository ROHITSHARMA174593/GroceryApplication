import express from "express"
import dotenv from 'dotenv'
import http from "http"
import { Server } from "socket.io";
import axios from "axios";

const app = express();
dotenv.config();

const server = http.createServer(app)
const port = process.env.PORT;

const ios = new Server(server, {
    cors:{
        origin:process.env.NEXT_BASE_URL
    }
})
ios.on("connection", (sockett) => {
    // console.log("User Connected with id : ",sockett.id)

    sockett.on("identity", async(userId) => {
        // console.log("User Id from FrontEnd : ",userId)
        try {
            const response = await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {
                userId,
                socketId:sockett.id 
            })
            console.log("Socket connected API response:", response.data);
        } catch (error) {
            console.error("Socket connected API error:", error.message);
        }
    })

    sockett.on("update-location", async (data) => {
        const { userId, latitude, longitude } = data;
        console.log("User Id from FrontEnd : ", userId)
        console.log("Latitude from FrontEnd : ", latitude)
        console.log("Longitude from FrontEnd : ", longitude)

        try {
            await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/location`, {
                userId,
                latitude,
                longitude
            });
             console.log("Location updated successfully");
        } catch (error) {
            console.error("Location update API error:", error.message);
        }
    })

    sockett.on("disconnect", () => {
        console.log("User Disconnected with id : ", sockett.id)
    })
})


server.listen(port, () => {
    console.log(`Server Started at http://localhost:${port}`);

})