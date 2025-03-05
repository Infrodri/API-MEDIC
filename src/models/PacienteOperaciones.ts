// src/models/PacienteOperaciones.ts
import mongoose, { Schema } from "mongoose";
import { PacienteOperacion } from "types/PacienteOperacionesTypes";

const PacienteOperacionSchema: Schema = new Schema<PacienteOperacion>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente",
      required: [true, "El paciente es obligatorio"],
    },
    tipoOperacionQuirurgica: {
      type: Schema.Types.ObjectId,
      ref: "TiposOperacionesQuirurgicas",
      required: [true, "El tipo de operación quirúrgica es obligatorio"],
    },
    fechaOperacion: {
      type: Date,
      required: [true, "La fecha de la operación es obligatoria"],
    },
    notas: {
      type: String,
      trim: true,
      default: "",
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

PacienteOperacionSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    tipoOperacionQuirurgica: this.tipoOperacionQuirurgica,
    fechaOperacion: this.fechaOperacion,
    notas: this.notas,
    estado: this.estado,
  };
};

export const PacienteOperacionModel = mongoose.model<PacienteOperacion>("PacienteOperacion", PacienteOperacionSchema);