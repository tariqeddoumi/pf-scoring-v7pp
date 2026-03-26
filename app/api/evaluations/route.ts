import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeScore } from "@/lib/scoring";

export async function POST(request: Request) {
  const payload = await request.json();

  const result = computeScore(payload);

  const evaluation = await prisma.evaluation.create({
    data: {
      projectId: payload.projectId,
      evaluationDate: new Date(),
      classificationBam: payload.classificationBam,
      preAdjustmentScore: result.preAdjustment,
      finalScore: result.finalScore,
      finalGrade: result.grade.grade,
      approved: result.approved,
      commentary: result.hardStops.join(" | ") || "Aucun hard stop.",
      rawPayloadJson: JSON.stringify(payload, null, 2),
      domainScores: {
        create: result.domains.map((domain) => ({
          domainCode: domain.code,
          domainName: domain.name,
          weight: domain.weight,
          rawScore: domain.rawScore,
          weightedScore: domain.weightedScore,
          redFlag: Boolean(domain.redFlag)
        }))
      }
    }
  });

  return NextResponse.json(evaluation, { status: 201 });
}
