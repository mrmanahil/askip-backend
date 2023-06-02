import { Request, Response, NextFunction } from "express";

export const successHandler = (
  res: Response,
  data: unknown,
  message?: string
): void => {
  res.status(200).json({ message, data, success: true });
};

export const notFoundHandler = (res: Response, message?: string): void => {
  res.status(404).json({ message });
};
export const noContent = (res: Response, message?: string): void => {
  res.status(204).json({ message });
};

export const errorHandler = (
  error: { status: number; message: string },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const { status = 500, message } = error;
  res.status(status).json(message);
};

export const unauthorizedHandler = (res: Response, error: Error): void => {
  res.status(401).json({ error: error.message });
};

export const badRequestHandler = (res: Response, message: string): void => {
  res.status(400).json({ message: message });
};

export const serverErrorHandler = (
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: Error | any,
  data?: unknown
): void => {
  res.status(500).json({ error: error.message, data });
};

export const validationHandler = (res: Response, message: string): void => {
  res.status(422).json({ error: message });
};
