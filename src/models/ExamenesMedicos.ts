// src/models/ExamenesMedicos.ts
import { Schema, model, Types } from "mongoose";
import { ExamenMedico } from "types/FichasMedicasTypes";

const examenesMedicosSchema = new Schema<ExamenMedico>(
  {
    consulta: { type: Schema.Types.ObjectId, ref: "ConsultasMedicas", required: true },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    tipo: { type: String, required: true, trim: true },
    fecha: { type: Date, required: true },
    resultado: { type: String, trim: true },
    notas: { type: String, trim: true },
  },
  { timestamps: true }
);

export const ExamenesMedicosModel = model<ExamenMedico>("ExamenesMedicos", examenesMedicosSchema);