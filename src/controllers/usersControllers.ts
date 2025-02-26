import { UserRepository } from "@repositories/userRepositories";
import { UserService } from "@services/userService";
import { Request, Response } from "express";
import { IUserRepository, IUserService, User } from "types/UsersTypes";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const findUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.findUsers();
    if (users.length === 0) return res.status(404).json({ message: "no users Found." });

    res.json(users);
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json(error);
  }
};

export const findUsersById = async (req: Request, res: Response) => {
  try {
    const users = await userService.findUsersById(req.params.id);
    if (!users) return res.status(404).json({ message: "Not user Found" });

    res.json(users);
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json(error);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser: User = req.body;
    const result = await userService.createUser(newUser);

    res.status(201).json(result);
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json(error);
  }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
    console.log("ID del usuario a actualizar:", req.params.id);
    console.log("Datos a actualizar:", req.body);
    const result = await userService.updateUser(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "Not user Found" });

    res.json(result);
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json(error);
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    console.log("ID del usuario a eliminar:", req.params.id);
    const success = await userService.deleteUser(req.params.id);
    
    if (!success) {
      console.log("No se encontró el usuario para eliminar.");
      return res.status(404).json({ message: "Not user Found" });
    }

    res.json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    console.log("Error al eliminar:", error);
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
};
