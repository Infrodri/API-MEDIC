// src/models/ExploracionFisica.ts
import { Schema, model } from "mongoose";
import { ExploracionFisica } from "../types/HistorialMedicoTypes";

const exploracionFisicaSchema = new Schema<ExploracionFisica>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    peso: { type: Number },
    altura: { type: Number },
    presionArterial: { type: String },
    frecuenciaCardiaca: { type: Number },
    temperatura: { type: Number },
    otrasObservaciones: { type: String },
  },
  { timestamps: true }
);

export const ExploracionFisicaModel = model<ExploracionFisica>("ExploracionFisica", exploracionFisicaSchema);