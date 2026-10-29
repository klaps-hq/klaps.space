import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ICinemaDetails } from "@/interfaces/ICinema";
import { pluralPl } from "@/lib/seo";
import TrackedCinemaLink from "@/components/common/tracked-cinema-link";

interface CinemaDetailsProps {
  cinemaName: string;
  cinemaSlug: string;
  details: ICinemaDetails | undefined;
}

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

interface OutboundLinkProps {
  href: string;
  cinemaSlug: string;
  children: React.ReactNode;
}

const META_CLASS =
  "text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50";
const LINK_CLASS =
  "group inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-0.5";

const DetailRow = ({ label, children }: DetailRowProps) => (
  <div className="border border-[#1a1a1a] -mt-px -ml-px px-4 md:px-5 py-5 md:py-6 flex flex-col gap-2">
    <dt className={META_CLASS}>{label}</dt>
    <dd className="text-sm md:text-base text-white/80 leading-relaxed flex flex-col gap-1.5 items-start">
      {children}
    </dd>
  </div>
);

const OutboundLink = ({ href, cinemaSlug, children }: OutboundLinkProps) => (
  <TrackedCinemaLink href={href} cinemaSlug={cinemaSlug} className={LINK_CLASS}>
    {children}
    <ArrowUpRight
      aria-hidden="true"
      className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  </TrackedCinemaLink>
);

const seatsLabel = (seats: number) =>
  `${seats} ${pluralPl(seats, "miejsce", "miejsca", "miejsc")}`;

/** "Sala Gerard" stays as is, a bare "Gerard" reads better with the prefix. */
const roomLabel = (name: string) =>
  /^(sala|studio|scena)\b/i.test(name) ? name : `Sala ${name}`;

/**
 * Researched venue facts (rooms, contact, links, accessibility, photos).
 * Renders nothing when the research found nothing, so pages of venues
 * without data look exactly as before.
 */
const CinemaDetails = ({
  cinemaName,
  cinemaSlug,
  details,
}: CinemaDetailsProps) => {
  if (!details) return null;
  const {
    phone,
    repertoireUrl,
    bookingUrl,
    facebookUrl,
    instagramUrl,
    operator,
    rooms,
    accessibility,
    logoUrl,
    photos,
  } = details;
  const screens = details.screens ?? (rooms.length || null);
  const knownSeats = rooms.filter((room) => room.seats !== null);
  const totalSeats =
    knownSeats.length === rooms.length && rooms.length > 0
      ? knownSeats.reduce((sum, room) => sum + (room.seats ?? 0), 0)
      : null;
  const accessibilityItems = [
    accessibility?.wheelchair && "Dostęp dla osób na wózkach",
    accessibility?.hearingLoop && "Pętla indukcyjna",
  ].filter(Boolean) as string[];
  const hasLinks = Boolean(repertoireUrl || bookingUrl);
  const hasSocial = Boolean(facebookUrl || instagramUrl);

  const hasAnything =
    screens !== null ||
    phone ||
    hasLinks ||
    hasSocial ||
    operator ||
    accessibilityItems.length > 0 ||
    accessibility?.note ||
    photos.length > 0;
  if (!hasAnything) return null;

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
      <div className="mb-8 md:mb-10 flex items-center gap-5 md:gap-6">
        {logoUrl && (
          <div className="relative size-14 md:size-16 shrink-0 bg-white rounded-sm p-2">
            <Image
              src={logoUrl}
              alt={`Logo: ${cinemaName}`}
              fill
              sizes="64px"
              className="object-contain p-1.5"
            />
          </div>
        )}
        <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
          Informacje o&nbsp;kinie
        </h2>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-px pl-px">
        {screens !== null && (
          <DetailRow label="Sale">
            <span>
              {screens} {pluralPl(screens, "sala", "sale", "sal")}
              {totalSeats !== null && <>, łącznie {seatsLabel(totalSeats)}</>}
            </span>
            {rooms.length > 1 &&
              rooms.map((room) => (
                <span key={room.name} className="text-white/60">
                  {roomLabel(room.name)}
                  {room.seats !== null && <>: {seatsLabel(room.seats)}</>}
                </span>
              ))}
          </DetailRow>
        )}

        {hasLinks && (
          <DetailRow label="Na stronie kina">
            {repertoireUrl && repertoireUrl === bookingUrl ? (
              <OutboundLink href={repertoireUrl} cinemaSlug={cinemaSlug}>
                Repertuar i rezerwacja miejsc
              </OutboundLink>
            ) : (
              <>
                {repertoireUrl && (
                  <OutboundLink href={repertoireUrl} cinemaSlug={cinemaSlug}>
                    Repertuar kina
                  </OutboundLink>
                )}
                {bookingUrl && (
                  <OutboundLink href={bookingUrl} cinemaSlug={cinemaSlug}>
                    Rezerwacja miejsc online
                  </OutboundLink>
                )}
              </>
            )}
          </DetailRow>
        )}

        {phone && (
          <DetailRow label="Telefon">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className={LINK_CLASS}
            >
              {phone}
            </a>
          </DetailRow>
        )}

        {hasSocial && (
          <DetailRow label="Media społecznościowe">
            {facebookUrl && (
              <OutboundLink href={facebookUrl} cinemaSlug={cinemaSlug}>
                Facebook
              </OutboundLink>
            )}
            {instagramUrl && (
              <OutboundLink href={instagramUrl} cinemaSlug={cinemaSlug}>
                Instagram
              </OutboundLink>
            )}
          </DetailRow>
        )}

        {(accessibilityItems.length > 0 || accessibility?.note) && (
          <DetailRow label="Dostępność">
            {accessibilityItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
            {accessibility?.note && (
              <span className="text-white/60">{accessibility.note}</span>
            )}
          </DetailRow>
        )}

        {operator && (
          <DetailRow label="Prowadzi">
            {operator.url ? (
              <OutboundLink href={operator.url} cinemaSlug={cinemaSlug}>
                {operator.name}
              </OutboundLink>
            ) : (
              <span>{operator.name}</span>
            )}
          </DetailRow>
        )}
      </dl>

      {photos.length > 0 && (
        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {photos.map((photo, index) => (
            <figure key={photo.url} className="flex flex-col gap-2">
              <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.04]">
                <Image
                  src={photo.url}
                  alt={`${cinemaName}, zdjęcie ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover grayscale hover:grayscale-0 transition duration-500"
                />
              </div>
              {/* Attribution required by the CC licences: author, licence
                  with its link, and the source file. */}
              <figcaption className="text-[11px] text-white/45 leading-snug">
                Fot.{" "}
                <a
                  href={photo.sourceUrl}
                  target="_blank"
                  rel="noopener"
                  className="hover:text-white/80 underline-offset-2 hover:underline"
                >
                  {photo.author}
                </a>
                , Wikimedia Commons,{" "}
                {photo.licenseUrl ? (
                  <a
                    href={photo.licenseUrl}
                    target="_blank"
                    rel="noopener license"
                    className="hover:text-white/80 underline-offset-2 hover:underline"
                  >
                    {photo.license}
                  </a>
                ) : (
                  photo.license
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
};

export default CinemaDetails;
