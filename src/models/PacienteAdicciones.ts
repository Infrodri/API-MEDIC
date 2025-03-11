// src/models/PacienteAdiccion.ts
import mongoose, { Schema, Document, model } from "mongoose";
import { PacienteAdiccion } from "types/PacienteAdiccionesTypes";

const pacienteAdiccionSchema = new Schema<PacienteAdiccion>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    tipoAdiccion: { type: Schema.Types.ObjectId, ref: "TiposAdicciones", required: true },
    frecuencia: { type: String, required: true },
    duracion: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date },
    notas: { type: String },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true }
);

pacienteAdiccionSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    tipoAdiccion: this.tipoAdiccion,
    frecuencia: this.frecuencia,
    duracion: this.duracion,
    fechaInicio: this.fechaInicio,
    fechaFin: this.fechaFin,
    notas: this.notas,
    estado: this.estado,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const PacienteAdiccionModel = model<PacienteAdiccion>("PacienteAdiccion", pacienteAdiccionSchema);