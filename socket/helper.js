const EmailtoSocketIdMap = new Map();

const SocketIdtoEmailMap = new Map();

const addEmailToSocketId = (email, socketId) => {
    EmailtoSocketIdMap.set(email, socketId);
    SocketIdtoEmailMap.set(socketId, email);
    }
const removeEmailToSocketId = (email) => {
    EmailtoSocketIdMap.delete(email);
    }

const removeSocketIdToEmail = (socketId) => {
    SocketIdtoEmailMap.delete(socketId);
    }

const getEmailFromSocketId = (socketId) => {
    return SocketIdtoEmailMap.get(socketId);
    }

const getSocketIdFromEmail = (email) => {
    return EmailtoSocketIdMap.get(email);
    }

module.exports = {
    addEmailToSocketId,
    removeEmailToSocketId,
    removeSocketIdToEmail,
    getEmailFromSocketId,
    getSocketIdFromEmail
    }
