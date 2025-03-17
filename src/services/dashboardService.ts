import { Types } from "mongoose";
import { ConsultasMedicasModel } from "@models/ConsultasMedicas";
import { PacienteModel } from "@models/Pacientes";
import { RecetasMedicasModel } from "@models/RecetasMedicas";
import { ExamenesMedicosModel } from "@models/ExamenesMedicos";
import { MedicamentosModel } from "@models/Medicamentos";
import { MedicoModel } from "@models/Medicos";

export interface BaseStats {
  totalPacientes: number;
  totalConsultasHoy: number;
  consultasPendientes: number;
  totalMedicosActivos: number;
  totalRecetasHoy: number;
  totalExamenesHoy: number;
  totalConsultas: number; // Nuevo
  pacientesAtendidosPorEstado: { [key: string]: number }; // Nuevo
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
        estado: "Pendiente", // Ajustado a tu campo 'estado'
      });
      const totalMedicosActivos = await MedicoModel.countDocuments({ estado: "Activo" }); // Ajustado a tu campo 'estado'
      const totalRecetasHoy = await RecetasMedicasModel.countDocuments({
        fechaEmision: { $gte: startOfDay, $lte: endOfDay }, // Ajustado a 'fechaEmision'
      });
      const totalExamenesHoy = await ExamenesMedicosModel.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }, // Usamos 'createdAt' si no tiene 'fecha'
      });
      const totalConsultas = await ConsultasMedicasModel.countDocuments();

      // Pacientes atendidos por estado
      const pacientesPorEstado = await ConsultasMedicasModel.aggregate([
        { $group: { _id: "$estado", count: { $sum: 1 } } },
      ]);
      const pacientesAtendidosPorEstado = pacientesPorEstado.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      return {
        totalPacientes,
        totalConsultasHoy,
        consultasPendientes,
        totalMedicosActivos,
        totalRecetasHoy,
        totalExamenesHoy,
        totalConsultas,
        pacientesAtendidosPorEstado,
      };
    } catch (error) {
      console.error("Error in getBaseStats:", error);
      throw new Error("Error al obtener estadísticas base");
    }
  }

  // Consultas atendidas por mes
  async getConsultasPorMes() {
    try {
      const consultasPorMes = await ConsultasMedicasModel.aggregate([
        {
          $group: {
            _id: { $month: "$fecha" },
            total: { $sum: 1 },
          },
        },
        {
          $project: {
            mes: "$_id",
            total: 1,
            _id: 0,
          },
        },
        { $sort: { mes: 1 } },
      ]);
      return consultasPorMes.map((item) => ({
        mes: item.mes, // 1 = Enero, 2 = Febrero, etc.
        total: item.total,
      }));
    } catch (error) {
      console.error("Error in getConsultasPorMes:", error);
      throw error;
    }
  }

  // Consultas por médico
  async getConsultasPorMedico() {
    try {
      const consultasPorMedico = await ConsultasMedicasModel.aggregate([
        {
          $group: {
            _id: "$medico",
            total: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "Medico",
            localField: "_id",
            foreignField: "_id",
            as: "medicoData",
          },
        },
        { $unwind: "$medicoData" },
        {
          $project: {
            medicoId: "$_id",
            nombre: {
              $concat: ["$medicoData.primerNombre", " ", "$medicoData.primerApellido"],
            },
            email: "$medicoData.email", // Asumiendo que 'email' está en el modelo Medico
            totalConsultas: "$total",
            imagen: {
              $concat: [
                "https://ui-avatars.com/api/?name=",
                "$medicoData.primerNombre",
                "+",
                "$medicoData.primerApellido",
              ],
            },
          },
        },
      ]);
      return consultasPorMedico;
    } catch (error) {
      console.error("Error in getConsultasPorMedico:", error);
      throw error;
    }
  }

  // Consultas por paciente y estado
  async getConsultasPorPacienteEstado() {
    try {
      const consultasPorPaciente = await ConsultasMedicasModel.aggregate([
        {
          $group: {
            _id: { paciente: "$paciente", estado: "$estado" },
            total: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "Paciente",
            localField: "_id.paciente",
            foreignField: "_id",
            as: "pacienteData",
          },
        },
        { $unwind: "$pacienteData" },
        {
          $project: {
            pacienteId: "$_id.paciente",
            nombre: {
              $concat: ["$pacienteData.nombre", " ", "$pacienteData.apellido"],
            },
            email: "$pacienteData.email", // Asumiendo que 'email' está en el modelo Paciente
            estado: "$_id.estado",
            total: "$total",
            imagen: {
              $concat: [
                "https://ui-avatars.com/api/?name=",
                "$pacienteData.nombre",
                "+",
                "$pacienteData.apellido",
              ],
            },
          },
        },
      ]);
      return consultasPorPaciente;
    } catch (error) {
      console.error("Error in getConsultasPorPacienteEstado:", error);
      throw error;
    }
  }

  // Consultas con paginación
  async getConsultasHoy(page: number, limit: number) {
    const { startOfDay, endOfDay } = this.getTodayRange();
    const skip = (page - 1) * limit;

    try {
      const consultas = await ConsultasMedicasModel.find({
        fecha: { $gte: startOfDay, $lte: endOfDay },
      })
        .populate("paciente", "nombre apellido email")
        .populate("medico", "primerNombre primerApellido email")
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await ConsultasMedicasModel.countDocuments({
        fecha: { $gte: startOfDay, $lte: endOfDay },
      });

      return { consultas, total, page, totalPages: Math.ceil(total / limit) };
    } catch (error) {
      console.error("Error in getConsultasHoy:", error);
      throw error;
    }
  }

  // Pacientes con imagen generada
  async getPacientes(page: number, limit: number) {
    const skip = (page - 1) * limit;

    try {
      const pacientes = await PacienteModel.find()
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await PacienteModel.countDocuments();

      const formattedPacientes = pacientes.map((paciente) => ({
        id: paciente._id,
        nombre: `${paciente.primerNombre} ${paciente.primerApellido}`,
        estado: paciente.estado || "Sin email", // Asumiendo que 'email' puede no estar
        imagen: `https://ui-avatars.com/api/?name=${paciente.primerNombre}+${paciente.primerApellido}`,
      }));

      return { pacientes: formattedPacientes, total, page, totalPages: Math.ceil(total / limit) };
    } catch (error) {
      console.error("Error in getPacientes:", error);
      throw error;
    }
  }

  async getFormattedMedicosActivos() {
    try {
      const medicos = await MedicoModel.find({ estado: "Activo" })
        .populate("especialidades", "nombre")
        .lean();

      return medicos.map((medico: any) => ({
        id: medico._id,
        nombre: `${medico.primerNombre} ${medico.primerApellido}`,
        especialidades: medico.especialidades?.map((esp: any) => esp.nombre) || [],
        email: medico.email || "Sin email", // Asumiendo que 'email' está disponible
        imagen: `https://ui-avatars.com/api/?name=${medico.primerNombre}+${medico.primerApellido}`,
      }));
    } catch (error) {
      console.error("Error in getFormattedMedicosActivos:", error);
      throw error;
    }
  }
}

export default new DashboardService();