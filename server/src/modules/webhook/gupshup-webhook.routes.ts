import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  console.log("[Gupshup Webhook] Event received", req.body);

  return res.status(200).json({
    success: true,
  });
});

export default router;