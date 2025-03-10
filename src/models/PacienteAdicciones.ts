// src/models/PacienteAdicciones.ts
import mongoose, { Schema } from "mongoose";
import { PacienteAdiccion } from "types/PacienteAdiccionesTypes";
import { PacienteModel } from "./Pacientes";
import { object } from "zod";

const PacienteAdiccionSchema: Schema = new Schema<PacienteAdiccion>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente",
      required: [true, "El paciente es obligatorio"],
    },
    tipoAdiccion: {
      type: Schema.Types.ObjectId,
      ref: "TiposAdicciones", // Coincide con el modelo registrado
      required: [true, "El tipo de adicción es obligatorio"],
    },
    frecuencia: {
      type: String,
      required: false,
    },
    duracion: {
      type: String,
      required: false,
    },
    fechaInicio: {
      type: Date,
      required: [false, "La fecha de inicio es obligatoria"],
    },
    fechaFin: {
      type: Date,
      required: false,
    },
    notas: {
      type: String,
      required: false,
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PacienteAdiccionSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente ? { primerNombre: this.paciente.primerNombre, primerApellido: this.paciente.primerApellido } : null,
    tipoAdiccion: this.tipoAdiccion? {nombreAdiccion: this.tipoAdiccion.nombreAdiccion, descripcion: this.tipoAdiccion.descripcion } : null,
    frecuencia: this.frecuencia,
    duracion: this.duracion,
    fechaInicio: this.fechaInicio,
    fechaFin: this.fechaFin,
    notas: this.notas,
    estado: this.estado,
  };
};

export const PacienteAdiccionModel = mongoose.model<PacienteAdiccion>("PacienteAdicciones", PacienteAdiccionSchema);