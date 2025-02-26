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
    medico: {
      type: Schema.Types.ObjectId,
      ref: "Medico", // Relación con la colección Medicos
      required: [true, "El médico es obligatorio"],
    },
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente", // Relación con la colección Pacientes
      required: [true, "El paciente es obligatorio"],
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

// Method to get basic examenes médicos info (for the list)
ExamenesMedicosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    nombreExamen: this.nombreExamen,
    medico: this.medico,
    paciente: this.paciente,
    estado: this.estado,
  };
};

export const ExamenesMedicosModel = mongoose.model<ExamenesMedicos>("ExamenesMedicos", ExamenesMedicosSchema);