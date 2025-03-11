// src/models/PacienteOperacion.ts
import mongoose, { Schema } from "mongoose";
import { PacienteOperacion } from "types/PacienteOperacionesTypes";

const pacienteOperacionSchema = new Schema<PacienteOperacion>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    tipoOperacionQuirurgica: { type: Schema.Types.ObjectId, ref: "TiposOperacionesQuirurgicas", required: true },
    fechaOperacion: { type: Date, required: true },
    observaciones: { type: String },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true }
);

pacienteOperacionSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    tipoOperacionQuirurgica: this.tipoOperacionQuirurgica,
    fechaOperacion: this.fechaOperacion,
    observaciones: this.observaciones,
    estado: this.estado,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const PacienteOperacionModel = mongoose.model<PacienteOperacion>("PacienteOperacion", pacienteOperacionSchema);