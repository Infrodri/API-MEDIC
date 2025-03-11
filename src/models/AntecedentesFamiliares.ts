import { Schema, model } from "mongoose";
import { AntecedentesFamiliares } from "types/AntecedentesFamiliaresTypes";

const antecedentesFamiliaresSchema = new Schema<AntecedentesFamiliares>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    antecedentesFamiliares: { type: String, trim: true },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true }
);

export const AntecedentesFamiliaresModel = model<AntecedentesFamiliares>("AntecedentesFamiliares", antecedentesFamiliaresSchema);