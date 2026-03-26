import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const payload = await request.json();

  const project = await prisma.project.create({
    data: {
      projectCode: payload.projectCode,
      projectName: payload.projectName,
      clientRadical: payload.clientRadical,
      city: payload.city,
      country: payload.country,
      projectType: payload.projectType,
      currency: payload.currency,
      totalCostMad: payload.totalCostMad,
      requestedDebtMad: payload.requestedDebtMad,
      equityMad: payload.equityMad,
      sponsorName: payload.sponsorName,
      offtakerName: payload.offtakerName,
      epcName: payload.epcName,
      omOperatorName: payload.omOperatorName,
      stage: payload.stage,
      description: payload.description
    }
  });

  return NextResponse.json(project, { status: 201 });
}
