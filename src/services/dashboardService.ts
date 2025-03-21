// src/services/dashboardService.ts
import { ConsultasMedicasRepository } from "@repositories/ConsultasMedicasRepositories";
import { PacienteModel } from "@models/Pacientes";
import { MedicoModel } from "@models/Medicos";
import { EspecialidadesModel } from "@models/Especialidades";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";
import { Paciente } from "types/PacientesTypes";
import { Medico } from "types/MedicoTypes";
import { Especialidades } from "types/EspecialidadesTypes";
import { DashboardStats, ConsultasHoyResponse, IDashboardService, SimplifiedMedico, SimplifiedPaciente } from "types/DashboardTypes";
import { Types } from "mongoose";

// Tipo para reflejar los campos poblados que devuelve find()
interface PopulatedConsulta extends ConsultasMedicas {
  _id: Types.ObjectId;
  paciente: Paciente;
  medico: Medico;
  especialidad: Especialidades;
  medicoDerivado?: Medico;
  recetas: any[];
  examenes: any[];
}
interface ConsultaPorMes {
  month: string; // Nombre del mes, ej. "Enero"
  total: number;
}

export class DashboardService implements IDashboardService {
  private consultasMedicasRepository: ConsultasMedicasRepository;

  constructor() {
    this.consultasMedicasRepository = new ConsultasMedicasRepository();
  }

  private getTodayRange() {
    const today = new Date();
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));
    return { startOfDay, endOfDay };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const { startOfDay, endOfDay } = this.getTodayRange();
  
    try {
      const totalPacientes = await PacienteModel.countDocuments();
      const totalConsultas = await this.consultasMedicasRepository.find().then(c => c.length);
      const totalMedicos = await MedicoModel.countDocuments();
      const consultasHoy = await this.consultasMedicasRepository.find({
        fecha: { $gte: startOfDay, $lte: endOfDay },
      }).then(c => c.length);
      const consultasPendientes = await this.consultasMedicasRepository.find({
        estadoConsulta: "Pendiente",
      }).then(c => c.length);
      const consultasUrgentes = await this.consultasMedicasRepository.find({
        prioridad: "Urgente",
      }).then(c => c.length);
      const medicosActivos = await MedicoModel.countDocuments({ estado: "Activo" });
  
      const rawConsultas = await this.consultasMedicasRepository.find();
      const consultas: PopulatedConsulta[] = rawConsultas as PopulatedConsulta[];
  
      const consultasPorEstado = consultas.reduce((acc, consulta) => {
        acc[consulta.estadoConsulta] = (acc[consulta.estadoConsulta] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
  
      const consultasPorEspecialidad = consultas.reduce((acc, consulta) => {
        if (consulta.especialidad && consulta.especialidad._id) { // Validación añadida
          const id = consulta.especialidad._id.toString();
          acc[id] = acc[id] || { id, nombre: consulta.especialidad.nombre, total: 0 };
          acc[id].total += 1;
        }
        return acc;
      }, {} as { [key: string]: { id: string; nombre: string; total: number } });
  
      return {
        totalPacientes,
        totalConsultas,
        totalMedicos,
        consultasHoy,
        consultasPendientes,
        consultasUrgentes,
        medicosActivos,
        consultasPorEstado,
        consultasPorEspecialidad: Object.values(consultasPorEspecialidad),
      };
    } catch (error) {
      console.error("Detailed error in getDashboardStats:", error);
      throw new Error("Error al obtener estadísticas del dashboard");
    }
  }

  async getConsultasHoy(page: number, limit: number): Promise<ConsultasHoyResponse> {
    const { startOfDay, endOfDay } = this.getTodayRange();
    const skip = (page - 1) * limit;

    try {
      const rawConsultas = await this.consultasMedicasRepository.find({
        fecha: { $gte: startOfDay, $lte: endOfDay },
      });
      const consultas: PopulatedConsulta[] = rawConsultas as PopulatedConsulta[];

      const total = consultas.length;
      const paginatedConsultas = consultas.slice(skip, skip + limit);

      return {
        consultas: paginatedConsultas.map((c) => ({
          id: c._id.toString(),
          paciente: `${c.paciente.primerNombre} ${c.paciente.primerApellido}`,
          medico: `${c.medico.primerNombre} ${c.medico.primerApellido}`,
          especialidad: c.especialidad.nombre,
          fecha: c.fecha,
          estado: c.estadoConsulta,
          prioridad: c.prioridad,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error in getConsultasHoy:", error);
      throw new Error("Error al obtener consultas de hoy");
    }
  }

  async getConsultasPorMesPorEspecialidad(year: number, month: number): Promise<{ id: string; nombre: string; total: number }[]> {
  try {
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const rawConsultas = await this.consultasMedicasRepository.find({
      fecha: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const consultas: PopulatedConsulta[] = rawConsultas as PopulatedConsulta[];

    const consultasPorEspecialidad = consultas.reduce((acc, consulta) => {
      if (consulta.especialidad && consulta.especialidad._id) { // Validación añadida
        const id = consulta.especialidad._id.toString();
        acc[id] = acc[id] || { id, nombre: consulta.especialidad.nombre, total: 0 };
        acc[id].total += 1;
      }
      return acc;
    }, {} as { [key: string]: { id: string; nombre: string; total: number } });

    return Object.values(consultasPorEspecialidad);
  } catch (error) {
    console.error("Detailed error in getConsultasPorMesPorEspecialidad:", error);
    throw new Error("Error al obtener consultas por mes y especialidad");
  }
}
async getConsultasPorMes(year: number): Promise<ConsultaPorMes[]> {
  try {
    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const rawConsultas = await this.consultasMedicasRepository.find({
      fecha: { $gte: startOfYear, $lte: endOfYear },
    });
    const consultas: PopulatedConsulta[] = rawConsultas as PopulatedConsulta[];

    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];

    const consultasPorMes = Array(12).fill(0).map((_, index) => ({
      month: monthNames[index],
      total: 0,
    }));

    consultas.forEach(consulta => {
      const monthIndex = consulta.fecha.getUTCMonth();
      consultasPorMes[monthIndex].total += 1;
    });

    console.log(`Consultas por mes para el año ${year}:`, consultasPorMes);
    return consultasPorMes;
  } catch (error) {
    console.error("Detailed error in getConsultasPorMes:", error);
    throw new Error("Error al obtener consultas por mes");
  }
}
  async getMedicosList(): Promise<SimplifiedMedico[]> {
    try {
      const medicos = await MedicoModel.find({ estado: "Activo" })
        .populate<{ especialidades: Especialidades[] }>("especialidades")
        .lean();
      return medicos.map(medico => ({
        _id: medico._id.toString(), // Convertimos explícitamente a string
        primerNombre: medico.primerNombre,
        primerApellido: medico.primerApellido,
        especialidades: medico.especialidades.map(esp => ({
          id: esp._id,
          nombre: esp.nombre,
        })),
      }));
    } catch (error) {
      console.error("Error in getMedicosList:", error);
      throw new Error("Error al obtener lista de médicos");
    }
  }

  async getPacientesEnEspera(): Promise<SimplifiedPaciente[]> {
    try {
      const pacientes = await PacienteModel.find({ estadoAtencion: "Pendiente" })
        .lean();
      return pacientes.map(paciente => ({
        _id: paciente._id.toString(), // Convertimos explícitamente a string
        primerNombre: paciente.primerNombre,
        primerApellido: paciente.primerApellido,
        telefono: paciente.telefono,
        estadoAtencion: paciente.estadoAtencion,
      }));
    } catch (error) {
      console.error("Error in getPacientesEnEspera:", error);
      throw new Error("Error al obtener pacientes en espera");
    }
  }
  
}

export default new DashboardService() as IDashboardService;