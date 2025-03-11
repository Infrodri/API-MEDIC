import { Schema, model, Types } from "mongoose";
import { OrganosSentidos } from "types/OrganosSentidosTypes";

const organosSentidosSchema = new Schema<OrganosSentidos>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true }, // Referencia al modelo Paciente
    vision: { type: String, trim: true },
    audicion: { type: String, trim: true },
    olfato: { type: String, trim: true },
    gusto: { type: String, trim: true },
    tacto: { type: String, trim: true },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true } // Agrega createdAt y updatedAt
);

export const OrganosSentidosModel = model<OrganosSentidos>("OrganosSentidos", organosSentidosSchema);