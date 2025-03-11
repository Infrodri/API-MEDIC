// src/controllers/dashboardControllers.ts
import { Request, Response } from "express";
import { ConsultasMedicasModel } from "../models/ConsultasMedicas";
import { MedicoModel } from "../models/Medicos";
import { Medico } from "../types/MedicoTypes";
import { Paciente } from "../types/PacientesTypes";
import { Types } from "mongoose";
import { RecetasMedicamentosModel } from "@models/RecetasMedicamentos";
import { ExamenesMedicosModel } from "@models/ExamenesMedicos";

// Helper para obtener el inicio y fin del día
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// Interfaz para la respuesta de especialidad
interface EspecialidadPopulated {
  _id: Types.ObjectId;
  nombre: string;
}

// 1. Estadísticas del Dashboard
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { start, end } = getTodayRange();

    const [totalConsultasHoy, consultasPendientes, totalMedicosActivos, totalRecetasHoy, totalExamenesHoy] = await Promise.all([
      ConsultasMedicasModel.countDocuments({ fecha: { $gte: start, $lte: end } }),
      ConsultasMedicasModel.countDocuments({ estadoConsulta: "Pendiente" }),
      MedicoModel.countDocuments({ estaActivo: true }),
      RecetasMedicamentosModel.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      ExamenesMedicosModel.countDocuments({ fecha: { $gte: start, $lte: end } }),
    ]);

    // Opcional: Consultas por especialidad
    const consultasPorEspecialidad = await ConsultasMedicasModel.aggregate([
      {
        $match: { fecha: { $gte: start, $lte: end } },
      },
      {
        $lookup: {
          from: "medicos",
          localField: "medico",
          foreignField: "_id",
          as: "medico",
        },
      },
      { $unwind: "$medico" },
      {
        $lookup: {
          from: "especialidades",
          localField: "medico.especialidades",
          foreignField: "_id",
          as: "especialidades",
        },
      },
      { $unwind: "$especialidades" },
      {
        $group: {
          _id: "$especialidades.nombre",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalConsultasHoy,
      consultasPendientes,
      totalMedicosActivos,
      totalRecetasHoy,
      totalExamenesHoy,
      consultasPorEspecialidad,
    });
  } catch (error) {
    console.error("Error en getDashboardStats:", error);
    res.status(500).json({
      message: "Error al obtener estadísticas",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// 2. Consultas del día
export const getConsultasHoy = async (req: Request, res: Response) => {
  try {
    const { start, end } = getTodayRange();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const consultas = await ConsultasMedicasModel.find({ fecha: { $gte: start, $lte: end } })
      .populate<{ paciente: Paciente | null }>("paciente", "primerNombre primerApellido")
      .populate<{ medico: Medico | null }>("medico", "primerNombre primerApellido especialidades")
      .populate("recetas")
      .populate("examenes")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ConsultasMedicasModel.countDocuments({ fecha: { $gte: start, $lte: end } });

    const formattedConsultas = consultas.map((consulta) => {
      const paciente = consulta.paciente;
      const nombrePaciente = paciente
        ? `${paciente.primerNombre || ""} ${paciente.primerApellido || ""}`.trim()
        : "Paciente no encontrado";

      const medico = consulta.medico;
      const nombreMedico = medico
        ? `${medico.primerNombre || ""} ${medico.primerApellido || ""}`.trim()
        : "Médico no encontrado";

      let hora = "Hora no válida";
      if (consulta.fecha) {
        const fecha = new Date(consulta.fecha);
        if (!isNaN(fecha.getTime())) {
          hora = fecha.toLocaleTimeString();
        }
      }

      const recetasSummary = consulta.recetas?.map((receta: any) => ({
        id: receta._id,
        medicamento: receta.medicamento,
        dosis: receta.dosis,
      })) || [];

      const examenesSummary = consulta.examenes?.map((examen: any) => ({
        id: examen._id,
        tipo: examen.tipo,
        fecha: examen.fecha,
      })) || [];

      return {
        id: consulta._id,
        paciente: nombrePaciente,
        medico: nombreMedico,
        hora,
        estado: consulta.estadoConsulta || "No definido",
        prioridad: consulta.prioridad || "Normal",
        recetas: recetasSummary,
        examenes: examenesSummary,
      };
    });

    res.status(200).json({
      consultas: formattedConsultas,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error en getConsultasHoy:", error);
    res.status(500).json({
      message: "Error al obtener consultas del día",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// 3. Médicos activos
export const getMedicosActivosHoy = async (req: Request, res: Response) => {
  try {
    const { start, end } = getTodayRange();

    interface MedicoConEspecialidades extends Omit<Medico, "especialidades"> {
      especialidades: EspecialidadPopulated[];
    }

    const medicos = await MedicoModel.find({ estaActivo: true })
      .populate<{ especialidades: EspecialidadPopulated[] }>("especialidades", "nombre")
      .lean() as MedicoConEspecialidades[];

    const formattedMedicos = await Promise.all(
      medicos.map(async (medico) => {
        const especialidades = Array.isArray(medico.especialidades)
          ? medico.especialidades.map((esp) => esp.nombre)
          : [];

        // Contar las consultas del médico para hoy
        const consultasHoy = await ConsultasMedicasModel.countDocuments({
          medico: medico._id,
          fecha: { $gte: start, $lte: end },
        });

        return {
          id: medico._id,
          nombre: `${medico.primerNombre || ""} ${medico.primerApellido || ""}`.trim() || "Nombre no disponible",
          especialidad: especialidades.length > 0 ? especialidades : ["Sin especialidad"],
          consultasHoy,
        };
      })
    );

    res.status(200).json(formattedMedicos);
  } catch (error) {
    console.error("Error en getMedicosActivosHoy:", error);
    res.status(500).json({
      message: "Error al obtener médicos activos",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// 4. Alertas
export const getAlertas = async (req: Request, res: Response) => {
  try {
    // Alertas por consultas urgentes
    const consultasUrgentes = await ConsultasMedicasModel.find({
      prioridad: "Urgente",
      estadoConsulta: "Pendiente",
    })
      .populate<{ paciente: Paciente | null }>("paciente", "primerNombre primerApellido")
      .lean();

    const alertasConsultas = consultasUrgentes.map((consulta) => {
      const paciente = consulta.paciente;
      const nombreCompleto = paciente
        ? `${paciente.primerNombre || ""} ${paciente.primerApellido || ""}`.trim()
        : "Paciente desconocido";

      return {
        tipo: "consulta_urgente",
        mensaje: `Consulta urgente para ${nombreCompleto}`,
        consultaId: consulta._id,
        fecha: consulta.fecha,
        prioridad: consulta.prioridad,
      };
    });

    // Alertas por recetas críticas
    const recetasCriticas = await RecetasMedicamentosModel.find()
      .populate({
        path: "consulta",
        match: { estadoConsulta: "Pendiente" }, // Filtrar consultas pendientes
        populate: { path: "paciente", select: "primerNombre primerApellido" },
      })
      .populate({
        path: "medicamento",
        match: { esCritico: true }, // Filtrar medicamentos críticos
      })
      .lean();

    const alertasRecetas = recetasCriticas
      .filter((receta: any) => receta.consulta && receta.medicamento) // Asegurarse de que tanto consulta como medicamento existan
      .map((receta: any) => {
        const consulta = receta.consulta;
        const paciente = consulta?.paciente;
        const nombreCompleto = paciente
          ? `${paciente.primerNombre || ""} ${paciente.primerApellido || ""}`.trim()
          : "Paciente desconocido";

        return {
          tipo: "receta_critica",
          mensaje: `Receta crítica (${receta.medicamento?.nombre}) para ${nombreCompleto} pendiente`,
          consultaId: consulta?._id,
          recetaId: receta._id,
          fecha: consulta?.fecha,
        };
      });

    const alertas = [...alertasConsultas, ...alertasRecetas];

    res.status(200).json(alertas);
  } catch (error) {
    console.error("Error en getAlertas:", error);
    res.status(500).json({
      message: "Error al obtener alertas",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};