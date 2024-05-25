import "dotenv/config";
import { Credentials } from "../models/Credentials.js";

console.log(await Credentials.findAll({ limit: 5 }));
