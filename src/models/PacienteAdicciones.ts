import mongoose, { Schema } from "mongoose";
import { PacienteAdicciones } from "types/PacienteAdiccionesTypes";

const PacienteAdiccionesSchema: Schema = new Schema<PacienteAdicciones>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: "Paciente", // Relación con Pacientes
      required: [true, "El paciente es obligatorio"],
    },
    tipoAdiccion: {
      type: Schema.Types.ObjectId,
      ref: "TiposAdicciones", // Relación con TiposAdicciones
      required: [true, "El tipo de adicción es obligatorio"],
    },
    fechaInicio: {
      type: Date,
      required: [true, "La fecha de inicio es obligatoria"],
    },
    fechaFin: {
      type: Date,
      required: false, // Opcional
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

// Method to get basic paciente-adicciones info (for the list)
PacienteAdiccionesSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    paciente: this.paciente,
    tipoAdiccion: this.tipoAdiccion,
    fechaInicio: this.fechaInicio,
    fechaFin: this.fechaFin,
    estado: this.estado,
  };
};

export const PacienteAdiccionesModel = mongoose.model<PacienteAdicciones>("PacienteAdicciones", PacienteAdiccionesSchema);