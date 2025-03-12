// src/services/DashboardService.ts
import { Types } from "mongoose";
import { MedicoModel } from "@models/Medicos";
import { ConsultasMedicasModel } from "@models/ConsultasMedicas";
import { PacienteModel } from "@models/Pacientes";
import { RecetasMedicasModel } from "@models/RecetasMedicas";
import { ExamenesMedicosModel } from "@models/ExamenesMedicos";
import { MedicamentosModel } from "@models/Medicamentos";

export interface BaseStats {
  totalPacientes: number;
  totalConsultasHoy: number;
  consultasPendientes: number;
  totalMedicosActivos: number;
  totalRecetasHoy: number;
  totalExamenesHoy: number;
}

interface ConsultaPorMedico {
  _id: string;
  nombreMedico: string;
  totalConsultas: number;
}

interface ConsultaHoy {
  consultas: any[];
  total: number;
}

interface FilteredDoctorsResult {
  doctors: any[];
  total: number;
}

export class DashboardService {
  private getTodayRange() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    return { startOfDay, endOfDay };
  }

  async getBaseStats(): Promise<BaseStats> {
    const { startOfDay, endOfDay } = this.getTodayRange();

    try {
      const totalPacientes = await PacienteModel.countDocuments();
      const totalConsultasHoy = await ConsultasMedicasModel.countDocuments({
        fecha: { $gte: startOfDay, $lte: endOfDay },
      });
      const consultasPendientes = await ConsultasMedicasModel.countDocuments({
        fecha: { $gte: startOfDay, $lte: endOfDay },
        estadoConsulta: "Pendiente",
      });
      const totalMedicosActivos = await MedicoModel.countDocuments({ estaActivo: true });
      const totalRecetasHoy = await RecetasMedicasModel.countDocuments({
        fecha: { $gte: startOfDay, $lte: endOfDay },
      });
      const totalExamenesHoy = await ExamenesMedicosModel.countDocuments({
        fecha: { $gte: startOfDay, $lte: endOfDay },
      });

      return {
        totalPacientes,
        totalConsultasHoy,
        consultasPendientes,
        totalMedicosActivos,
        totalRecetasHoy,
        totalExamenesHoy,
      };
    } catch (error) {
      console.error("Error in getBaseStats:", error);
      throw new Error("Method not implemented: getBaseStats failed");
    }
  }

  async getConsultasPorMedico(): Promise<ConsultaPorMedico[]> {
    const { startOfDay, endOfDay } = this.getTodayRange();

    try {
      const consultasPorMedico = await ConsultasMedicasModel.aggregate([
        {
          $match: {
            fecha: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: "$medico",
            totalConsultas: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "medicos",
            localField: "_id",
            foreignField: "_id",
            as: "medico",
          },
        },
        {
          $unwind: "$medico",
        },
        {
          $project: {
            _id: "$medico._id",
            nombreMedico: {
              $concat: ["$medico.primerNombre", " ", "$medico.primerApellido"],
            },
            totalConsultas: 1,
          },
        },
      ]);

      return consultasPorMedico;
    } catch (error) {
      console.error("Error in getConsultasPorMedico:", error);
      throw error;
    }
  }

  async getConsultasHoy(page: number, limit: number): Promise<ConsultaHoy> {
    const { startOfDay, endOfDay } = this.getTodayRange();
    const skip = (page - 1) * limit;

    try {
      const consultas = await ConsultasMedicasModel.find({
        fecha: { $gte: startOfDay, $lte: endOfDay },
      })
        .populate("paciente", "primerNombre primerApellido")
        .populate("medico", "primerNombre primerApellido")
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await ConsultasMedicasModel.countDocuments({
        fecha: { $gte: startOfDay, $lte: endOfDay },
      });

      return { consultas, total };
    } catch (error) {
      console.error("Error in getConsultasHoy:", error);
      throw error;
    }
  }

  async getFormattedMedicosActivos(): Promise<any[]> {
    try {
      const medicos = await MedicoModel.find({ estaActivo: true })
        .populate("especialidades", "nombre")
        .lean();

      return medicos.map((medico: any) => ({
        id: medico._id,
        nombre: `${medico.primerNombre} ${medico.primerApellido}`,
        especialidades: medico.especialidades?.map((esp: any) => esp.nombre) || [],
      }));
    } catch (error) {
      console.error("Error in getFormattedMedicosActivos:", error);
      throw error;
    }
  }

  async getAlertas(page: number, limit: number): Promise<any[]> {
    const { startOfDay, endOfDay } = this.getTodayRange();
    const skip = (page - 1) * limit;

    try {
      const alertas = await ConsultasMedicasModel.find({
        fecha: { $gte: startOfDay, $lte: endOfDay },
        prioridad: { $in: ["Alta", "Crítica"] },
      })
        .populate("paciente", "primerNombre primerApellido")
        .skip(skip)
        .limit(limit)
        .lean();

      return alertas.map((consulta: any) => ({
        id: consulta._id,
        paciente: `${consulta.paciente?.primerNombre || ""} ${consulta.paciente?.primerApellido || ""}`,
        prioridad: consulta.prioridad,
        estado: consulta.estadoConsulta,
      }));
    } catch (error) {
      console.error("Error in getAlertas:", error);
      throw error;
    }
  }

  async getUserStats(): Promise<any> {
    try {
      const baseStats = await this.getBaseStats();
      const consultasPorMedico = await this.getConsultasPorMedico();

      return {
        consultasAtendidas: baseStats.totalConsultasHoy - baseStats.consultasPendientes,
        consultasPendientes: baseStats.consultasPendientes,
        consultasPorMedico,
      };
    } catch (error) {
      console.error("Error in getUserStats:", error);
      throw error;
    }
  }

  async getCriticalResources(): Promise<any[]> {
    try {
      const criticalMedicines = await MedicamentosModel.find({ esCritico: true }).lean();
      return criticalMedicines.map((med: any) => ({
        id: med._id,
        nombre: med.nombre,
        stock: med.stock,
      }));
    } catch (error) {
      console.error("Error in getCriticalResources:", error);
      throw error;
    }
  }

  async getFilteredDoctors(query?: string, page: number = 1, limit: number = 10): Promise<FilteredDoctorsResult> {
    const skip = (page - 1) * limit;

    try {
      const filter: any = {};
      if (query) {
        const regex = new RegExp(query, "i");
        filter.$or = [
          { primerNombre: regex },
          { primerApellido: regex },
          { "especialidades.nombre": regex },
        ];
      }

      const doctors = await MedicoModel.find(filter)
        .populate("especialidades", "nombre")
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await MedicoModel.countDocuments(filter);

      const formattedDoctors = doctors.map((medico: any) => ({
        id: medico._id,
        nombre: `${medico.primerNombre} ${medico.primerApellido}`,
        especialidades: medico.especialidades?.map((esp: any) => esp.nombre) || [],
        estaActivo: medico.estaActivo,
      }));

      return { doctors: formattedDoctors, total };
    } catch (error) {
      console.error("Error in getFilteredDoctors:", error);
      throw error;
    }
  }

  // Nuevo método para contar páginas
  async getDoctorsPageCount(query?: string, limit: number = 10): Promise<number> {
    try {
      const filter: any = {};
      if (query) {
        const regex = new RegExp(query, "i");
        filter.$or = [
          { primerNombre: regex },
          { primerApellido: regex },
          { "especialidades.nombre": regex },
        ];
      }

      const totalDoctors = await MedicoModel.countDocuments(filter);
      return Math.ceil(totalDoctors / limit);
    } catch (error) {
      console.error("Error in getDoctorsPageCount:", error);
      throw error;
    }
  }
}

export default new DashboardService();