// src/services/FichasMedicasService.ts
import { AntecedentesFamiliaresModel } from "@models/AntecedentesFamiliares";
import { AntecedentesPersonalesModel } from "@models/AntecedentesPersonales";
import { ConsultasMedicasModel } from "@models/ConsultasMedicas";
import { ExamenNeurologicoModel } from "@models/ExamenNeurologico";
import { ExploracionFisicaModel } from "@models/ExploracionFisica";
import { FichasMedicasModel } from "@models/FichasMedicas";
import { OrganosSentidosModel } from "@models/OrganosSentidos";
import { PacienteAdiccionModel } from "@models/PacienteAdicciones";
import { PacienteObstetricoGinecologicoModel } from "@models/PacienteObstetricosGinecologicos";
import { PacienteOperacionModel } from "@models/PacienteOperaciones";
import { PacienteModel } from "@models/Pacientes";
import { FichasMedicasRepository } from "@repositories/FichasMedicasRepositories";
import { Types } from "mongoose";
import { AntecedentesFamiliares } from "types/AntecedentesFamiliaresTypes";
import { AntecedentesPersonales } from "types/AntecedentesPersonalesTypes";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";
import { ExamenNeurologico } from "types/ExamenNeurologicoTypes";
import { ExploracionFisica } from "types/ExploracionFisicaTypes";
import { FichasMedicas, IFichasMedicasService } from "types/FichasMedicasTypes";
import { OrganosSentidos } from "types/OrganosSentidosTypes";
import { PacienteAdiccion } from "types/PacienteAdiccionesTypes";
import { PacienteObstetricoGinecologico } from "types/PacienteObstetricosGinecologicosTypes";
import { PacienteOperacion } from "types/PacienteOperacionesTypes";


// Clase personalizada para errores
class CustomError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "CustomError";
  }
}

export class FichasMedicasService implements IFichasMedicasService {
  private fichasMedicasRepository: FichasMedicasRepository;

  constructor(fichasMedicasRepository: FichasMedicasRepository) {
    this.fichasMedicasRepository = fichasMedicasRepository;
  }

  async getFichaByPaciente(pacienteId: string): Promise<FichasMedicas | null> {
    const pacienteExists = await PacienteModel.findById(pacienteId);
    if (!pacienteExists) {
      throw new CustomError("Paciente no encontrado", "PATIENT_NOT_FOUND");
    }
    return this.fichasMedicasRepository.findByPaciente(pacienteId);
  }

  async createFicha(pacienteId: string): Promise<{ ficha: FichasMedicas; message: string }> {
    try {
      const [pacienteExists, existingFicha] = await Promise.all([
        PacienteModel.findById(pacienteId),
        this.fichasMedicasRepository.findByPaciente(pacienteId),
      ]);

      if (!pacienteExists) {
        throw new CustomError("El paciente con el ID proporcionado no existe", "PATIENT_NOT_FOUND");
      }
      if (existingFicha) {
        throw new CustomError("Ya existe una ficha médica activa para este paciente", "FICHA_ALREADY_EXISTS");
      }

      const ficha = await this.fichasMedicasRepository.create({
        paciente: new Types.ObjectId(pacienteId),
        estado: "Activo",
      });

      return { ficha, message: "Ficha médica creada con éxito" };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Error interno al crear la ficha médica", "INTERNAL_SERVER_ERROR");
    }
  }

  async updateFicha(id: string, data: Partial<FichasMedicas>): Promise<{ ficha: FichasMedicas | null; message: string }> {
    const ficha = await this.fichasMedicasRepository.findById(id);
    if (!ficha) {
      return { ficha: null, message: "Ficha médica no encontrada" };
    }

    const updatedFicha = await this.fichasMedicasRepository.update(id, data);
    if (!updatedFicha) {
      throw new CustomError("No se pudo actualizar la ficha médica", "UPDATE_FAILED");
    }
    return { ficha: updatedFicha, message: "Ficha médica actualizada con éxito" };
  }

  async softDeleteFicha(id: string): Promise<{ success: boolean; message: string }> {
    const ficha = await this.fichasMedicasRepository.findById(id);
    if (!ficha) {
      return { success: false, message: "Ficha médica no encontrada" };
    }

    await this.fichasMedicasRepository.update(id, { estado: "Inactivo" });
    return { success: true, message: "Ficha médica desactivada con éxito" };
  }

  async addAntecedentesPersonales(pacienteId: string, data: Partial<AntecedentesPersonales>): Promise<{ antecedentes: AntecedentesPersonales; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const antecedentes = await new AntecedentesPersonalesModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId),
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { antecedentesPersonales: antecedentes._id });
    return { antecedentes, message: "Antecedentes personales añadidos con éxito" };
  }

  async addAntecedentesFamiliares(pacienteId: string, data: Partial<AntecedentesFamiliares>): Promise<{ antecedentes: AntecedentesFamiliares; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const antecedentes = await new AntecedentesFamiliaresModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId),
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { antecedentesFamiliares: antecedentes._id });
    return { antecedentes, message: "Antecedentes familiares añadidos con éxito" };
  }

  async addOperacionQuirurgica(pacienteId: string, data: Partial<PacienteOperacion>): Promise<{ operacion: PacienteOperacion; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const operacion = await new PacienteOperacionModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId),
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { $push: { operacionesQuirurgicas: operacion._id } });
    return { operacion, message: "Operación quirúrgica añadida con éxito" };
  }

  async addGinecologiaObstetrica(pacienteId: string, data: Partial<PacienteObstetricoGinecologico>): Promise<{ ginecologia: PacienteObstetricoGinecologico; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const ginecologia = await new PacienteObstetricoGinecologicoModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId),
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { $push: { ginecologiaObstetrica: ginecologia._id } });
    return { ginecologia, message: "Ginecología y obstetricia añadida con éxito" };
  }

  async addAdiccion(pacienteId: string, data: Partial<PacienteAdiccion>): Promise<{ adiccion: PacienteAdiccion; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const adiccion = await new PacienteAdiccionModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId),
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { $push: { adicciones: adiccion._id } });
    return { adiccion, message: "Adicción añadida con éxito" };
  }

  async addExploracionFisica(pacienteId: string, data: Partial<ExploracionFisica>): Promise<{ exploracion: ExploracionFisica; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const exploracion = await new ExploracionFisicaModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId),
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { exploracionFisica: exploracion._id });
    return { exploracion, message: "Exploración física añadida con éxito" };
  }

  async addExamenNeurologico(pacienteId: string, data: Partial<ExamenNeurologico>): Promise<{ examen: ExamenNeurologico; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const examen = await new ExamenNeurologicoModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId),
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { examenNeurologico: examen._id });
    return { examen, message: "Examen neurológico añadido con éxito" };
  }

  async addOrganosSentidos(pacienteId: string, data: Partial<OrganosSentidos>): Promise<{ organos: OrganosSentidos; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const organos = await new OrganosSentidosModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId),
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { organosSentidos: organos._id });
    return { organos, message: "Órganos de los sentidos añadidos con éxito" };
  }

  async addConsultaMedica(id: string, consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const ficha = await this.fichasMedicasRepository.findById(id);
    if (!ficha) {
      throw new CustomError("Ficha médica no encontrada", "FICHA_NOT_FOUND");
    }

    const newConsulta = await new ConsultasMedicasModel({
      ...consulta,
      paciente: ficha.paciente,
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: id }, { $push: { consultasMedicas: newConsulta._id } });
    return { consulta: newConsulta, message: "Consulta médica añadida con éxito" };
  }

  async generateReporte(id: string): Promise<any> {
    const ficha = await this.fichasMedicasRepository.findById(id);
    if (!ficha) {
      throw new CustomError("Ficha médica no encontrada", "FICHA_NOT_FOUND");
    }

    await ficha.populate([
      { path: "paciente", select: "primerNombre primerApellido cedula edad" },
      { path: "antecedentesPersonales" },
      { path: "antecedentesFamiliares" },
      { path: "operacionesQuirurgicas", populate: { path: "tipoOperacionQuirurgica" } },
      { path: "ginecologiaObstetrica", populate: { path: "tipoObstetricoGinecologico" } },
      { path: "adicciones", populate: { path: "tipoAdiccion" } },
      { path: "exploracionFisica" },
      { path: "examenNeurologico" },
      { path: "organosSentidos" },
      { path: "consultasMedicas" },
    ]);

    return {
      paciente: ficha.paciente,
      antecedentesPersonales: ficha.antecedentesPersonales || null,
      antecedentesFamiliares: ficha.antecedentesFamiliares || null,
      operacionesQuirurgicas: ficha.operacionesQuirurgicas || [],
      ginecologiaObstetrica: ficha.ginecologiaObstetrica || [],
      adicciones: ficha.adicciones || [],
      exploracionFisica: ficha.exploracionFisica || null,
      examenNeurologico: ficha.examenNeurologico || null,
      organosSentidos: ficha.organosSentidos || null,
      consultasMedicas: ficha.consultasMedicas || [],
      generatedAt: new Date(),
    };
  }
}