// src/models/HistorialMedico.ts
import { Schema, model } from "mongoose";
import { IHistorialMedico } from "types/HistorialMedicoTypes";

const historialMedicoSchema = new Schema<IHistorialMedico>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    alergias: { type: String, trim: true },
    enfermedades: { type: String, trim: true },
    cirugiasPrevias: { type: String, trim: true },
    antecedentesFamiliares: { type: String, trim: true },
  },
  { timestamps: true }
);

export default model<IHistorialMedico>("HistorialMedico", historialMedicoSchema);