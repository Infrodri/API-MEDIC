// src/models/ConsultasMedicas.ts
import { Schema, model } from "mongoose";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";

const consultasMedicasSchema = new Schema<ConsultasMedicas>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    especialidad: { type: Schema.Types.ObjectId, ref: "Especialidades", required: true }, // Nuevo campo
    fecha: { type: Date, required: true, index: true },
    motivo: { type: String, required: true, trim: true },
    sintomas: { type: String, required: true, trim: true },
    diagnostico: { type: String, trim: true },
    tratamiento: { type: String, trim: true },
    observaciones: { type: String, trim: true },
    recomendacionDescanso: { type: String, trim: true },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
    estadoConsulta: {
      type: String,
      enum: ["Pendiente", "Concluida", "Derivada", "Cancelada"],
      default: "Pendiente",
      index: true,
    },
    medicoDerivado: { type: Schema.Types.ObjectId, ref: "Medico" },
    prioridad: { type: String, enum: ["Normal", "Alta", "Urgente"], default: "Normal" },
    duracion: { type: Number, default: 30 },
    recetas: [{ type: Schema.Types.ObjectId, ref: "RecetasMedicamentos" }],
    examenes: [{ type: Schema.Types.ObjectId, ref: "PacienteExamen" }],
  },
  { timestamps: true }
);

consultasMedicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    medico: this.medico,
    especialidad: this.especialidad,
    fecha: this.fecha,
    motivo: this.motivo,
    sintomas: this.sintomas,
    diagnostico: this.diagnostico,
    tratamiento: this.tratamiento,
    observaciones: this.observaciones,
    recomendacionDescanso: this.recomendacionDescanso,
    estado: this.estado,
    estadoConsulta: this.estadoConsulta,
    medicoDerivado: this.medicoDerivado,
    prioridad: this.prioridad,
    duracion: this.duracion,
    recetas: this.recetas,
    examenes: this.examenes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const ConsultasMedicasModel = model<ConsultasMedicas>("ConsultasMedicas", consultasMedicasSchema);