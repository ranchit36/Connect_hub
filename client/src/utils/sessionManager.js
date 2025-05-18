class SessionManager {
    static SESSION_KEY = 'currentUserSession';

    static saveUserId(userId) {
        try {
            const sessionData = {
                userId,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
            console.log('User session saved successfully');
        } catch (error) {
            console.error('Error saving user session:', error);
        }
    }

    static getUserId() {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            if (sessionData) {
                return JSON.parse(sessionData).userId;
            }
            return null;
        } catch (error) {
            console.error('Error getting user session:', error);
            return null;
        }
    }

    static clearSession() {
        try {
            localStorage.removeItem(this.SESSION_KEY);
            console.log('User session cleared successfully');
        } catch (error) {
            console.error('Error clearing user session:', error);
        }
    }
}

export default SessionManager;