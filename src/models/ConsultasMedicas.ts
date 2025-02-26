import mongoose, { Schema } from "mongoose";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";

const ConsultasMedicasSchema: Schema = new Schema<ConsultasMedicas>(
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
    fichaMedica: {
      type: Schema.Types.ObjectId,
      ref: "FichasMedicas",
      required: [true, "La ficha médica es obligatoria"],
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
    },
    motivo: {
      type: String,
      required: [true, "El motivo es obligatorio"],
      trim: true,
    },
    observaciones: {
      type: String,
      required: [true, "Las observaciones son obligatorias"],
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

ConsultasMedicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    medico: this.medico,
    fichaMedica: this.fichaMedica,
    especialidad: this.especialidad, // Incluyo especialidad
    fecha: this.fecha,
    estado: this.estado,
  };
};

export const ConsultasMedicasModel = mongoose.model<ConsultasMedicas>("ConsultasMedicas", ConsultasMedicasSchema);