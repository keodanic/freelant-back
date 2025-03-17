import { Role } from "src/casl/dto/casl.dto";


declare module 'express' {
    interface Request {
      freelancer?: {
        id: string;
        email: string;
      };
    }
  }