
import { UserRepository } from "@repositories/userRepositories";
import { UserService } from "@services/userService";
import { Request, Response } from "express";
import { IUserRepository, IUserService, User } from "types/UsersTypes";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const findUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.findUsers();
    if (users.length === 0) return res.status(404).json({ message: "No hay usuarios encontrados." });

    res.json({ users, message: "Lista de usuarios obtenida con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener usuarios", details: error });
  }
};

export const findUsersById = async (req: Request, res: Response) => {
  try {
    const user = await userService.findUsersById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ user, message: "Usuario encontrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al obtener usuario", details: error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser: Omit<User, keyof Document> = req.body;
    const user = await userService.createUser(newUser);

    res.status(201).json({ user, message: "Usuario creado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: "Error al crear usuario", details: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ user, message: "Usuario actualizado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al actualizar usuario", details: error });
  }
};

export const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { success, message } = await userService.softDeleteUser(req.params.id);
    if (!success) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ success, message });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar usuario", details: error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const success = await userService.deleteUser(req.params.id);
    if (!success) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ success, message: "Usuario eliminado físicamente" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al eliminar usuario físicamente", details: error });
  }
};