// src/models/Pacientes.ts
import mongoose, { Schema } from "mongoose";
import { Paciente } from "types/PacientesTypes";

const PacienteSchema: Schema = new Schema<Paciente>(
  {
    cedula: {
      type: String,
      unique: true,
      sparse: true, // Permite valores nulos sin conflictos de unicidad
      trim: true,
    },
    primerNombre: { type: String, required: [true, "El primer nombre es obligatorio"], trim: true },
    segundoNombre: { type: String, trim: true, default: "" },
    primerApellido: { type: String, required: [true, "El primer apellido es obligatorio"], trim: true },
    segundoApellido: { type: String, trim: true, default: "" },
    fechaNacimiento: {
      type: Date,
      required: [true, "La fecha de nacimiento es obligatoria"],
      validate: { validator: (v: Date) => v <= new Date(), message: "La fecha de nacimiento no puede ser futura" },
    },
    direccion: { type: String, required: [true, "La dirección es obligatoria"], trim: true },
    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
      match: [/^\d{7,10}$/, "Formato de teléfono inválido"],
    },
    celular: {
      type: String,
      required: [true, "El celular es obligatorio"],
      trim: true,
      match: [/^\d{10}$/, "Formato de celular inválido"],
    },
    genero: {
      type: String,
      required: [true, "El género es obligatorio"],
      enum: ["Masculino", "Femenino", "Otro"],
      default: "Otro",
    },
    estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
    estadoAtencion: { type: String, enum: ["Pendiente", "Atendido", "Derivado"], default: "Pendiente" },
  },
  { timestamps: true, versionKey: false }
);

PacienteSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    cedula: this.cedula,
    primerNombre: this.primerNombre,
    primerApellido: this.primerApellido,
    fechaNacimiento: this.fechaNacimiento,
    direccion: this.direccion,
    telefono: this.telefono,
    estado: this.estado,
    estadoAtencion: this.estadoAtencion,
  };
};

export const PacienteModel = mongoose.model<Paciente>("Paciente", PacienteSchema);