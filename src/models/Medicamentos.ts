// src/models/Medicamentos.ts
import { Schema, model } from "mongoose";
import { Medicamento } from "types/FichasMedicasTypes";

const medicamentosSchema = new Schema<Medicamento>(
  {
    nombre: { type: String, required: true, trim: true, unique: true },
    descripcion: { type: String, trim: true },
  },
  { timestamps: true }
);

export const MedicamentosModel = model<Medicamento>("Medicamentos", medicamentosSchema);