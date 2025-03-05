// src/controllers/auth/authControllers.ts
import { UserRepository } from "@repositories/userRepositories";
import { UserService } from "@services/userService";
import { Request, Response } from "express";
import { IUserRepository, IUserService, User } from "types/UsersTypes";
import jwt from "jsonwebtoken";
import { MedicoModel } from "@models/Medicos";
import { SesionMedicoModel } from "@models/SesionMedico"; // Para registrar sesiones

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body; // Validar campos requeridos
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Email, password y username son obligatorios" });
    }

    const userExists = await userService.findUsersByEmail(email);
    if (userExists) return res.status(400).json({ message: "Email already exists!!!" });

    const newUser = await userService.createUser(req.body);
    res.status(201).json({ user: newUser, message: "Usuario registrado con éxito" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({
      error: "Error al registrar usuario",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: "JWT_SECRET no está configurado en el servidor" });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son obligatorios" });
    }

    const user = await userService.findUsersByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid user or password" });

    const comparePass = await user.comparePassword(password);
    if (!comparePass) return res.status(400).json({ message: "Invalid user or password" });

    const medico = await MedicoModel.findOne({ usuario: user._id });
    if (medico) {
      medico.estaActivo = true;
      await medico.save();

      // Registrar inicio de sesión en SesionMedico
      await SesionMedicoModel.create({
        medico: medico._id,
        fechaInicio: new Date(),
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      jwtSecret,
      { expiresIn: "100h" }
    );

    res.json({ token, message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({
      error: "Error al iniciar sesión",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Ajustar a req.currentUser en lugar de req.user, según verifyToken
    const userId = req.currentUser?._id;
    if (!userId) return res.status(401).json({ message: "No se proporcionó un usuario autenticado. Verifica el token." });

    const medico = await MedicoModel.findOne({ usuario: userId });
    if (medico) {
      medico.estaActivo = false;
      await medico.save();

      // Registrar fin de sesión en SesionMedico
      const ultimaSesion = await SesionMedicoModel.findOne({ medico: medico._id, fechaFin: null });
      if (ultimaSesion) {
        ultimaSesion.fechaFin = new Date();
        await ultimaSesion.save();
      }
    }

    res.json({ message: "Cierre de sesión exitoso" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({
      error: "Error al cerrar sesión",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};