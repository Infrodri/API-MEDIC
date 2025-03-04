import app from "@server/server";
import dotenv from "dotenv";
import "@config/mongodb";

dotenv.config();

const port = process.env.PORT || 4000;

const headers = {
 
  "Authorization": process.env.AUTHORIZATION
};

console.log(headers);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
