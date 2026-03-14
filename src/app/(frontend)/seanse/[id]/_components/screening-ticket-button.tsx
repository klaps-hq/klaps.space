import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ScreeningTicketButtonProps = {
  ticketUrl: string;
};

const ScreeningTicketButton: React.FC<ScreeningTicketButtonProps> = ({
  ticketUrl,
}) => {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
        Bilety
      </h2>

      <div>
        <Button variant="primary" size="xl" asChild>
          <Link href={ticketUrl} target="_blank" rel="noopener noreferrer">
            Kup bilet
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default ScreeningTicketButton;
