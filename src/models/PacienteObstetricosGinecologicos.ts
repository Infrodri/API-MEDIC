// src/models/PacienteObstetricosGinecologicos.ts
import mongoose, { Schema } from "mongoose";
import { PacienteObstetricoGinecologico } from "types/PacienteObstetricosGinecologicosTypes";

const PacienteObstetricoGinecologicoSchema: Schema = new Schema<PacienteObstetricoGinecologico>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente",
      required: [true, "El paciente es obligatorio"],
    },
    tipoObstetricoGinecologico: {
      type: Schema.Types.ObjectId,
      ref: "TiposObstetricosGinecologicos",
      required: [true, "El tipo obstétrico/ginecológico es obligatorio"],
    },
    fechaEvento: {
      type: Date,
      required: [true, "La fecha del evento es obligatoria"],
    },
    detalles: {
      type: String,
      trim: true,
      default: "",
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PacienteObstetricoGinecologicoSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    paciente: this.paciente,
    tipoObstetricoGinecologico: this.tipoObstetricoGinecologico,
    fechaEvento: this.fechaEvento,
    detalles: this.detalles,
    estado: this.estado,
  };
};

export const PacienteObstetricoGinecologicoModel = mongoose.model<PacienteObstetricoGinecologico>("PacienteObstetricoGinecologico", PacienteObstetricoGinecologicoSchema);