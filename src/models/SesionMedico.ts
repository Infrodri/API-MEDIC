// src/models/SesionMedico.ts
import mongoose, { Schema, Types } from "mongoose";

export interface SesionMedico extends Document {
  medico: Types.ObjectId;
  fechaInicio: Date;
  fechaFin?: Date;
}

const SesionMedicoSchema: Schema = new Schema<SesionMedico>(
  {
    medico: {
      type: Schema.Types.ObjectId,
      ref: "Medico",
      required: true,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const SesionMedicoModel = mongoose.model<SesionMedico>("SesionMedico", SesionMedicoSchema);
