import mongoose, { Schema } from "mongoose";
import { PacienteExamenes } from "types/PacienteExamenesTypes";

const PacienteExamenesSchema: Schema = new Schema<PacienteExamenes>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente", // Relación con Pacientes
      required: [true, "El paciente es obligatorio"],
    },
    examen: {
      type: Schema.Types.ObjectId,
      ref: "ExamenesMedicos", // Relación con ExamenesMedicos
      required: [true, "El examen es obligatorio"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    resultado: {
      type: String,
      required: [true, "El resultado es obligatorio"],
      trim: true,
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    versionKey: false,
  }
);

// Method to get basic paciente-exámenes info (for the list)
PacienteExamenesSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    paciente: this.paciente,
    examen: this.examen,
    fecha: this.fecha,
    estado: this.estado,
  };
};

export const PacienteExamenesModel = mongoose.model<PacienteExamenes>("PacienteExamenes", PacienteExamenesSchema);