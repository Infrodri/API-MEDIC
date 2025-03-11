import { Schema, model } from "mongoose";
import { AntecedentesPersonales } from "types/AntecedentesPersonalesTypes";

const antecedentesPersonalesSchema = new Schema<AntecedentesPersonales>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true }, // Referencia al modelo Paciente
    antecedentes: {
      epilepsia: { type: Boolean, default: false },
      tuberculosis: { type: Boolean, default: false },
      alergias: { type: Boolean, default: false },
      fobias: { type: Boolean, default: false },
      silicosis: { type: Boolean, default: false },
      dolorLumbal: { type: Boolean, default: false },
      enfermedadesVenereas: { type: Boolean, default: false },
      hipertensionArterial: { type: Boolean, default: false },
      asma: { type: Boolean, default: false },
      diabetes: { type: Boolean, default: false },
      cancer: { type: Boolean, default: false },
      insuficienciaRenal: { type: Boolean, default: false },
      osteoporosis: { type: Boolean, default: false },
      artritis: { type: Boolean, default: false },
      hipertension: { type: Boolean, default: false },
    },
    otrosAntecedentes: { type: String, trim: true },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true } // Agrega createdAt y updatedAt
);

export const AntecedentesPersonalesModel = model<AntecedentesPersonales>("AntecedentesPersonales", antecedentesPersonalesSchema);