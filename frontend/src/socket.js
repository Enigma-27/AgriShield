import { io } from 'socket.io-client';

// Connect to the Python Flask server we just built
const socket = io('http://localhost:5000');

export default socket;