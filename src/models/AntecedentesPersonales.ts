// src/models/AntecedentesPersonales.ts
import { Schema, model } from "mongoose";
import { AntecedentesPersonales } from "../types/HistorialMedicoTypes";

const antecedentesPersonalesSchema = new Schema<AntecedentesPersonales>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    alergias: [{ type: String }],
    enfermedades: [{ type: String }],
    cirugias: [{ type: Schema.Types.ObjectId, ref: "PacienteOperaciones" }],
    vacunas: [{ type: String }],
    examenesFisicos: [{ type: Schema.Types.Mixed }],
    pruebasDeteccion: [{ type: Schema.Types.Mixed }],
    medicamentos: [{
      nombre: { type: String },
      dosis: { type: String },
      duracion: { type: String },
    }],
    enfermedadesCronicas: [{ type: String }],
    antecedentesFamiliares: [{ type: String }],
    habitosSalud: {
      alimentacion: { type: String },
      ejercicio: { type: String },
    },
  },
  { timestamps: true }
);

export const AntecedentesPersonalesModel = model<AntecedentesPersonales>("AntecedentesPersonales", antecedentesPersonalesSchema);