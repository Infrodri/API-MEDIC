// src/models/HistorialMedico.ts
import { Schema, model, Types } from "mongoose";
import { HistorialMedico } from "../types/HistorialMedicoTypes";

const historialMedicoSchema = new Schema<HistorialMedico>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    fecha: { type: Date, required: true },
    antecedentesPersonales: { type: Schema.Types.ObjectId, ref: "AntecedentesPersonales" },
    operacionesQuirurgicas: [{ type: Schema.Types.ObjectId, ref: "PacienteOperaciones" }],
    ginecologiaObstetrica: { type: Schema.Types.ObjectId, ref: "PacienteObstetricosGinecologicos" },
    adicciones: [{ type: Schema.Types.ObjectId, ref: "PacienteAdicciones" }],
    exploracionFisica: { type: Schema.Types.ObjectId, ref: "ExploracionFisica" },
    examenNeurologico: { type: Schema.Types.ObjectId, ref: "ExamenNeurologico" },
    organosSentidos: { type: Schema.Types.ObjectId, ref: "OrganosSentidos" },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    notas: { type: String },
  },
  { timestamps: true }
);

export const HistorialMedicoModel = model<HistorialMedico>("HistorialMedico", historialMedicoSchema);