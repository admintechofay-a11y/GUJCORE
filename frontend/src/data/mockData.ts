/**
 * Re-exporting from the centralized single source of truth: conference.ts
 * All content originates from the official GUJCORR 2027 brochure.
 */

export * from './conference';

// Provide backward compatibility structures for any existing legacy consumers
import { 
  CONFERENCE_INFO, 
  IMPORTANT_DATES, 
  TECHNICAL_SESSIONS, 
  ORGANIZING_COMMITTEE, 
  INTERNATIONAL_ADVISORY,
  SPONSORSHIP_PACKAGES, 
  EXHIBITOR_PACKAGES,
  SOUVENIR_ADVERTISEMENT_RATES, 
  PAST_SUPPORTERS,
  REGISTRATION_TIERS,
  SPEAKERS,
  INITIAL_BOOTHS,
  AWARDS
} from './conference';

// Map committee members for backward compatibility with older components
export const COMMITTEE_MEMBERS = {
  leadership: ORGANIZING_COMMITTEE.leadership,
  members: ORGANIZING_COMMITTEE.members,
  // Backward compatibility aliases
  amppLeadership: [
    ORGANIZING_COMMITTEE.leadership[0],
    ORGANIZING_COMMITTEE.leadership[1],
    ORGANIZING_COMMITTEE.leadership[2],
    ORGANIZING_COMMITTEE.leadership[3],
    ORGANIZING_COMMITTEE.members[0], // Mr. Paresh Haribhakti
    ORGANIZING_COMMITTEE.members[14] // Mr. Rajkumar Kashyap
  ],
  executiveCommittee: ORGANIZING_COMMITTEE.members,
  internationalAdvisory: INTERNATIONAL_ADVISORY,
  iimLeadership: [
    ORGANIZING_COMMITTEE.leadership[0], // Dr. Sunil Kahar
    ORGANIZING_COMMITTEE.members[3],   // Mr. Sumit Kainthola
    ORGANIZING_COMMITTEE.leadership[2], // Mr. Hiren Panchal
    ORGANIZING_COMMITTEE.members[17],  // Dr. Krunal Patel
    ORGANIZING_COMMITTEE.members[11],  // Mr. Siddhesh Jambekar
    ORGANIZING_COMMITTEE.members[10]   // Mrs. Vaishnavi Sangamneka
  ]
};
