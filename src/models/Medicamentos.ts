import mongoose, { Schema } from "mongoose";
import { Medicamentos } from "types/MedicamentosTypes";

const MedicamentosSchema: Schema = new Schema<Medicamentos>(
  {
    nombreMedicamento: {
      type: String,
      required: [true, "El nombre del medicamento es obligatorio"],
      trim: true,
      unique: true, // Para evitar duplicados en el nombre
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
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

// Method to get basic medicamentos info (for the list)
MedicamentosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    nombreMedicamento: this.nombreMedicamento,
    descripcion: this.descripcion,
    estado: this.estado,
  };
};

export const MedicamentosModel = mongoose.model<Medicamentos>("Medicamentos", MedicamentosSchema);