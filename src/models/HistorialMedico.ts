// src/models/HistorialMedico.ts
import { Schema, model } from "mongoose";
import { HistorialMedico } from "../types/HistorialMedicoTypes";

const historialMedicoSchema = new Schema<HistorialMedico>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    fecha: { type: Date, required: true },
    descripcion: { type: String, required: true },
    diagnostico: { type: String },
    tratamiento: { type: String },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    notas: { type: String },
  },
  { timestamps: true }
);

export const HistorialMedicoModel = model<HistorialMedico>("HistorialMedico", historialMedicoSchema);