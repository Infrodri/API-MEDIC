// src/models/ConsultasMedicas.ts
import { Schema, model } from "mongoose";
import { ConsultasMedicas } from "types/ConsultasMedicasTypes";

const consultasMedicasSchema = new Schema<ConsultasMedicas>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    fecha: { type: Date, required: true, index: true }, // Índice en fecha
    motivo: { type: String, required: true, trim: true },
    sintomas: { type: String, required: true, trim: true }, // Nuevo campo
    diagnostico: { type: String, trim: true },
    tratamiento: { type: String, trim: true },
    observaciones: { type: String, trim: true }, // Renombrado
    recomendacionDescanso: { type: String, trim: true }, // Nuevo campo
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
    estadoConsulta: { type: String,  
      enum: ["Pendiente", "Concluida", "Derivada", "Cancelada"],
      default: "Pendiente",
      index: true, // Índice en estadoConsulta
     },
      
    medicoDerivado: { type: Schema.Types.ObjectId, ref: "Medico" },
    prioridad: { type: String, enum: ["Normal", "Alta", "Urgente"], default: "Normal" },
    duracion: { type: Number, default: 30 }, // En minutos
    recetas: [{ type: Schema.Types.ObjectId, ref: "RecetasMedicamentos" }],
    examenes: [{ type: Schema.Types.ObjectId, ref: "PacienteExamen" }], // Corregido
  },
  { timestamps: true }
);

consultasMedicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    medico: this.medico,
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