import { ConsultasMedicasModel } from "@models/ConsultasMedicas";
import { Query } from "types/RepositoryTypes";
import { IConsultasMedicasRepository, ConsultasMedicas } from "types/ConsultasMedicasTypes";

export class ConsultasMedicasRepository implements IConsultasMedicasRepository {
  async create(data: ConsultasMedicas): Promise<ConsultasMedicas> {
    const newConsulta = new ConsultasMedicasModel(data);
    return await newConsulta.save();
  }

  async find(query?: Query): Promise<ConsultasMedicas[]> {
    return await ConsultasMedicasModel.find(query || {}).populate("paciente medico fichaMedica").exec();
  }

  async findActive(query?: Query): Promise<ConsultasMedicas[]> {
    return await ConsultasMedicasModel.find({ ...query, estado: "Activo" }).populate("paciente medico fichaMedica").exec();
  }

  async findOne(query: Query): Promise<ConsultasMedicas | null> {
    return await ConsultasMedicasModel.findOne(query).populate("paciente medico fichaMedica").exec();
  }

  async findById(id: string): Promise<ConsultasMedicas | null> {
    return await ConsultasMedicasModel.findById(id).populate("paciente medico fichaMedica").exec();
  }

  async update(id: string, data: Partial<ConsultasMedicas>): Promise<ConsultasMedicas | null> {
    return await ConsultasMedicasModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("paciente medico fichaMedica").exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ConsultasMedicasModel.findByIdAndDelete(id).exec();
    return deleted !== null;
  }
}