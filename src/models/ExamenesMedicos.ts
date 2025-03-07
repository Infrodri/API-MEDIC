import mongoose, { Schema } from "mongoose";
import { ExamenesMedicos } from "types/ExamenesMedicosTypes";

const ExamenesMedicosSchema: Schema = new Schema<ExamenesMedicos>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del examen es obligatorio"],
      trim: true,
      unique: true, // Para evitar duplicados en el nombre
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
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

// Método para obtener solo la información básica (usando solo los ObjectIds de las referencias)
ExamenesMedicosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    nombre: this.nombre,
    descripcion: this.descripcion,
    estado: this.estado,
  };
};

export const ExamenesMedicosModel = mongoose.model<ExamenesMedicos>("ExamenesMedicos", ExamenesMedicosSchema);
