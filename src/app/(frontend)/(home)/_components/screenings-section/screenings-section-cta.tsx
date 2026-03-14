import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScreeningsSectionCta = () => {
  return (
    <Button variant="secondary" size="lg" asChild className="w-fit mx-auto">
      <Link href="/seanse">
        Zobacz wszystkie seanse
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  );
};

export default ScreeningsSectionCta;
