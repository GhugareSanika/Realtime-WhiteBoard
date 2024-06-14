interface User {
    name: string;
    userId: string;
    roomId: string;
    host: boolean;
    presenter: boolean;
}

const users: User[] = [];

// Add user to the list
const addUser = ({ name, userId, roomId, host, presenter }: User): User[] => {
    const user = { name, userId, roomId, host, presenter };
    users.push(user);
    return users.filter((user) => user.roomId === roomId);
};

// Remove the user from the list
const removeUser = (id: string): User | undefined => {
    const index = users.findIndex((user) => user.userId === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return undefined;
};

// Get a user from the list
const getUser = (id: string): User | undefined => {
    return users.find((user) => user.userId === id);
};

// Get all users from the room
const getUsersInRoom = (roomId: string): User[] => {
    return users.filter((user) => user.roomId === roomId);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};
