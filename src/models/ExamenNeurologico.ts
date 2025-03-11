import { Schema, model, Types } from "mongoose";
import { ExamenNeurologico } from "types/ExamenNeurologicoTypes";

const examenNeurologicoSchema = new Schema<ExamenNeurologico>(
  {
    paciente: { type: Schema.Types.ObjectId, ref: "Paciente", required: true }, // Referencia al modelo Paciente
    reflejos: { type: String, trim: true },
    fuerzaMuscular: { type: String, trim: true },
    sensibilidad: { type: String, trim: true },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true } // Agrega createdAt y updatedAt
);

export const ExamenNeurologicoModel = model<ExamenNeurologico>("ExamenNeurologico", examenNeurologicoSchema);