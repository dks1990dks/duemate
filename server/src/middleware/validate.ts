import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  z,
  ZodError,
  ZodIssue,
} from "zod";

type RequestValidationSchema = z.ZodType<{
  body?: unknown;
  query?: unknown;
  params?: unknown;
}>;

export const validateRequest =
  (schema: RequestValidationSchema) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validatedData =
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });

      if (validatedData.body !== undefined) {
        req.body = validatedData.body;
      }

      if (validatedData.query !== undefined) {
        Object.assign(req.query, validatedData.query);
      }

      if (validatedData.params !== undefined) {
        Object.assign(req.params, validatedData.params);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map(
            (err: ZodIssue) => ({
              field: err.path.join("."),
              message: err.message,
            }),
          ),
        });
      }

      return next(error);
    }
  };