// src/models/PacienteExamen.ts
import { Schema, model } from "mongoose";
import { PacienteExamen } from "types/PacienteExamenesTypes";

const pacienteExamenSchema = new Schema<PacienteExamen>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    examenMedico: { type: Schema.Types.ObjectId, ref: "ExamenesMedicos", required: true },
    fechaExamen: { type: Date, required: true },
    resultado: { type: String, trim: true }, // Puede ser texto, numérico o JSON como string
    notas: { type: String, trim: true },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true }
);

pacienteExamenSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    examenMedico: this.examenMedico,
    fechaExamen: this.fechaExamen,
    resultado: this.resultado,
    notas: this.notas,
    estado: this.estado,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const PacienteExamenModel = model<PacienteExamen>("PacienteExamen", pacienteExamenSchema);