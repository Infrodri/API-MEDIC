// src/models/ConsultasMedicas.ts
import mongoose, { Schema } from "mongoose";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";

const ConsultasMedicasSchema: Schema = new Schema<ConsultasMedicas>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente",
      required: [true, "El paciente es obligatorio"],
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
      ref: "Especialidades",
      required: [true, "La especialidad es obligatoria"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    motivo: {
      type: String,
      required: [true, "El motivo es obligatorio"],
      trim: true,
    },
    observaciones: {
      type: String,
      trim: true,
      default: "",
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
    estadoConsulta: { // Nuevo campo para el estado funcional
      type: String,
      enum: ["Pendiente", "Concluida", "Derivada"],
      default: "Pendiente",
    },
    medicoDerivado: { // Para derivaciones
      type: Schema.Types.ObjectId,
      ref: "Medico",
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
    fecha: this.fecha,
    motivo: this.motivo,
    estado: this.estado,
    estadoConsulta: this.estadoConsulta,
  };
};

export const ConsultasMedicasModel = mongoose.model<ConsultasMedicas>("ConsultasMedicas", ConsultasMedicasSchema);