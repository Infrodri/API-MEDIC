import mongoose, { Schema } from "mongoose";
import { ExamenesMedicos } from "types/ExamenesMedicosTypes";

const ExamenesMedicosSchema: Schema = new Schema<ExamenesMedicos>(
  {
    nombreExamen: {
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
    medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' },
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
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
    nombreExamen: this.nombreExamen,
    medico: this.medico.primerApellido,  // Aquí ya contiene el ObjectId del médico
    paciente: this.paciente.nombre, // Aquí ya contiene el ObjectId del paciente
    estado: this.estado,
  };
};

export const ExamenesMedicosModel = mongoose.model<ExamenesMedicos>("ExamenesMedicos", ExamenesMedicosSchema);
