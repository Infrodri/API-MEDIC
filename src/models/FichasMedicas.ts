import mongoose, { Schema } from "mongoose";
import { FichasMedicas } from "types/FichasMedicasTypes";

const FichasMedicasSchema: Schema = new Schema<FichasMedicas>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente",
      required: [true, "El paciente es obligatorio"],
      index: true,
    },
    medico: {
      type: Schema.Types.ObjectId,
      ref: "Medico",
      required: [true, "El médico es obligatorio"],
    },
    especialidad: {
      type: Schema.Types.ObjectId,
      ref: "Especialidades", // Nueva relación
      required: [true, "La especialidad es obligatoria"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
      default: Date.now,
      index: true,
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
    timestamps: true,
    versionKey: false,
  }
);

FichasMedicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    medico: this.medico,
    especialidad: this.especialidad, // Incluyo especialidad
    fecha: this.fecha,
    estado: this.estado,
  };
};

export const FichasMedicasModel = mongoose.model<FichasMedicas>("FichasMedicas", FichasMedicasSchema);