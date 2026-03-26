import fs from "fs/promises";
import path from "path";
import { Card, SectionTitle } from "@/components/ui";

export default async function SqlPage() {
  const sql = await fs.readFile(path.join(process.cwd(), "sql", "init_pf_scoring_v7pp.sql"), "utf8");

  return (
    <Card className="p-6">
      <SectionTitle
        title="Script SQL de création"
        subtitle="Le même script est fourni dans le ZIP sous /sql/init_pf_scoring_v7pp.sql"
      />
      <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
        {sql}
      </pre>
    </Card>
  );
}
