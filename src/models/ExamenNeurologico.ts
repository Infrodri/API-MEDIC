// src/models/ExamenNeurologico.ts
import { Schema, model } from "mongoose";
import { ExamenNeurologico } from "../types/HistorialMedicoTypes";

const examenNeurologicoSchema = new Schema<ExamenNeurologico>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    reflejos: { type: String },
    coordinacion: { type: String },
    estadoMental: { type: String },
    otrasObservaciones: { type: String },
  },
  { timestamps: true }
);

export const ExamenNeurologicoModel = model<ExamenNeurologico>("ExamenNeurologico", examenNeurologicoSchema);