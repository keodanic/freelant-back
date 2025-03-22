import { SetMetadata } from '@nestjs/common';

// export const IS_PUBLIC_KEY = async () => ({
//     IS_PUBLIC_KEY: process.env.JWT_SECRET,
// });

export const Public = () => SetMetadata(process.env.JWT_SECRET, true);