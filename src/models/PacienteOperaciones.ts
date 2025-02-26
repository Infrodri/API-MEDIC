import mongoose, { Schema } from "mongoose";
import { PacienteOperaciones } from "types/PacienteOperacionesTypes";

const PacienteOperacionesSchema: Schema = new Schema<PacienteOperaciones>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente", // Relación con Pacientes
      required: [true, "El paciente es obligatorio"],
    },
    tipoOperacion: {
      type: Schema.Types.ObjectId,
      ref: "TiposOperacionesQuirurgicas", // Relación con TiposOperacionesQuirurgicas
      required: [true, "El tipo de operación es obligatorio"],
    },
    fechaOperacion: {
      type: Date,
      required: [true, "La fecha de operación es obligatoria"],
    },
    resultado: {
      type: String,
      required: [true, "El resultado es obligatorio"],
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

// Method to get basic paciente-operaciones info (for the list)
PacienteOperacionesSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    paciente: this.paciente,
    tipoOperacion: this.tipoOperacion,
    fechaOperacion: this.fechaOperacion,
    estado: this.estado,
  };
};

export const PacienteOperacionesModel = mongoose.model<PacienteOperaciones>("PacienteOperaciones", PacienteOperacionesSchema);