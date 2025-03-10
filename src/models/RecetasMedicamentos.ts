// src/models/RecetasMedicamentos.ts
import { Schema, model, Types } from "mongoose";
import { RecetaMedicamento } from "types/FichasMedicasTypes";

const recetasMedicamentosSchema = new Schema<RecetaMedicamento>(
  {
    consulta: { type: Schema.Types.ObjectId, ref: "ConsultasMedicas", required: true },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    medicamento: { type: Schema.Types.ObjectId, ref: "Medicamentos", required: true },
    dosis: { type: String, required: true, trim: true },
    duracion: { type: String, required: true, trim: true },
    instrucciones: { type: String, trim: true },
  },
  { timestamps: true }
);

export const RecetasMedicamentosModel = model<RecetaMedicamento>("RecetasMedicamentos", recetasMedicamentosSchema);