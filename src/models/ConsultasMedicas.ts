// src/models/ConsultasMedicas.ts
import { Schema, model, Types } from "mongoose";
import { ConsultasMedicas } from "types/FichasMedicasTypes";

const consultasMedicasSchema = new Schema<ConsultasMedicas>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    fecha: { type: Date, required: true },
    motivo: { type: String, required: true, trim: true },
    diagnostico: { type: String, trim: true },
    tratamiento: { type: String, trim: true },
    notas: { type: String, trim: true },
    estado: { type: String, enum: ["pendiente", "completada"], default: "pendiente" },
    recetas: [{ type: Schema.Types.ObjectId, ref: "RecetasMedicamentos" }],
    examenes: [{ type: Schema.Types.ObjectId, ref: "ExamenesMedicos" }],
  },
  { timestamps: true }
);

export const ConsultasMedicasModel = model<ConsultasMedicas>("ConsultasMedicas", consultasMedicasSchema);