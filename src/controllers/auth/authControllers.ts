import { UserRepository } from "@repositories/userRepositories";
import { UserService } from "@services/userService";
import { json, Request, Response } from "express";
import { IUserRepository, IUserService, User } from "types/UsersTypes";
import jwt from "jsonwebtoken";
import { MedicoModel } from "@models/Medicos";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email }: User = req.body;
    const userExists = await userService.findUsersByEmail(email);
    if (userExists) return res.status(400).json({ message: "Email already exists!!!" });

    const newUser = await userService.createUser(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  try {
    const { email, password }: User = req.body;

    const user = await userService.findUsersByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid user or password" });

    const comparePass = await user.comparePassword(password);
    if (!comparePass) return res.status(400).json({ message: "Invalid user or password" });

    const medico = await MedicoModel.findOne({ usuario: user._id });
    if (medico) {
      medico.estaActivo = true;
      await medico.save();
    }

      const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, 
      jwtSecret, { expiresIn: "100h" }
    );

    res.json({ token, message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al iniciar sesión", details: error });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Asumiendo que verifyToken agrega user al req
    if (!userId) return res.status(401).json({ message: "No se proporcionó un usuario autenticado" });

    const medico = await MedicoModel.findOne({ usuario: userId });
    if (medico) {
      medico.estaActivo = false;
      await medico.save();
    }

    res.json({ message: "Cierre de sesión exitoso" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error: "Error al cerrar sesión", details: error });
  }
};