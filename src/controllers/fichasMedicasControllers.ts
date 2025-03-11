// src/controllers/fichasMedicasController.ts
import { Request, Response } from "express";
import { FichasMedicasService } from "../services/FichasMedicasService";
import PDFDocument from "pdfkit";
import { FichasMedicasRepository } from "@repositories/FichasMedicasRepositories";
import { ConsultasMedicasModel } from "@models/ConsultasMedicas";

const fichasMedicasRepository = new FichasMedicasRepository();
const fichasMedicasService = new FichasMedicasService(fichasMedicasRepository);

export const getFichaByPaciente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ficha = await fichasMedicasService.getFichaByPaciente(id);
    if (!ficha) return res.status(404).json({ message: "Ficha no encontrada" });
    res.json({ ficha, message: "Ficha médica obtenida con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ficha médica", details: error });
  }
};

export const addSection = async (req: Request, res: Response) => {
  try {
    const { id, section } = req.params; // Asegurarse de extraer 'section' aquí
    const data = req.body;
    const userId = req.currentUser?.id;
    if (!userId) return res.status(403).json({ message: "Acceso denegado: usuario no autenticado" });

    if (!section) {
      return res.status(400).json({ message: "El parámetro 'section' es requerido en la URL" });
    }

    const newSection = await fichasMedicasService.addSection(id, section, data, userId);
    res.status(201).json({ section: newSection, message: `Sección ${section} agregada con éxito` });
  } catch (error: any) {
    console.error(`Error al agregar sección: ${error.message}`); // Usar solo el mensaje del error
    res.status(400).json({ error: "Error al agregar la sección", details: error.message });
  }
};

export const getSection = async (req: Request, res: Response) => {
  try {
    const { id, section } = req.params;
    const sectionData = await fichasMedicasService.getSection(id, section);
    if (!sectionData) return res.status(404).json({ message: `Sección ${section} no encontrada` });
    res.json({ [section]: sectionData, message: `Sección ${section} obtenida con éxito` });
  } catch (error) {
    res.status(500).json({ error: `Error al obtener sección`, details: error });
  }
};

export const createConsulta = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;
    const data = req.body;
    const userId = req.currentUser?.id;
    if (!userId) return res.status(403).json({ message: "Acceso denegado: usuario no autenticado" });

    const consulta = await fichasMedicasService.createConsulta(pacienteId, data, userId);
    res.status(201).json({ consulta, message: "Consulta médica creada con éxito" });
  } catch (error) {
    res.status(400).json({ error: "Error al crear consulta médica", details: error });
  }
};
export const addReceta = async (req: Request, res: Response) => {
  try {
    const { consultaId } = req.params;
    const data = req.body;
    const userId = req.currentUser?.id;
    if (!userId) return res.status(403).json({ message: "Acceso denegado: usuario no autenticado" });

    const receta = await fichasMedicasService.addReceta(consultaId, data, userId);
    res.status(201).json({ receta, message: "Receta médica agregada con éxito" });
  } catch (error) {
    res.status(400).json({ error: "Error al agregar receta médica", details: error });
  }
};

export const addExamen = async (req: Request, res: Response) => {
  try {
    const { consultaId } = req.params;
    const data = req.body;
    const userId = req.currentUser?.id;
    if (!userId) return res.status(403).json({ message: "Acceso denegado: usuario no autenticado" });

    const examen = await fichasMedicasService.addExamen(consultaId, data, userId);
    res.status(201).json({ examen, message: "Examen médico agregado con éxito" });
  } catch (error) {
    res.status(400).json({ error: "Error al agregar examen médico", details: error });
  }
};

export const updateConsulta = async (req: Request, res: Response) => {
  try {
    const { consultaId } = req.params;
    const data = req.body;
    const userId = req.currentUser?.id;
    if (!userId) return res.status(403).json({ message: "Acceso denegado: usuario no autenticado" });

    const consulta = await fichasMedicasService.updateConsulta(consultaId, data, userId);
    res.json({ consulta, message: "Consulta médica actualizada con éxito" });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar consulta médica", details: error });
  }
};

export const getConsultaPrintable = async (req: Request, res: Response) => {
  try {
    const { consultaId } = req.params;
    const { format = "json" } = req.query;

    // Validar formato
    if (format !== "json" && format !== "pdf") {
      return res.status(400).json({
        error: "Formato no soportado. Use 'json' o 'pdf'",
      });
    }

    // Buscar la consulta con población de datos
    const consulta = await ConsultasMedicasModel.findById(consultaId)
      .populate("paciente", "primerNombre primerApellido cedula edad")
      .populate("medico", "primerNombre primerApellido")
      .populate({
        path: "recetas",
        populate: { path: "medicamento", select: "nombre descripcion" },
      })
      .populate("examenes")
      .lean();

    // Verificar si la consulta existe
    if (!consulta) {
      return res.status(404).json({
        error: "Consulta no encontrada",
      });
    }

    // Formato JSON
    if (format === "json") {
      return res.status(200).json({
        printableData: consulta,
        message: "Datos para imprimir consulta obtenidos con éxito",
      });
    }

    // Formato PDF
    if (format === "pdf") {
      // Configurar headers para la descarga del PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=consulta_${consultaId}.pdf`
      );

      // Crear el documento PDF
      const doc = new PDFDocument();
      doc.pipe(res); // Enviar el PDF directamente a la respuesta

      // Añadir contenido al PDF
      doc.fontSize(16).text("Consulta Médica", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Paciente: ${consulta.paciente?.primerNombre} ${consulta.paciente?.primerApellido}`);
      doc.text(`Cédula: ${consulta.paciente?.cedula}`);
      doc.text(`Edad: ${consulta.paciente?.edad}`);
      doc.moveDown();

      doc.text(`Médico: ${consulta.medico?.primerNombre} ${consulta.medico?.primerApellido}`);
      doc.text(`Fecha: ${new Date(consulta.fecha).toLocaleString()}`);
      doc.moveDown();

      doc.text(`Motivo: ${consulta.motivo}`);
      doc.text(`Diagnóstico: ${consulta.diagnostico || "No especificado"}`);
      doc.text(`Tratamiento: ${consulta.tratamiento || "No especificado"}`);
      doc.text(`Notas: ${consulta.notas || "No especificado"}`);
      doc.moveDown();

      // Añadir recetas
      if (consulta.recetas && consulta.recetas.length > 0) {
        doc.fontSize(14).text("Recetas:", { underline: true });
        consulta.recetas.forEach((receta: any) => {
          doc.fontSize(12).text(`- Medicamento: ${receta.medicamento?.nombre}`);
          doc.text(`  Dosis: ${receta.dosis}`);
          doc.text(`  Duración: ${receta.duracion}`);
          doc.text(`  Instrucciones: ${receta.instrucciones || "No especificadas"}`);
          doc.moveDown();
        });
      }

      // Añadir exámenes
      if (consulta.examenes && consulta.examenes.length > 0) {
        doc.fontSize(14).text("Exámenes:", { underline: true });
        consulta.examenes.forEach((examen: any) => {
          doc.fontSize(12).text(`- Tipo: ${examen.tipo}`);
          doc.text(`  Fecha: ${new Date(examen.fecha).toLocaleDateString()}`);
          doc.text(`  Resultado: ${examen.resultado || "Pendiente"}`);
          doc.text(`  Notas: ${examen.notas || "No especificadas"}`);
          doc.moveDown();
        });
      }

      // Finalizar el PDF
      doc.end();
    }
  } catch (error) {
    console.error("Error en getConsultaPrintable:", error);
    // Asegurarse de no escribir en la respuesta si ya se cerró
    if (!res.headersSent) {
      res.status(500).json({
        error: "Error al generar el documento imprimible",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
};