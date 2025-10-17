import * as userRepository from "../repositories/userRepositories";

export const getAllUsers = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    // ambil data user
    const users = await userRepository.getUsers(limit, offset);

    // Hitung total data
    const totalItems = await userRepository.countUsers();
    const totalPages = Math.ceil(totalItems/limit);

    return {
        data: users,
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalItems,
            totalPages,
        },
    };
};