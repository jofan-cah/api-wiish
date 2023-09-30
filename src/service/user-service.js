import {validate} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation,
    getUserValidationid
} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            email: user.email
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "email already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            email: true,
            name: true,
            phone:true,
            age:true,
            weight:true,
            gender:true,
            height:true
        }
    });
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findFirst({
        where: {
            email: loginRequest.email
        },
        select: {
            id:true,
            email: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "email or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "email or password wrong");
    }

    const token = uuid().toString()

    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            id: user.id
        },
        select: {
            email:true,
            token: true,
            phone: true,
            age:true,
            weight:true,
            gender:true,
            id:true
        }
    });
}

const get = async (email) => {

    email = validate(getUserValidation, email);

    const user = await prismaClient.user.findFirst({
        where: {
            email: email
        },
        select: {
            email: true,
            name: true,
            phone: true,
            age:true,
            weight:true,
            gender:true,
            id:true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return user;
}

const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            email: user.email
        }
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "user is not found");
    }

    const data = {};
    if (user.name) {
        data.name = user.name;
    }
    if (user.phone) {
        data.phone = user.phone;
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }


    return prismaClient.user.update({
        where: {
            id: user.id
        },
        data: data,
        select: {
            email: true,
            name: true,
            phone:true,
            age:true,
            weight:true
        }
    })
}

const logout = async (id) => {
    id = validate(getUserValidationid, id);

    const user = await prismaClient.user.findUnique({
        where: {
            id: id
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return prismaClient.user.update({
        where: {
            id: id
        },
        data: {
            token: null
        },
        select: {
            email: true
        }
    })
}

export default {
    register,
    login,
    get,
    update,
    logout
}
