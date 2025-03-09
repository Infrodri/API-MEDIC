// src/models/ConsultasMedicas.ts
import mongoose, { Schema } from "mongoose";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";



const ConsultasMedicasSchema: Schema = new Schema<ConsultasMedicas>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    fichaMedica: { type: Schema.Types.ObjectId, ref: "FichaMedica", required: true },
    especialidad: { type: Schema.Types.ObjectId, ref: "Especialidades", required: true },
    fecha: { type: Date, required: true },
    motivo: { type: String, required: true },
    observaciones: { type: String },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
    estadoConsulta: { type: String, enum: ["Pendiente", "Concluida", "Derivada"], default: "Pendiente" },
    medicoDerivado: { type: Schema.Types.ObjectId, ref: "Medico" },
    prioridad: { type: String, enum: ["Normal", "Alta", "Urgente"], default: "Normal" },
  },
  { timestamps: true, versionKey: false }
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
    prioridad: this.prioridad, // Incluimos prioridad en la info básica
  };
};

export const ConsultasMedicasModel = mongoose.model<ConsultasMedicas>("ConsultasMedicas", ConsultasMedicasSchema);