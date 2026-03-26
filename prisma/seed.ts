import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.lookupValue.createMany({
    data: [
      { lookupGroup: "PROJECT_TYPE", code: "ENERGY", label: "Énergie", sortOrder: 1 },
      { lookupGroup: "PROJECT_TYPE", code: "INFRA", label: "Infrastructure", sortOrder: 2 },
      { lookupGroup: "PROJECT_TYPE", code: "INDUSTRY", label: "Industrie", sortOrder: 3 },
      { lookupGroup: "CITY", code: "CASABLANCA", label: "Casablanca", sortOrder: 1 },
      { lookupGroup: "CITY", code: "RABAT", label: "Rabat", sortOrder: 2 },
      { lookupGroup: "CITY", code: "TANGER", label: "Tanger", sortOrder: 3 }
    ],
    skipDuplicates: true
  });

  const project = await prisma.project.upsert({
    where: { projectCode: "PFV7-000001" },
    update: {},
    create: {
      projectCode: "PFV7-000001",
      projectName: "Centrale solaire démo",
      clientRadical: "CLI0001",
      city: "Ouarzazate",
      country: "Maroc",
      projectType: "Énergie",
      currency: "MAD",
      totalCostMad: 1200000000,
      requestedDebtMad: 780000000,
      equityMad: 420000000,
      sponsorName: "Sponsor Démo",
      offtakerName: "ONEE",
      epcName: "EPC Démo",
      omOperatorName: "OM Démo",
      stage: "Construction",
      description: "Projet de démonstration V7++."
    }
  });

  await prisma.evaluation.create({
    data: {
      projectId: project.id,
      classificationBam: "HEALTHY",
      preAdjustmentScore: 73.5,
      finalScore: 73.5,
      finalGrade: "B1",
      approved: true,
      commentary: "Aucun hard stop.",
      rawPayloadJson: JSON.stringify({ seeded: true }),
      domainScores: {
        create: [
          { domainCode: "SPONSOR", domainName: "Sponsor & Environnement", weight: 0.14, rawScore: 75, weightedScore: 10.5 },
          { domainCode: "PROJECT", domainName: "Maturité du projet", weight: 0.12, rawScore: 70, weightedScore: 8.4 },
          { domainCode: "CONSTRUCTION", domainName: "Construction", weight: 0.15, rawScore: 68, weightedScore: 10.2 },
          { domainCode: "OPERATIONS", domainName: "Opérations", weight: 0.10, rawScore: 70, weightedScore: 7.0 },
          { domainCode: "MARKET", domainName: "Marché & Revenus", weight: 0.14, rawScore: 74, weightedScore: 10.36 },
          { domainCode: "LEGAL", domainName: "Cadre juridique", weight: 0.10, rawScore: 72, weightedScore: 7.2 },
          { domainCode: "FINANCIAL", domainName: "Structure financière", weight: 0.20, rawScore: 78, weightedScore: 15.6 },
          { domainCode: "ESG", domainName: "ESG & Résilience", weight: 0.05, rawScore: 85, weightedScore: 4.25 }
        ]
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
