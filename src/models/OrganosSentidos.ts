// src/models/OrganosSentidos.ts
import { Schema, model } from "mongoose";
import { OrganosSentidos } from "../types/HistorialMedicoTypes";

const organosSentidosSchema = new Schema<OrganosSentidos>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true },
    vision: { type: String },
    audicion: { type: String },
    olfato: { type: String },
    otrasObservaciones: { type: String },
  },
  { timestamps: true }
);

export const OrganosSentidosModel = model<OrganosSentidos>("OrganosSentidos", organosSentidosSchema);