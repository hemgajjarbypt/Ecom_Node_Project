// class ApiError extends Error {
//     constructor(
//         statuscode,
//         message = "Something went Wrong!!",
//         errors = [],
//         stack = ""
//     ){
//         super(message);
//         this.statuscode = statuscode;
//         this.data = null;
//         this.message = message;
//         this.success = false;
//         this.errors = errors;


//         if (stack) {
//             this.stack = stack;
//         }
//         else{
//             Error.captureStackTrace(this, this.constructor);
//         }
//     }
// }

const apiError = (res, statusCode, message) => {
    return res.status(statusCode).send(message);
}

export {apiError}