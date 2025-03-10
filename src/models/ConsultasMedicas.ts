// src/models/ConsultasMedicas.ts
import mongoose, { Schema } from "mongoose";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";

const ConsultasMedicasSchema: Schema = new Schema<ConsultasMedicas>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    fichaMedica: { type: Schema.Types.ObjectId, ref: "FichasMedicas", required: true },
    especialidad: { type: Schema.Types.ObjectId, ref: "Especialidades", required: true },
    fecha: { type: Date, required: true },
    motivo: { type: String, required: true },
    observaciones: { type: String },
    prioridad: { type: String, enum: ["Normal", "Alta", "Urgente"], default: "Normal" },
    duracion: { type: Number, default: 30, required: true }, // Nuevo campo
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
    estadoConsulta: { type: String, enum: ["Pendiente", "Concluida", "Derivada", "Cancelada"], default: "Pendiente" }, // Agregado "Cancelada"
    medicoDerivado: { type: Schema.Types.ObjectId, ref: "Medico" },

 
  },
  { timestamps: true, versionKey: false }
);

ConsultasMedicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this._id,
    medico: this._id,
    fichaMedica: this._id,
    especialidad: this._id,
    fecha: this.fecha,
    motivo: this.motivo,
    observaciones: this.observaciones,
    prioridad: this.prioridad,
    duracion: this.duracion, // Incluido en info básica
    estado: this.estado,
    estadoConsulta: this.estadoConsulta,
    medicoDerivado: this.medicoDerivado,


  };
};

export const ConsultasMedicasModel = mongoose.model<ConsultasMedicas>("ConsultasMedicas", ConsultasMedicasSchema);