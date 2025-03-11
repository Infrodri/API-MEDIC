import { Types } from "mongoose"; // Importar Types para ObjectId
import { IFichasMedicasService, FichasMedicas } from "types/FichasMedicasTypes";
import { PacienteModel } from "@models/Pacientes";
import { AntecedentesPersonalesModel } from "@models/AntecedentesPersonales";
import { AntecedentesFamiliaresModel } from "@models/AntecedentesFamiliares";
import { PacienteOperacionModel } from "@models/PacienteOperaciones";
import { PacienteObstetricoGinecologicoModel } from "@models/PacienteObstetricosGinecologicos";
import { PacienteAdiccionModel } from "@models/PacienteAdicciones";
import { ExploracionFisicaModel } from "@models/ExploracionFisica";
import { ExamenNeurologicoModel } from "@models/ExamenNeurologico";
import { OrganosSentidosModel } from "@models/OrganosSentidos";
import { ConsultasMedicasModel } from "@models/ConsultasMedicas";
import { FichasMedicasModel } from "@models/FichasMedicas";
import { AntecedentesPersonales } from "types/AntecedentesPersonalesTypes";
import { AntecedentesFamiliares } from "types/AntecedentesFamiliaresTypes";
import { PacienteOperacion } from "types/PacienteOperacionesTypes";
import { PacienteObstetricoGinecologico } from "types/PacienteObstetricosGinecologicosTypes";
import { PacienteAdiccion } from "types/PacienteAdiccionesTypes";
import { ExploracionFisica } from "types/ExploracionFisicaTypes";
import { ExamenNeurologico } from "types/ExamenNeurologicoTypes";
import { OrganosSentidos } from "types/OrganosSentidosTypes";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";
import { FichasMedicasRepository } from "@repositories/FichasMedicasRepositories";

export class FichasMedicasService implements IFichasMedicasService {
  private fichasMedicasRepository: FichasMedicasRepository;

  constructor(fichasMedicasRepository: FichasMedicasRepository) {
    this.fichasMedicasRepository = fichasMedicasRepository;
  }

  async getFichaByPaciente(pacienteId: string): Promise<FichasMedicas | null> {
    const pacienteExists = await PacienteModel.findById(pacienteId);
    if (!pacienteExists) throw new Error("Paciente no encontrado");
    return this.fichasMedicasRepository.findByPaciente(pacienteId);
  }

  async createFicha(pacienteId: string): Promise<{ ficha: FichasMedicas; message: string }> {
    try {
      const [pacienteExists, existingFicha] = await Promise.all([
        PacienteModel.findById(pacienteId),
        this.fichasMedicasRepository.findByPaciente(pacienteId),
      ]);

      if (!pacienteExists) throw new Error("Paciente no encontrado");
      if (existingFicha) throw new Error("Ya existe una ficha médica para este paciente");

      const ficha = await this.fichasMedicasRepository.create({
        paciente: new Types.ObjectId(pacienteId), // Convertir a ObjectId
        estado: "Activo",
      });

      return { ficha, message: "Ficha médica creada con éxito" };
    } catch (error: any) { // Tipar como any
      throw new Error(error.message || "Error al crear la ficha médica");
    }
  }

  async updateFicha(id: string, data: Partial<FichasMedicas>): Promise<{ ficha: FichasMedicas | null; message: string }> {
    const ficha = await this.fichasMedicasRepository.findById(id);
    if (!ficha) return { ficha: null, message: "Ficha médica no encontrada" };

    const updatedFicha = await this.fichasMedicasRepository.update(id, data);
    return { ficha: updatedFicha, message: "Ficha médica actualizada con éxito" };
  }

  async softDeleteFicha(id: string): Promise<{ success: boolean; message: string }> {
    const ficha = await this.fichasMedicasRepository.findById(id);
    if (!ficha) return { success: false, message: "Ficha médica no encontrada" };

    await this.fichasMedicasRepository.update(id, { estado: "Inactivo" });
    return { success: true, message: "Ficha médica desactivada con éxito" };
  }

  async addAntecedentesPersonales(pacienteId: string, data: Partial<AntecedentesPersonales>): Promise<{ antecedentes: AntecedentesPersonales; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const antecedentes = await new AntecedentesPersonalesModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId), // Convertir a ObjectId
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { antecedentesPersonales: antecedentes._id });
    return { antecedentes, message: "Antecedentes personales añadidos con éxito" };
  }

  async addAntecedentesFamiliares(pacienteId: string, data: Partial<AntecedentesFamiliares>): Promise<{ antecedentes: AntecedentesFamiliares; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const antecedentes = await new AntecedentesFamiliaresModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId), // Convertir a ObjectId
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { antecedentesFamiliares: antecedentes._id });
    return { antecedentes, message: "Antecedentes familiares añadidos con éxito" };
  }

  async addOperacionQuirurgica(pacienteId: string, data: Partial<PacienteOperacion>): Promise<{ operacion: PacienteOperacion; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const operacion = await new PacienteOperacionModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId), // Convertir a ObjectId
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { $push: { operacionesQuirurgicas: operacion._id } });
    return { operacion, message: "Operación quirúrgica añadida con éxito" };
  }

  async addGinecologiaObstetrica(pacienteId: string, data: Partial<PacienteObstetricoGinecologico>): Promise<{ ginecologia: PacienteObstetricoGinecologico; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const ginecologia = await new PacienteObstetricoGinecologicoModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId), // Convertir a ObjectId
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { $push: { ginecologiaObstetrica: ginecologia._id } });
    return { ginecologia, message: "Ginecología y obstetricia añadida con éxito" };
  }

  async addAdiccion(pacienteId: string, data: Partial<PacienteAdiccion>): Promise<{ adiccion: PacienteAdiccion; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const adiccion = await new PacienteAdiccionModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId), // Convertir a ObjectId
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { $push: { adicciones: adiccion._id } });
    return { adiccion, message: "Adicción añadida con éxito" };
  }

  async addExploracionFisica(pacienteId: string, data: Partial<ExploracionFisica>): Promise<{ exploracion: ExploracionFisica; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const exploracion = await new ExploracionFisicaModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId), // Convertir a ObjectId
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { exploracionFisica: exploracion._id });
    return { exploracion, message: "Exploración física añadida con éxito" };
  }

  async addExamenNeurologico(pacienteId: string, data: Partial<ExamenNeurologico>): Promise<{ examen: ExamenNeurologico; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const examen = await new ExamenNeurologicoModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId), // Convertir a ObjectId
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { examenNeurologico: examen._id });
    return { examen, message: "Examen neurológico añadido con éxito" };
  }

  async addOrganosSentidos(pacienteId: string, data: Partial<OrganosSentidos>): Promise<{ organos: OrganosSentidos; message: string }> {
    const ficha = await this.fichasMedicasRepository.findByPaciente(pacienteId) || (await this.createFicha(pacienteId)).ficha;
    const organos = await new OrganosSentidosModel({
      ...data,
      paciente: new Types.ObjectId(pacienteId), // Convertir a ObjectId
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: ficha._id }, { organosSentidos: organos._id });
    return { organos, message: "Órganos de los sentidos añadidos con éxito" };
  }

  async addConsultaMedica(id: string, consulta: Partial<ConsultasMedicas>): Promise<{ consulta: ConsultasMedicas; message: string }> {
    const ficha = await this.fichasMedicasRepository.findById(id);
    if (!ficha) throw new Error("Ficha médica no encontrada");

    const newConsulta = await new ConsultasMedicasModel({
      ...consulta,
      paciente: ficha.paciente, // Ya es ObjectId o Paciente, no necesita conversión
      estado: "Activo",
    }).save();
    await FichasMedicasModel.updateOne({ _id: id }, { $push: { consultasMedicas: newConsulta._id } });
    return { consulta: newConsulta, message: "Consulta médica añadida con éxito" };
  }

  async generateReporte(id: string): Promise<any> {
    const ficha = await this.fichasMedicasRepository.findById(id);
    if (!ficha) throw new Error("Ficha médica no encontrada");

    return {
      paciente: ficha.paciente,
      antecedentesPersonales: ficha.antecedentesPersonales,
      antecedentesFamiliares: ficha.antecedentesFamiliares,
      operacionesQuirurgicas: ficha.operacionesQuirurgicas,
      ginecologiaObstetrica: ficha.ginecologiaObstetrica,
      adicciones: ficha.adicciones,
      exploracionFisica: ficha.exploracionFisica,
      examenNeurologico: ficha.examenNeurologico,
      organosSentidos: ficha.organosSentidos,
      consultasMedicas: ficha.consultasMedicas,
      generatedAt: new Date(),
    };
  }
}