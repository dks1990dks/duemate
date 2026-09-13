import { Request, Response } from "express";

import { AppError } from "../../utils/AppError.js";
import { createObligation, getMyObligations, getObligationById, updateObligation, 
  archiveObligation, markObligationAsPaid, pauseObligation, resumeObligation, } from "./obligation.service.js";

export const create = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401,
    );
  }

  const obligation = await createObligation({
    ...req.body,
    userId: req.user.id,
  });

  return res.status(201).json({
    success: true,
    message: "Obligation created successfully",
    data: {
      obligation,
    },
  });
};

export const getAll = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401,
    );
  }

  const obligations = await getMyObligations(
    req.user.id,
  );

  return res.status(200).json({
    success: true,
    message: "Obligations retrieved successfully",
    data: {
      obligations,
    },
  });
};

export const getById = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401,
    );
  }

  const { id } = req.params;

if (typeof id !== "string") {
  throw new AppError(
    "Invalid obligation ID",
    400,
  );
}

const obligation = await getObligationById(
  id,
  req.user.id,
);

  if (!obligation) {
    throw new AppError(
      "Obligation not found",
      404,
    );
  }

  return res.status(200).json({
    success: true,
    message: "Obligation retrieved successfully",
    data: {
      obligation,
    },
  });
};

export const update = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401,
    );
  }

  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(
      "Invalid obligation ID",
      400,
    );
  }

  const obligation = await updateObligation(
    id,
    req.user.id,
    req.body,
  );

  if (!obligation) {
    throw new AppError(
      "Obligation not found",
      404,
    );
  }

  return res.status(200).json({
    success: true,
    message: "Obligation updated successfully",
    data: {
      obligation,
    },
  });
};

export const archive = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401,
    );
  }

  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(
      "Invalid obligation ID",
      400,
    );
  }

  const obligation = await archiveObligation(
    id,
    req.user.id,
  );

  if (!obligation) {
    throw new AppError(
      "Obligation not found",
      404,
    );
  }

  return res.status(200).json({
    success: true,
    message: "Obligation archived successfully",
    data: {
      obligation,
    },
  });
};

export const markAsPaid = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401,
    );
  }

  const { id } = req.params;

  const obligationId = Array.isArray(id)
    ? id[0]
    : id;

  if (!obligationId) {
    throw new AppError(
      "Obligation ID is required",
      400,
    );
  }

  const paymentDate =
    req.body?.paymentDate
      ? new Date(req.body.paymentDate)
      : new Date();

  const obligation =
    await markObligationAsPaid(
      obligationId,
      req.user.id,
      paymentDate,
    );

  if (!obligation) {
    throw new AppError(
      "Obligation not found or cannot be marked as paid",
      404,
    );
  }

  return res.status(200).json({
    success: true,
    message:
      "Obligation marked as paid successfully",
    data: {
      obligation,
    },
  });
};

export const pause = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401,
    );
  }

  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(
      "Invalid obligation ID",
      400,
    );
  }

  const obligation = await pauseObligation(
    id,
    req.user.id,
  );

  if (!obligation) {
    throw new AppError(
      "Obligation not found or cannot be paused",
      404,
    );
  }

  return res.status(200).json({
    success: true,
    message: "Obligation paused successfully",
    data: {
      obligation,
    },
  });
};

export const resume = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401,
    );
  }

  const { id } = req.params;

  if (typeof id !== "string") {
    throw new AppError(
      "Invalid obligation ID",
      400,
    );
  }

  const obligation = await resumeObligation(
    id,
    req.user.id,
  );

  if (!obligation) {
    throw new AppError(
      "Obligation not found or cannot be resumed",
      404,
    );
  }

  return res.status(200).json({
    success: true,
    message: "Obligation resumed successfully",
    data: {
      obligation,
    },
  });
};