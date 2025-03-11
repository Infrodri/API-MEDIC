import { Schema, model } from "mongoose";
import { ExploracionFisica } from "types/ExploracionFisicaTypes";

const exploracionFisicaSchema = new Schema<ExploracionFisica>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true }, // Referencia al modelo Paciente
    temperatura: { type: Number, required: true }, // °C
    tensionArterial: { type: String, required: true, trim: true }, // mm/Hg
    frecuenciaCardiaca: { type: Number, required: true }, // Latidos por minuto
    peso: { type: Number, required: true }, // KG
    talla: { type: Number, required: true }, // CM
    frecuenciaRespiratoria: { type: Number, required: true }, // Respiraciones por minuto
    examenFisico: {
      piel: { type: String, trim: true },
      cabeza: { type: String, trim: true },
      cara: { type: String, trim: true },
      cardioPulmonar: { type: String, trim: true },
      abdomen: { type: String, trim: true },
      extremidades: { type: String, trim: true },
      boca: { type: String, trim: true },
      torax: { type: String, trim: true },
      cuello: { type: String, trim: true },
    },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true } // Agrega createdAt y updatedAt
);

export const ExploracionFisicaModel = model<ExploracionFisica>("ExploracionFisica", exploracionFisicaSchema);