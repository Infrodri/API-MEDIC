import mongoose, { Schema } from "mongoose";
import { PacienteObstetricosGinecologicos } from "types/PacienteObstetricosGinecologicosTypes";

const PacienteObstetricosGinecologicosSchema: Schema = new Schema<PacienteObstetricosGinecologicos>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente", // Relación con Pacientes
      required: [true, "El paciente es obligatorio"],
    },
    tipoObstetricoGinecologico: {
      type: Schema.Types.ObjectId,
      ref: "TiposObstetricosGinecologicos", // Relación con TiposObstetricosGinecologicos
      required: [true, "El tipo obstétrico/ginecológico es obligatorio"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    observaciones: {
      type: String,
      required: [true, "Las observaciones son obligatorias"],
      trim: true,
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    versionKey: false,
  }
);

// Method to get basic paciente-obstétricos/ginecológicos info (for the list)
PacienteObstetricosGinecologicosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    paciente: this.paciente,
    tipoObstetricoGinecologico: this.tipoObstetricoGinecologico,
    fecha: this.fecha,
    estado: this.estado,
  };
};

export const PacienteObstetricosGinecologicosModel = mongoose.model<PacienteObstetricosGinecologicos>("PacienteObstetricosGinecologicos", PacienteObstetricosGinecologicosSchema);