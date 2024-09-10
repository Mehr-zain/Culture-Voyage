import { z } from 'zod'
import { FirebaseErrors } from "../constants/FirebaseErrors.js";

const ZodLoginSchema = z.object({
    email: z.string().email({ message: 'Please provide a valid email' }),
    password: z.string().min(8, { message: "Password must contains atleast 8 characters" })
})

const ZodSignupSchema = z.object({
    email: z.string().email(),
    password: z.string().refine((password) => {
        // At least one uppercase letter
        const hasUpperCase = /[A-Z]/.test(password);

        // At least one lowercase letter
        const hasLowerCase = /[a-z]/.test(password);

        // At least one special character (non-alphanumeric)
        const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(password);

        // No spaces
        const hasNoSpaces = !/\s/.test(password);

        // At least one number
        const hasNumber = /\d/.test(password);

        return hasUpperCase && hasLowerCase && hasSpecialCharacter && hasNoSpaces && hasNumber;
    }, {
        message: 'Invalid password format. It must contain at least one uppercase letter, one lowercase letter, one special character, no spaces, and at least one number.',
    }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

function formatDate(inputDate) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[inputDate.getMonth()];
    const day = inputDate.getDate();
    const year = inputDate.getFullYear();
    const formattedTimestamp = `${month} ${day}, ${year}`;
    return formattedTimestamp;
}

function getTimeElapsedSince(seconds) {
    // Create a new Date object for the given time
    const givenTime = new Date(seconds * 1000); // Convert seconds to milliseconds

    // Calculate the difference between the current time and the given time
    const difference = new Date() - givenTime;

    // Convert the difference to seconds, minutes, hours, etc.
    const elapsedSeconds = Math.floor(difference / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const elapsedMonths = Math.floor(elapsedDays / 30);
    const elapsedYears = Math.floor(elapsedDays / 365);

    // Construct the elapsed time string
    let elapsedTime = "";
    if (elapsedYears > 0) {
        elapsedTime += elapsedYears + " y ";
    }
    else if (elapsedMonths > 0) {
        elapsedTime += elapsedMonths + " mon ";
    }
    else if (elapsedDays > 0) {
        elapsedTime += elapsedDays % 30 + " d ";
    }
    else if (elapsedHours > 0) {
        elapsedTime += elapsedHours % 24 + " hr ";
    }
    else if (elapsedMinutes > 0) {
        elapsedTime += elapsedMinutes % 60 + " min ";
    }
    else
        elapsedTime += elapsedSeconds % 60 + " s";

    // Return the elapsed time string
    return elapsedTime;
}




function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    } else {
        return text;
    }
}


const FireBaseErrorHandler = (errorCode) => {
    switch (errorCode) {
        case "auth/user-not-found":
            return FirebaseErrors.userDoesNotExist
        case "auth/USER_NOT_FOUND":
            return FirebaseErrors.userDoesNotExist
        case "auth/wrong-password":
            return FirebaseErrors.incorrectPassword
        case "auth/WRONG_PASSWORD":
            return FirebaseErrors.incorrectPassword
        case "auth/user-disabled":
            return FirebaseErrors.userDisabled
        case "auth/USER_DISABLED":
            return FirebaseErrors.userDisabled
        case "auth/invalid-email":
            return FirebaseErrors.invalidEmail
        case "auth/INVALID_EMAIL":
            return FirebaseErrors.invalidEmail
        case "auth/email-already-in-use":
            return FirebaseErrors.emailAlreadyExists
        case "auth/EMAIL_ALREADY_IN_USE":
            return FirebaseErrors.emailAlreadyExists
        case 'auth/weak-password':
            return FirebaseErrors.weakPassword
        case 'auth/WEAK_PASSWORD':
            return FirebaseErrors.weakPassword
        case 'auth/operation-not-allowed':
            return FirebaseErrors.operationNotSupport
        case 'auth/OPERATION_NOT_ALLOWED':
            return FirebaseErrors.operationNotSupport
        case 'auth/auth/user-not-found':
            return FirebaseErrors.userDoesNotExist
        case 'auth/AUTH/USER_NOT_FOUND':
            return FirebaseErrors.userDoesNotExist
        case 'auth/auth/invalid-email':
            return FirebaseErrors.invalidEmail
        case 'auth/AUTH/INVALID_EMAIL':
            return FirebaseErrors.invalidEmail
        case 'auth/account-exists-with-different-credential':
            return FirebaseErrors.accountWithDifferentCredentials
        case 'auth/ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL':
            return FirebaseErrors.accountWithDifferentCredentials
        case 'auth/invalid-credential':
            return FirebaseErrors.invalidCredentials
        case 'auth/INVALID_LOGIN_CREDENTIALS':
            return FirebaseErrors.invalidCredentials
        case 'auth/invalid-verification-code':
            return FirebaseErrors.invalidVerificationCode
        case 'auth/INVALID_VERIFICATION_CODE':
            return FirebaseErrors.invalidVerificationCode
        case 'auth/invalid-verification-id':
            return FirebaseErrors.invalidVerificationId
        case 'auth/INVALID_VERIFICATION_ID':
            return FirebaseErrors.invalidVerificationId
        case 'auth/too-many-requests':
            return FirebaseErrors.tooManyRequests
        case 'auth/TOO_MANY_REQUESTS':
            return FirebaseErrors.tooManyRequests
        case 'auth/network-request-failed':
            return FirebaseErrors.networkError


    }
}
export { ZodLoginSchema, ZodSignupSchema, FireBaseErrorHandler, getTimeElapsedSince, truncateText, formatDate }