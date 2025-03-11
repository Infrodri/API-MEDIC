import { Document, Types } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface AntecedentesPersonales extends Document {
  paciente: Types.ObjectId; // Referencia al modelo Paciente
  antecedentes: {
    epilepsia: boolean;
    tuberculosis: boolean;
    alergias: boolean;
    fobias: boolean;
    silicosis: boolean;
    dolorLumbal: boolean;
    enfermedadesVenereas: boolean;
    hipertensionArterial: boolean;
    asma: boolean;
    diabetes: boolean;
    cancer: boolean;
    insuficienciaRenal: boolean;
    osteoporosis: boolean;
    artritis: boolean;
    hipertension: boolean;
  };
  otrosAntecedentes: string; // Campo de texto libre
  estado: "Activo" | "Inactivo"; // Estado para eliminación lógica
}

export interface IAntecedentesPersonalesRepository extends Repository<AntecedentesPersonales> {
  findOne(query: Query): Promise<AntecedentesPersonales | null>;
  findActive(query?: Query): Promise<AntecedentesPersonales[]>;
}

export interface IAntecedentesPersonalesService {
  createAntecedentesPersonales(antecedente: Omit<AntecedentesPersonales, keyof Document>): Promise<{ antecedente: AntecedentesPersonales; message: string }>;
  findAntecedentesPersonales(query?: Query): Promise<AntecedentesPersonales[]>;
  findAntecedentesPersonalesById(id: string): Promise<AntecedentesPersonales | null>;
  updateAntecedentesPersonales(id: string, antecedente: Partial<AntecedentesPersonales>): Promise<{ antecedente: AntecedentesPersonales | null; message: string }>;
  deleteAntecedentesPersonales(id: string): Promise<{ success: boolean; message: string }>;
  softDeleteAntecedentesPersonales(id: string): Promise<{ success: boolean; message: string }>;
}