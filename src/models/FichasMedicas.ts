import mongoose, { Schema } from "mongoose";
import { FichasMedicas } from "types/FichasMedicasTypes";

const FichasMedicasSchema: Schema = new Schema<FichasMedicas>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente", // Relación con la colección Pacientes
      required: [true, "El paciente es obligatorio"],
    },
    medico: {
      type: Schema.Types.ObjectId,
      ref: "Medico", // Relación con la colección Medicos
      required: [true, "El médico es obligatorio"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
      default: Date.now, // Fecha por defecto es la actual
    },
    diagnostico: {
      type: String,
      required: [true, "El diagnóstico es obligatorio"],
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

// Method to get basic fichas médicas info (for the list)
FichasMedicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    paciente: this.paciente,
    medico: this.medico,
    fecha: this.fecha,
    estado: this.estado,
  };
};

export const FichasMedicasModel = mongoose.model<FichasMedicas>("FichasMedicas", FichasMedicasSchema);