// src/controllers/dashboardControllers.ts
import { Request, Response } from "express";
import { ConsultasMedicasModel } from "../models/ConsultasMedicas";
import { MedicoModel } from "../models/Medicos";
import { Medico } from "../types/MedicoTypes";
import { Paciente } from "../types/PacientesTypes";
import { Types } from "mongoose";

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
    
    const [totalConsultasHoy, consultasPendientes, totalMedicosActivos] = await Promise.all([
      ConsultasMedicasModel.countDocuments({ fecha: { $gte: start, $lte: end } }),
      ConsultasMedicasModel.countDocuments({ estadoConsulta: "Pendiente" }),
      MedicoModel.countDocuments({ estaActivo: true })
    ]);

    res.status(200).json({
      totalConsultasHoy,
      consultasPendientes,
      totalMedicosActivos,
    });
  } catch (error) {
    console.error("Error en getDashboardStats:", error);
    res.status(500).json({ 
      message: "Error al obtener estadísticas", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// 2. Consultas del día
export const getConsultasHoy = async (req: Request, res: Response) => {
  try {
    const { start, end } = getTodayRange();

    const consultas = await ConsultasMedicasModel.find({ fecha: { $gte: start, $lte: end } })
      .populate<{ paciente: Paciente | null }>("paciente", "primerNombre primerApellido")
      .populate<{ medico: Medico | null }>("medico", "primerNombre primerApellido especialidades")
      .lean();

    const formattedConsultas = consultas.map((consulta) => {
      // Manejo seguro del paciente
      const paciente = consulta.paciente;
      const nombrePaciente = paciente
        ? `${paciente.primerNombre || ''} ${paciente.primerApellido || ''}`.trim()
        : "Paciente no encontrado";

      // Manejo seguro del médico
      const medico = consulta.medico;
      const nombreMedico = medico
        ? `${medico.primerNombre || ''} ${medico.primerApellido || ''}`.trim()
        : "Médico no encontrado";

      // Formateo seguro de la fecha
      let hora = "Hora no válida";
      if (consulta.fecha) {
        const fecha = new Date(consulta.fecha);
        if (!isNaN(fecha.getTime())) {
          hora = fecha.toLocaleTimeString();
        }
      }

      return {
        id: consulta._id,
        paciente: nombrePaciente,
        medico: nombreMedico,
        hora,
        estado: consulta.estadoConsulta || "No definido",
        prioridad: consulta.prioridad || "Normal",
      };
    });

    res.status(200).json(formattedConsultas);
  } catch (error) {
    console.error("Error en getConsultasHoy:", error);
    res.status(500).json({ 
      message: "Error al obtener consultas del día", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// 3. Médicos activos
export const getMedicosActivosHoy = async (req: Request, res: Response) => {
  try {
    // Tipado correcto para la población de especialidades
    interface MedicoConEspecialidades extends Omit<Medico, 'especialidades'> {
      especialidades: EspecialidadPopulated[];
    }

    const medicos = await MedicoModel.find({ estaActivo: true })
      .populate<{ especialidades: EspecialidadPopulated[] }>("especialidades", "nombre")
      .lean() as MedicoConEspecialidades[];

    const formattedMedicos = medicos.map((medico) => {
      // Extraer nombres de especialidades con seguridad de tipos
      const especialidades = Array.isArray(medico.especialidades) 
        ? medico.especialidades.map(esp => esp.nombre)
        : [];

      return {
        id: medico._id,
        nombre: `${medico.primerNombre || ''} ${medico.primerApellido || ''}`.trim() || "Nombre no disponible",
        especialidad: especialidades.length > 0 ? especialidades : ["Sin especialidad"],
      };
    });

    res.status(200).json(formattedMedicos);
  } catch (error) {
    console.error("Error en getMedicosActivosHoy:", error);
    res.status(500).json({ 
      message: "Error al obtener médicos activos", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// 4. Alertas
export const getAlertas = async (req: Request, res: Response) => {
  try {
    const consultasUrgentes = await ConsultasMedicasModel.find({ 
      prioridad: "Urgente", 
      estadoConsulta: "Pendiente" 
    })
      .populate<{ paciente: Paciente | null }>("paciente", "primerNombre primerApellido")
      .lean();

    const alertas = consultasUrgentes.map((consulta) => {
      const paciente = consulta.paciente;
      const nombreCompleto = paciente
        ? `${paciente.primerNombre || ''} ${paciente.primerApellido || ''}`.trim() 
        : 'Paciente desconocido';
          
      return {
        tipo: "consulta_urgente",
        mensaje: `Consulta urgente para ${nombreCompleto}`,
        consultaId: consulta._id,
        fecha: consulta.fecha,
        prioridad: consulta.prioridad
      };
    });

    res.status(200).json(alertas);
  } catch (error) {
    console.error("Error en getAlertas:", error);
    res.status(500).json({ 
      message: "Error al obtener alertas", 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};