// src/models/RecetasMedicamentos.ts
import { Schema, model, Types } from "mongoose";
import { RecetasMedicamentos } from "types/RecetasMedicamentosTypes";

const recetasMedicamentosSchema = new Schema<RecetasMedicamentos>(
  {
    consulta: { type: Schema.Types.ObjectId, ref: "ConsultasMedicas", required: true },
    medico: { type: Schema.Types.ObjectId, ref: "Medico", required: true },
    medicamento: { type: Schema.Types.ObjectId, ref: "Medicamentos", required: true },
    dosis: { type: String, required: true, trim: true },
    duracion: { type: String, required: true, trim: true },
    instrucciones: { type: String, trim: true },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true }
);

recetasMedicamentosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    consulta: this.consulta,
    medico: this.medico,
    medicamento: this.medicamento,
    dosis: this.dosis,
    duracion: this.duracion,
    instrucciones: this.instrucciones,
    estado: this.estado,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const RecetasMedicamentosModel = model<RecetasMedicamentos>("RecetasMedicamentos", recetasMedicamentosSchema);