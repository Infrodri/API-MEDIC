import { Query } from "types/RepositoryTypes";
import { IUserRepository, IUserService, User } from "types/UsersTypes";

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(userData: Omit<User, keyof Document>): Promise<User> {
    const newUser = await this.userRepository.create({
      ...userData,
      estado: "Activo", // Estado por defecto
    });
    return newUser;
  }

  async findUsers(query?: Query): Promise<User[]> {
    return this.userRepository.findActive(query);
  }

  async findUsersById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findUsersByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email, estado: "Activo" });
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    return this.userRepository.update(id, user);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async softDeleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }
    user.estado = "Inactivo";
    await this.userRepository.update(id, user);
    return { success: true, message: "Usuario cambiado a estado Inactivo" };
  }
}