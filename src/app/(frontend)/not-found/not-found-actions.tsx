import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFoundActions: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-3">
      <Button variant="primary" size="lg" asChild>
        <Link href="/">Wróć do repertuaru</Link>
      </Button>
      <Button variant="secondary" size="lg" asChild>
        <Link href="/filmy">Przeglądaj filmy</Link>
      </Button>
    </div>
  );
};

export default NotFoundActions;
