interface User {
    name: string;
    userId: string;
    roomId: string;
    host: boolean;
    presenter: boolean;
    socketId: string;
}

const users: User[] = [];

// Add user to the list
const addUser = ({ name, userId, roomId, host, presenter, socketId }: User): User[] => {
    const user = { name, userId, roomId, host, presenter, socketId };
    users.push(user);
    return users.filter((user) => user.roomId === roomId);
};

// Remove the user from the list
const removeUser = (id: string): User | undefined => {
    const index = users.findIndex((user) => user.socketId === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return undefined;
};

// Get a user from the list
const getUser = (id: string): User | undefined => {
    return users.find((user) => user.socketId === id);
};

// Get all users from the room
const getUsersInRoom = (roomId: string): User[] => {
    return users.filter((user) => user.roomId === roomId);
};

export {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};
