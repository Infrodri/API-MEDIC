import mongoose, { Schema } from "mongoose";
import { User } from "types/UsersTypes";
import bcrypt from "bcrypt";

const UserSchema: Schema = new Schema<User>(
  {
    name: {      type: String,      required: true },
    username: {
      type: String, required: true, unique: true},
    email: {
      type: String, required: true, unique: true },
    password: {
      type: String, required: true, trim: true },
    permissions: {
      type: [String], default: [] },
    roles: [
      {
        //en mongoose puede referencial a coleciones de otros en el caso de este es guardar el id de roles
        ref: "Roles",
        type: Schema.Types.ObjectId
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

//metodo de verificacion de contraseĆ±a e incriptacion de contraseĆ±a
UserSchema.pre<User>("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  next();
});
//comparacion de contrasena
UserSchema.method("comparePassword", async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password as string);
});
//metodo para no mostrar la contrasena en el json
UserSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};
export const UserModel = mongoose.model<User>("User", UserSchema);