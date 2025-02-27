import mongoose, { Schema } from "mongoose";
import { Paciente } from "types/PacientesTypes";

const PacienteSchema: Schema = new Schema<Paciente>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
    },
    fechaNacimiento: {
      type: Date,
      required: [true, "La fecha de nacimiento es obligatoria"],
      validate: {
        validator: function (value: Date) {
          return value <= new Date(); // Ensures date is not in the future
        },
        message: "La fecha de nacimiento no puede ser futura",
      },
    },
    direccion: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
      match: [/^\d{7,10}$/, "Formato de teléfono inválido"], // Example validation for phone (7-10 digits)
    },
    celular: {
      type: String,
      required: [true, "El celular es obligatorio"],
      trim: true,
      match: [/^\d{10}$/, "Formato de celular inválido"], // Example validation for cell phone (10 digits)
    },
    genero: {
      type: String,
      required: [true, "El género es obligatorio"],
      enum: ["Masculino", "Femenino", "Otro"],
      default: "Otro",
    },
    cedula: {
      type: String,
      required: [true, "La cédula es obligatoria"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Formato de cédula inválido"], // Example validation for ID (10 digits)
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Inactivo",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    versionKey: false,
  }
);

// Method to get basic patient info (for the list)
PacienteSchema.methods.getBasicInfo = function () {
  return {
    nombre: this.nombre,
    apellido: this.apellido,
    cedula: this.cedula,
    estado: this.estado,
  };
};

export const PacienteModel = mongoose.model<Paciente>("Paciente", PacienteSchema);