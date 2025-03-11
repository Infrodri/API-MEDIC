// src/models/Medicamentos.ts
import { Schema, model } from "mongoose";
import { Medicamentos } from "types/MedicamentosTypes";

const medicamentosSchema = new Schema<Medicamentos>(
  {
    nombre: { type: String, required: true, trim: true, unique: true },
    descripcion: { type: String, trim: true },
    esCritico: { type: Boolean, default: false }, // Ajustado a Boolean
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

medicamentosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    nombre: this.nombre,
    descripcion: this.descripcion,
    esCritico: this.esCritico, // Ajustado a esCritico
  };
};

export const MedicamentosModel = model<Medicamentos>("Medicamentos", medicamentosSchema);