"use server";

import fs from "fs/promises";
import path from "path";

export type FormState = {
  success: boolean;
  message: string;
};
