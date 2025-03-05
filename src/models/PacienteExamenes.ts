// src/models/PacienteExamenes.ts
import mongoose, { Schema } from "mongoose";
import { PacienteExamen } from "types/PacienteExamenesTypes";

const PacienteExamenSchema: Schema = new Schema<PacienteExamen>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente",
      required: [true, "El paciente es obligatorio"],
    },
    examenMedico: {
      type: Schema.Types.ObjectId,
      ref: "ExamenesMedico",
      required: [true, "El examen médico es obligatorio"],
    },
    fechaRealizacion: {
      type: Date,
      required: [true, "La fecha de realización es obligatoria"],
    },
    resultado: {
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

PacienteExamenSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    examenMedico: this.examenMedico,
    fechaRealizacion: this.fechaRealizacion,
    resultado: this.resultado,
    estado: this.estado,
  };
};

export const PacienteExamenModel = mongoose.model<PacienteExamen>("PacienteExamen", PacienteExamenSchema);