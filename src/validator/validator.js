class Validator {
    static isValidUserSchema(newUser) {
        if (newUser.hasOwnProperty("name") &&
            newUser.hasOwnProperty("email") &&
            newUser.hasOwnProperty("password") &&
            newUser.hasOwnProperty("role") &&
            newUser.hasOwnProperty("news_preference")) {
                return true;
        }
        return false;
    }


    static isUniqueEmail(email, usersData) {
        let result = usersData.users.some(user => user.email === email);
        if (result) return false;
        return true;
    }


    static isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    static isValidLoginSchema(user) {
        if (user.hasOwnProperty("email") && 
            user.hasOwnProperty('password')) {
                return true;
        }
        return false;
    }


    static isValidPreferenceSchema(preference) {
        if (preference.hasOwnProperty('category') &&
            preference.hasOwnProperty('sources') &&
            typeof preference.category === 'string' &&
            Array.isArray(preference.sources)) {
                return true;
        }
        return false;
    }
}


module.exports = Validator;
