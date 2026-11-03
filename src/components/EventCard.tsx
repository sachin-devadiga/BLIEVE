"use client";

import { Calendar, Camera, Clock, MapPin, Sparkles } from "lucide-react";
import { siteData } from "@/data/siteData";
import type { Event } from "@/data/types";

const typeColors: Record<string, string> = {
  bootcamp: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  talk: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  hackathon: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  networking: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  challenge: "bg-orange-50 dark:bg-orange/20 text-orange dark:text-orange-light",
  announcement: "bg-orange/10 dark:bg-orange/20 text-orange dark:text-orange-light",
};

const typeLabels: Record<string, string> = {
  bootcamp: "Bootcamp",
  talk: "Talk",
  hackathon: "Hackathon",
  networking: "Networking",
  challenge: "Challenge",
  announcement: "Coming Soon",
};

export default function EventCard({ event }: { event: Event }) {
  const isAnnouncement = event.type === "announcement";
  const badgeClass = typeColors[event.type] || "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  const badgeLabel = typeLabels[event.type] || event.type;

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}
        >
          {isAnnouncement && (
            <Sparkles size={12} aria-hidden="true" />
          )}
          {badgeLabel}
        </span>
        <span className="text-xs font-medium text-text-light">Upcoming</span>
      </div>
      <h3 className="font-serif text-xl font-semibold text-navy dark:text-white mb-3">
        {event.title}
      </h3>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-text-grey dark:text-gray-400">
          <Calendar size={14} className="text-orange shrink-0" aria-hidden="true" />
          {event.date}
        </div>
        {event.time && (
          <div className="flex items-center gap-2 text-sm text-text-grey dark:text-gray-400">
            <Clock size={14} className="text-orange shrink-0" aria-hidden="true" />
            {event.time}
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-text-grey dark:text-gray-400">
            <MapPin size={14} className="text-orange shrink-0" aria-hidden="true" />
            {event.location}
          </div>
        )}
      </div>
      <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed mb-5 flex-1">
        {event.description}
      </p>
      {isAnnouncement ? (
        <a
          href={siteData.contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-light transition-colors"
        >
          <Camera size={16} aria-hidden="true" />
          Follow {siteData.contact.instagramHandle} for the announcement
        </a>
      ) : (
        <a
          href={siteData.contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 border border-orange/40 text-orange text-sm font-semibold rounded-lg hover:bg-orange/10 transition-colors"
        >
          <Camera size={16} aria-hidden="true" />
          Details on {siteData.contact.instagramHandle}
        </a>
      )}
    </div>
  );
}
