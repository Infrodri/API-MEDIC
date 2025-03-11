// src/models/PacienteOperaciones.ts
import mongoose, { Schema, model } from "mongoose";
import { PacienteOperacion } from "types/PacienteOperacionesTypes";

const PacienteOperacionSchema: Schema = new Schema<PacienteOperacion>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    tipoOperacionQuirurgica: { type: Schema.Types.ObjectId, ref: "TiposOperacionesQuirurgicas", required: true }, // Corregido el nombre
    fechaOperacion: { type: Date, required: true },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    notas: { type: String },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PacienteOperacionSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente ? { primerNombre: this.paciente.primerNombre, primerApellido: this.paciente.primerApellido } : null,
    tipoOperacionQuirurgica: this.tipoOperacionQuirurgica
      ? { nombreOperacion: this.tipoOperacionQuirurgica.nombreOperacion, descripcion: this.tipoOperacionQuirurgica.descripcion }
      : null,
    fechaOperacion: this.fechaOperacion,
    medico: this.medico ? { primerNombre: this.medico.primerNombre, primerApellido: this.medico.primerApellido } : null,
    notas: this.notas,
    estado: this.estado,
  };
};

export const PacienteOperacionesModel = model<PacienteOperacion>("PacienteOperaciones", PacienteOperacionSchema);