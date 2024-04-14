// import { promises } from "dns";
import mongoose from "mongoose";
// import { NextResponse } from "next/server";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Database is already connected")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "", {});

        connection.isConnected = db.connections[0].readyState;

        console.log("Database is connected is successfully");

    } catch (error) {
        console.log("Database connection is failed", error);
        process.exit(1);
    }
}

export default dbConnect;