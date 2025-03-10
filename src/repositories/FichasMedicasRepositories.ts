// src/repositories/FichasMedicasRepository.ts
import { FichasMedicasModel } from "../models/FichasMedicas";
import { AntecedentesPersonalesModel } from "../models/AntecedentesPersonales";
import { ExploracionFisicaModel } from "../models/ExploracionFisica";
import { ExamenNeurologicoModel } from "../models/ExamenNeurologico";
import { OrganosSentidosModel } from "../models/OrganosSentidos";
import { ConsultasMedicasModel } from "../models/ConsultasMedicas";
import { RecetasMedicamentosModel } from "../models/RecetasMedicamentos";
import { ExamenesMedicosModel } from "../models/ExamenesMedicos";
import { MedicamentosModel } from "../models/Medicamentos";
import { ConsultasMedicas, ExamenMedico, FichasMedicas, RecetaMedicamento } from "types/FichasMedicasTypes";

export interface IFichasMedicasRepository {
  findByPaciente(pacienteId: string): Promise<FichasMedicas | null>;
  createFicha(pacienteId: string, userId: string): Promise<FichasMedicas>;
  addSection(pacienteId: string, section: string, data: any, userId: string): Promise<any>;
  getSection(pacienteId: string, section: string): Promise<any>;
  createConsulta(pacienteId: string, data: Partial<ConsultasMedicas>, userId: string): Promise<ConsultasMedicas>;
  addReceta(consultaId: string, data: Partial<RecetaMedicamento>, userId: string): Promise<RecetaMedicamento>;
  addExamen(consultaId: string, data: Partial<ExamenMedico>, userId: string): Promise<ExamenMedico>;
  updateConsulta(consultaId: string, data: Partial<ConsultasMedicas>, userId: string): Promise<ConsultasMedicas>;
  getConsultaPrintable(consultaId: string): Promise<any>;
}

export class FichasMedicasRepository implements IFichasMedicasRepository {
  async findByPaciente(pacienteId: string): Promise<FichasMedicas | null> {
    return FichasMedicasModel.findOne({ paciente: pacienteId })
      .populate("antecedentesPersonales")
      .populate("operacionesQuirurgicas")
      .populate("ginecologiaObstetrica")
      .populate("adicciones")
      .populate("exploracionFisica")
      .populate("examenNeurologico")
      .populate("organosSentidos")
      .populate({
        path: "consultasMedicas",
        populate: [
          { path: "recetas", populate: { path: "medicamento" } },
          { path: "examenes" },
          { path: "medico", select: "primerNombre primerApellido" },
        ],
      })
      .populate("paciente", "primerNombre primerApellido cedula edad")
      .exec();
  }

  async createFicha(pacienteId: string, userId: string): Promise<FichasMedicas> {
    const ficha = new FichasMedicasModel({ paciente: pacienteId });
    return ficha.save();
  }

  async addSection(pacienteId: string, section: string, data: any, userId: string): Promise<any> {
    const ficha = await this.findByPaciente(pacienteId) || await this.createFicha(pacienteId, userId);
    let model, idField;

    switch (section) {
      case "antecedentesPersonales":
        model = AntecedentesPersonalesModel;
        idField = "antecedentesPersonales";
        break;
      case "exploracionFisica":
        model = ExploracionFisicaModel;
        idField = "exploracionFisica";
        break;
      case "examenNeurologico":
        model = ExamenNeurologicoModel;
        idField = "examenNeurologico";
        break;
      case "organosSentidos":
        model = OrganosSentidosModel;
        idField = "organosSentidos";
        break;
      default:
        throw new Error(`Sección no válida: ${section}. Las secciones válidas son: antecedentesPersonales, exploracionFisica, examenNeurologico, organosSentidos.`);
    }

    const newSection = await model.create({ paciente: pacienteId, ...data });
    await FichasMedicasModel.updateOne(
      { _id: ficha._id },
      { [idField]: newSection._id }
    );
    return newSection;
  }

  async getSection(pacienteId: string, section: string): Promise<any> {
    const ficha = await this.findByPaciente(pacienteId);
    if (!ficha) throw new Error("Ficha no encontrada");

    switch (section) {
      case "antecedentesPersonales":
        return AntecedentesPersonalesModel.findById(ficha.antecedentesPersonales);
      case "exploracionFisica":
        return ExploracionFisicaModel.findById(ficha.exploracionFisica);
      case "examenNeurologico":
        return ExamenNeurologicoModel.findById(ficha.examenNeurologico);
      case "organosSentidos":
        return OrganosSentidosModel.findById(ficha.organosSentidos);
      default:
        throw new Error(`Sección no válida: ${section}`);
    }
  }

  async createConsulta(pacienteId: string, data: Partial<ConsultasMedicas>, userId: string): Promise<ConsultasMedicas> {
    const ficha = await this.findByPaciente(pacienteId) || await this.createFicha(pacienteId, userId);

    if (!data.fecha || !data.motivo) {
      throw new Error("La fecha y el motivo de la consulta son requeridos");
    }

    const consulta = await ConsultasMedicasModel.create({
      ...data,
      paciente: pacienteId,
      medico: userId,
      estado: "pendiente",
    });

    await FichasMedicasModel.updateOne(
      { _id: ficha._id },
      { $push: { consultasMedicas: consulta._id } }
    );

    return consulta;
  }

  async addReceta(consultaId: string, data: Partial<RecetaMedicamento>, userId: string): Promise<RecetaMedicamento> {
    const consulta = await ConsultasMedicasModel.findById(consultaId);
    if (!consulta) throw new Error("Consulta no encontrada");

    const medicamento = await MedicamentosModel.findById(data.medicamento);
    if (!medicamento) throw new Error("Medicamento no encontrado");

    const receta = await RecetasMedicamentosModel.create({
      ...data,
      consulta: consultaId,
      medico: userId,
    });

    await ConsultasMedicasModel.updateOne(
      { _id: consultaId },
      { $push: { recetas: receta._id } }
    );

    return receta;
  }

  async addExamen(consultaId: string, data: Partial<ExamenMedico>, userId: string): Promise<ExamenMedico> {
    const consulta = await ConsultasMedicasModel.findById(consultaId);
    if (!consulta) throw new Error("Consulta no encontrada");

    const examen = await ExamenesMedicosModel.create({
      ...data,
      consulta: consultaId,
      medico: userId,
    });

    await ConsultasMedicasModel.updateOne(
      { _id: consultaId },
      { $push: { examenes: examen._id } }
    );

    return examen;
  }

  async updateConsulta(consultaId: string, data: Partial<ConsultasMedicas>, userId: string): Promise<ConsultasMedicas> {
    const consulta = await ConsultasMedicasModel.findByIdAndUpdate(
      consultaId,
      { ...data, medico: userId },
      { new: true, runValidators: true }
    );
    if (!consulta) throw new Error("Consulta no encontrada");
    return consulta;
  }

  async getConsultaPrintable(consultaId: string): Promise<any> {
    const consulta = await ConsultasMedicasModel.findById(consultaId)
      .populate("paciente", "primerNombre primerApellido cedula edad")
      .populate("medico", "primerNombre primerApellido")
      .populate({
        path: "recetas",
        populate: { path: "medicamento", select: "nombre descripcion" },
      })
      .populate("examenes")
      .exec();
    if (!consulta) throw new Error("Consulta no encontrada");

    return {
      paciente: consulta.paciente,
      medico: consulta.medico,
      fecha: consulta.fecha,
      motivo: consulta.motivo,
      diagnostico: consulta.diagnostico,
      tratamiento: consulta.tratamiento,
      notas: consulta.notas,
      estado: consulta.estado,
      recetas: consulta.recetas,
      examenes: consulta.examenes,
    };
  }
}