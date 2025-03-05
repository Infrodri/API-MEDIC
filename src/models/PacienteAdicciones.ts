// src/models/PacienteAdicciones.ts
import mongoose, { Schema } from "mongoose";
import { PacienteAdiccion } from "types/PacienteAdiccionesTypes";

const PacienteAdiccionSchema: Schema = new Schema<PacienteAdiccion>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente",
      required: [true, "El paciente es obligatorio"],
    },
    tipoAdiccion: {
      type: Schema.Types.ObjectId,
      ref: "TiposAdiccion",
      required: [true, "El tipo de adicción es obligatorio"],
    },
    fechaInicio: {
      type: Date,
      required: [true, "La fecha de inicio es obligatoria"],
    },
    fechaFin: {
      type: Date,
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
    paciente: this.paciente,
    tipoAdiccion: this.tipoAdiccion,
    fechaInicio: this.fechaInicio,
    fechaFin: this.fechaFin,
    estado: this.estado,
  };
};

export const PacienteAdiccionModel = mongoose.model<PacienteAdiccion>("PacienteAdiccion", PacienteAdiccionSchema);