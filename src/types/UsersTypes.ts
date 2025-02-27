import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  estado: "Activo" | "Inactivo"; // Nuevo campo  permissions?: string[];
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserRepository extends Repository<User> {
  findOne(query: Query): Promise<User | null>;
  findActive(query?: Query): Promise<User[]>; // Nuevo método para encontrar usuarios activos
}

export interface IUserService {
  createUser(user: User): Promise<User>;
  findUsers(query?: Query): Promise<User[]>;
  findUsersById(id: string): Promise<User | null>;
  findUsersByEmail(email: string): Promise<User | null>;
  updateUser(id: string, user: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  softDeleteUser(id: string): Promise<{ success: boolean; message: string }>; // Nuevo método para eliminar lógicamente un usuario
}