// src/controllers/fichasMedicasController.ts
import { Request, Response } from "express";
import { FichasMedicasService } from "../services/FichasMedicasService";
import PDFDocument from "pdfkit";
import { FichasMedicasRepository } from "@repositories/FichasMedicasRepositories";

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
    const format = req.query.format || "json";

    const printableData = await fichasMedicasService.getConsultaPrintable(consultaId);

    if (format === "json") {
      res.json({ printableData, message: "Datos para imprimir consulta obtenidos con éxito" });
    } else if (format === "pdf") {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=consulta_${consultaId}.pdf`);

      doc.pipe(res);

      doc.fontSize(20).text("Consulta Médica", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Paciente: ${printableData.paciente.primerNombre} ${printableData.paciente.primerApellido}`);
      doc.text(`Cédula: ${printableData.paciente.cedula}`);
      doc.text(`Edad: ${printableData.paciente.edad}`);
      doc.moveDown();

      doc.text(`Médico: ${printableData.medico.primerNombre} ${printableData.medico.primerApellido}`);
      doc.text(`Fecha: ${new Date(printableData.fecha).toLocaleDateString()}`);
      doc.moveDown();

      doc.text(`Motivo: ${printableData.motivo}`);
      doc.text(`Diagnóstico: ${printableData.diagnostico || "No especificado"}`);
      doc.text(`Tratamiento: ${printableData.tratamiento || "No especificado"}`);
      doc.text(`Notas: ${printableData.notas || "No especificado"}`);
      doc.text(`Estado: ${printableData.estado}`);
      doc.moveDown();

      if (printableData.recetas.length > 0) {
        doc.fontSize(14).text("Recetas", { underline: true });
        printableData.recetas.forEach((receta: any, index: number) => {
          doc.fontSize(12).text(`${index + 1}. Medicamento: ${receta.medicamento.nombre}`);
          doc.text(`   Dosis: ${receta.dosis}`);
          doc.text(`   Duración: ${receta.duracion}`);
          doc.text(`   Instrucciones: ${receta.instrucciones || "No especificado"}`);
          doc.moveDown(0.5);
        });
      }

      if (printableData.examenes.length > 0) {
        doc.fontSize(14).text("Exámenes Médicos", { underline: true });
        printableData.examenes.forEach((examen: any, index: number) => {
          doc.fontSize(12).text(`${index + 1}. Tipo: ${examen.tipo}`);
          doc.text(`   Fecha: ${new Date(examen.fecha).toLocaleDateString()}`);
          doc.text(`   Resultado: ${examen.resultado || "No especificado"}`);
          doc.text(`   Notas: ${examen.notas || "No especificado"}`);
          doc.moveDown(0.5);
        });
      }

      doc.end();
    } else {
      res.status(400).json({ error: "Formato no soportado. Use 'json' o 'pdf'" });
    }
  } catch (error) {
    res.status(400).json({ error: "Error al obtener datos para imprimir consulta", details: error });
  }
};