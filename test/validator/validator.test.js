const expect = require('chai').expect;
const Validator = require('../../src/validator/validator');
const usersData = require('../../src/userData.json');


let newUser = {
    "name": "Sheldon Cooper",
    "email": "sheldon@caltech.com",
    "password": "P@ssw0rd",
    "role": "user",
    "news_preference": {
        "category": "science",
        "sources": ["bbc-news", "bloomberg"]
    }
}

let currentUser = {
    "email": "harry@hogwarts.com",
    "password": "P@ssw0rd"
}

let newsPreference = {
    "category": "entertainment",
    "sources": [
        "the-times-of-india",
        "bbc-news"
    ]
}

describe("Validating User Schema", function () {
    it('1. Validates userSchema has all required fields', function (done) {
        let response = Validator.isValidUserSchema(newUser);
        expect(response).equal(true);
        done();
    });

    it('2. Validates any missing field from userSchema', function (done) {
        delete newUser['role'];
        let response = Validator.isValidUserSchema(newUser);
        expect(response).equal(false);
        done();
    });
});

describe('Validates Email Id', function () {
    it('1. Asserts that email is valid', function (done) {
        let response = Validator.isValidEmail(newUser['email']);
        expect(response).equal(true);
        done();
    });

    it('2. Asserts that email is invalid', function (done) {
        newUser['email'] = 'sheldon@cooper@com';
        let response = Validator.isValidEmail(newUser['email']);
        expect(response).equal(false);
        done();
    });

    it('3. Asserts that email is unique', function (done) {
        newUser['email'] = 'sheldon@caltech.com';
        let response = Validator.isUniqueEmail(newUser['email'], usersData);
        expect(response).equal(true);
        done();
    });

    it('4. Asserts that email is not unique', function (done) {
        newUser['email'] = 'john@matrix.com';
        let response = Validator.isUniqueEmail(newUser['email'], usersData);
        expect(response).equal(false);
        done();
    });
});

describe('Validates login schema', function () {
    it('1. Asserts that valid login schema is provided', function (done) {
        let response = Validator.isValidLoginSchema(currentUser);
        expect(response).equal(true);
        done();
    });

    it('2. Asserts that a field is missing from login schema', function (done) {
        delete currentUser['password'];
        let response = Validator.isValidLoginSchema(currentUser);
        expect(response).equal(false);
        done();
    });
});

describe('Validates news preference schema', function () {
    it('1. Asserts that valid schema is provided', function (done) {
        let response = Validator.isValidPreferenceSchema(newsPreference);
        expect(response).equals(true);
        done();
    });

    it('2. Asserts that a field is missing from schema', function (done) {
        delete newsPreference['category'];
        let response = Validator.isValidPreferenceSchema(newsPreference);
        expect(response).equals(false);
        done();
    });

    it('3. Asserts that incorrect type has been provided for a field', function (done) {
        newsPreference['category'] = 'general';
        newsPreference['sources'] = 'buzzfeed';
        let response = Validator.isValidPreferenceSchema(newsPreference);
        expect(response).equals(false);
        done();
    });
});