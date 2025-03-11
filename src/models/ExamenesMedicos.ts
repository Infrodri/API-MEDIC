// src/models/ExamenesMedicos.ts
import { Schema, model } from "mongoose";
import { ExamenesMedicos } from "types/ExamenesMedicosTypes";

const examenesMedicosSchema = new Schema<ExamenesMedicos>(
  {
    nombre: { type: String, required: true, trim: true, unique: true }, // Nombre del tipo de examen
    descripcion: { type: String, trim: true }, // Descripción opcional
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" }, // Estado para eliminación suave
  },
  { timestamps: true }
);

examenesMedicosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    nombre: this.nombre,
    descripcion: this.descripcion,
    estado: this.estado,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const ExamenesMedicosModel = model<ExamenesMedicos>("ExamenesMedicos", examenesMedicosSchema);