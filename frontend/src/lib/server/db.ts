import { neon } from '@neondatabase/serverless';
import { getStore, saveStore, StoreData } from './store';

const DEFAULT_DATABASE_URL = 'postgresql://gujcorr_db_owner:npg_EAbFWK4Jq8jl@ep-frosty-unit-a1pcjx8q-pooler.ap-southeast-1.aws.neon.tech/gujcorr_db?channel_binding=require&sslmode=require';

export function getDb() {
  const connStr = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
  if (!connStr) return null;
  try {
    return neon(connStr);
  } catch (err) {
    console.warn('[DB] Failed initializing Neon client:', err);
    return null;
  }
}

// 1. Users
export async function dbGetUsers(): Promise<any[]> {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT id, email, username, full_name as "fullName", role, password_hash as "passwordHash", status, last_login as "lastLogin", created_at as "createdAt"
        FROM users
        ORDER BY created_at ASC;
      `;
      if (rows && rows.length > 0) return rows;
    } catch (err) {
      console.warn('[DB] Error fetching users from DB, falling back to local store:', err);
    }
  }
  return getStore().users;
}

export async function dbGetUserByEmail(email: string): Promise<any | null> {
  const cleanEmail = email.trim().toLowerCase();
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT id, email, username, full_name as "fullName", role, password_hash as "passwordHash", status, last_login as "lastLogin", created_at as "createdAt"
        FROM users
        WHERE LOWER(email) = ${cleanEmail}
        LIMIT 1;
      `;
      if (rows && rows.length > 0) return rows[0];
    } catch (err) {
      console.warn('[DB] Error querying user by email from DB:', err);
    }
  }
  const store = getStore();
  return store.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
}

export async function dbUpdateUserLastLogin(userId: string): Promise<void> {
  const sql = getDb();
  const now = new Date().toISOString();
  if (sql) {
    try {
      await sql`
        UPDATE users SET last_login = ${now} WHERE id = ${userId};
      `;
    } catch (err) {
      console.warn('[DB] Error updating last_login in DB:', err);
    }
  }
  const store = getStore();
  const user = store.users.find(u => u.id === userId);
  if (user) {
    user.lastLogin = now;
    saveStore(store);
  }
}

// 2. Papers
export async function dbGetPapers(filters?: { symposiumId?: string | null; status?: string | null; search?: string | null }): Promise<any[]> {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, 
          paper_code as "paperCode", 
          full_name as "fullName", 
          email, 
          mobile_number as "mobileNumber", 
          company_name as "companyName", 
          symposium_id as "symposiumId", 
          symposium_title as "symposiumTitle", 
          paper_title as "paperTitle", 
          presentation_type as "presentationType", 
          status, 
          abstract, 
          keywords, 
          co_authors as "coAuthors", 
          review_score as "reviewScore", 
          review_comments as "reviewComments", 
          reviewed_by as "reviewedBy", 
          file_name as "fileName",
          file_type as "fileType",
          file_size as "fileSize",
          file_data as "fileData",
          abstract_file_name as "abstractFileName",
          abstract_file_data as "abstractFileData",
          full_paper_file_name as "fullPaperFileName",
          full_paper_file_data as "fullPaperFileData",
          full_paper_status as "fullPaperStatus",
          full_paper_review_comments as "fullPaperReviewComments",
          full_paper_score as "fullPaperScore",
          full_paper_reviewed_by as "fullPaperReviewedBy",
          presentation_file_name as "presentationFileName",
          presentation_file_data as "presentationFileData",
          submission_date as "submissionDate",
          submission_date as "submittedAt"
        FROM papers
        ORDER BY submission_date DESC;
      `;
      // Deduplicate: If an author submitted the exact same paper title multiple times, keep only 1 entry (favoring scored or latest)
      const seen = new Map<string, any>();
      for (const p of rows || []) {
        // Fallback abstract file to legacy file_data if abstract_file_data not explicitly populated
        p.abstractFileName = p.abstractFileName || p.fileName;
        p.abstractFileData = p.abstractFileData || p.fileData;
        p.fullPaperStatus = p.fullPaperStatus || ((p.fullPaperFileName || p.fullPaperFileData) ? 'Submitted' : 'Pending Submission');

        const key = `${(p.email || '').trim().toLowerCase()}:::${(p.paperTitle || '').trim().toLowerCase()}`;
        if (!seen.has(key)) {
          seen.set(key, p);
        } else {
          const existing = seen.get(key);
          if ((!existing.reviewScore && p.reviewScore) || (!existing.fileData && p.fileData) || (!existing.abstractFileData && p.abstractFileData)) {
            seen.set(key, p);
          }
        }
      }
      let list = Array.from(seen.values());

      if (filters?.symposiumId && filters.symposiumId !== 'all') {
        list = list.filter((p: any) => String(p.symposiumId) === String(filters.symposiumId));
      }
      if (filters?.status && filters.status !== 'all') {
        list = list.filter((p: any) => (p.status || '').toLowerCase().includes(filters.status!.toLowerCase()));
      }
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        list = list.filter((p: any) =>
          (p.paperTitle || '').toLowerCase().includes(s) ||
          (p.fullName || '').toLowerCase().includes(s) ||
          (p.email || '').toLowerCase().includes(s) ||
          (p.paperCode || '').toLowerCase().includes(s) ||
          (p.companyName || '').toLowerCase().includes(s)
        );
      }
      return list;
    } catch (err) {
      console.warn('[DB] Error fetching papers from DB, falling back:', err);
    }
  }

  const store = getStore();
  const seenStore = new Map<string, any>();
  for (const p of store.papers || []) {
    const key = `${(p.email || '').trim().toLowerCase()}:::${(p.paperTitle || '').trim().toLowerCase()}`;
    if (!seenStore.has(key)) {
      seenStore.set(key, p);
    } else {
      const existing = seenStore.get(key);
      if ((!existing.reviewScore && p.reviewScore) || (!existing.fileData && p.fileData)) {
        seenStore.set(key, p);
      }
    }
  }
  let list = Array.from(seenStore.values());

  if (filters?.symposiumId && filters.symposiumId !== 'all') {
    list = list.filter(p => String(p.symposiumId) === String(filters.symposiumId));
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter(p => (p.status || '').toLowerCase().includes(filters.status!.toLowerCase()));
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(p =>
      (p.paperTitle || '').toLowerCase().includes(s) ||
      (p.fullName || '').toLowerCase().includes(s) ||
      (p.email || '').toLowerCase().includes(s) ||
      (p.paperCode || p.id || '').toLowerCase().includes(s) ||
      (p.companyName || '').toLowerCase().includes(s)
    );
  }
  return list;
}

export async function dbInsertPaper(p: any): Promise<any> {
  const sql = getDb();
  const id = p.id || ('GUJ27-PAP-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const paperCode = p.paperCode || id;
  const now = new Date().toISOString();
  const sympId = parseInt(String(p.symposiumId || 1), 10) || 1;

  if (sql) {
    try {
      const cleanEmail = (p.email || '').trim().toLowerCase();
      const cleanTitle = (p.paperTitle || '').trim().toLowerCase();

      // Check if author already submitted a paper with this exact title
      const existing = await sql`
        SELECT id, paper_code as "paperCode"
        FROM papers
        WHERE LOWER(email) = ${cleanEmail} AND LOWER(paper_title) = ${cleanTitle}
        LIMIT 1;
      `;

      if (existing && existing.length > 0) {
        const existingId = existing[0].id;
        const existingCode = existing[0].paperCode;
        await sql`
          UPDATE papers
          SET
            full_name = COALESCE(${p.fullName || null}, full_name),
            mobile_number = COALESCE(${p.mobileNumber || null}, mobile_number),
            company_name = COALESCE(${p.companyName || p.organization || null}, company_name),
            presentation_type = COALESCE(${p.presentationType || null}, presentation_type),
            abstract = COALESCE(${p.abstract || null}, abstract),
            keywords = COALESCE(${p.keywords || null}, keywords),
            co_authors = COALESCE(${p.coAuthors || null}, co_authors),
            file_name = COALESCE(${p.fileName || null}, file_name),
            file_type = COALESCE(${p.fileType || null}, file_type),
            file_size = COALESCE(${p.fileSize || null}, file_size),
            file_data = COALESCE(${p.fileData || null}, file_data),
            abstract_file_name = COALESCE(${p.abstractFileName || p.fileName || null}, abstract_file_name),
            abstract_file_data = COALESCE(${p.abstractFileData || p.fileData || null}, abstract_file_data),
            full_paper_file_name = COALESCE(${p.fullPaperFileName || null}, full_paper_file_name),
            full_paper_file_data = COALESCE(${p.fullPaperFileData || null}, full_paper_file_data),
            presentation_file_name = COALESCE(${p.presentationFileName || null}, presentation_file_name),
            presentation_file_data = COALESCE(${p.presentationFileData || null}, presentation_file_data),
            updated_at = ${now}
          WHERE id = ${existingId};
        `;

        return {
          ...p,
          id: existingId,
          paperCode: existingCode,
          submissionDate: now,
          status: p.status || 'Submitted'
        };
      }

      await sql`
        INSERT INTO papers (
          id, paper_code, full_name, email, mobile_number, company_name,
          symposium_id, symposium_title, paper_title, presentation_type,
          status, abstract, keywords, co_authors, submission_date,
          file_name, file_type, file_size, file_data,
          abstract_file_name, abstract_file_data,
          full_paper_file_name, full_paper_file_data,
          presentation_file_name, presentation_file_data
        ) VALUES (
          ${id},
          ${paperCode},
          ${p.fullName || 'Anonymous Author'},
          ${p.email || ''},
          ${p.mobileNumber || ''},
          ${p.companyName || p.organization || ''},
          ${sympId},
          ${p.symposiumTitle || 'Corrosion Science'},
          ${p.paperTitle || 'Untitled Paper'},
          ${p.presentationType || 'Oral'},
          ${p.status || 'Submitted'},
          ${p.abstract || ''},
          ${p.keywords || ''},
          ${p.coAuthors || ''},
          ${p.submissionDate || now},
          ${p.fileName || null},
          ${p.fileType || null},
          ${p.fileSize || null},
          ${p.fileData || null},
          ${p.abstractFileName || p.fileName || null},
          ${p.abstractFileData || p.fileData || null},
          ${p.fullPaperFileName || null},
          ${p.fullPaperFileData || null},
          ${p.presentationFileName || null},
          ${p.presentationFileData || null}
        )
        ON CONFLICT (paper_code) DO NOTHING;
      `;
    } catch (err) {
      console.warn('[DB] Error inserting/updating paper in DB:', err);
    }
  }

  // Also update local store (safely without crashing)
  try {
    const store = getStore();
    const newPaper = {
      ...p,
      id,
      paperCode,
      submissionDate: p.submissionDate || now,
      status: p.status || 'Submitted',
      fileName: p.fileName,
      fileType: p.fileType,
      fileSize: p.fileSize,
      fileData: p.fileData,
      abstractFileName: p.abstractFileName || p.fileName,
      abstractFileData: p.abstractFileData || p.fileData,
      fullPaperFileName: p.fullPaperFileName,
      fullPaperFileData: p.fullPaperFileData,
      presentationFileName: p.presentationFileName,
      presentationFileData: p.presentationFileData
    };
    const filtered = store.papers.filter(item => item.id !== id && item.paperCode !== paperCode);
    filtered.unshift(newPaper);
    store.papers = filtered;
    saveStore(store);
  } catch (storeErr) {
    console.warn('[DB] Error updating local file store:', storeErr);
  }

  return {
    ...p,
    id,
    paperCode,
    submissionDate: p.submissionDate || now,
    status: p.status || 'Submitted'
  };
}

export async function dbAttachPaperFile(
  paperCode: string, 
  file: { fileName: string; fileType?: string; fileSize?: string; fileData: string },
  docType: 'abstract' | 'full_paper' | 'presentation' = 'full_paper',
  chunkIndex?: number
): Promise<boolean> {
  const sql = getDb();
  const now = new Date().toISOString();
  const isAppend = typeof chunkIndex === 'number' && chunkIndex > 0;

  if (sql) {
    try {
      if (docType === 'abstract') {
        if (isAppend) {
          await sql`
            UPDATE papers
            SET 
              abstract_file_data = COALESCE(abstract_file_data, '') || ${file.fileData},
              updated_at = ${now}
            WHERE paper_code = ${paperCode} OR id = ${paperCode};
          `;
        } else {
          await sql`
            UPDATE papers
            SET 
              abstract_file_name = ${file.fileName},
              abstract_file_data = ${file.fileData},
              updated_at = ${now}
            WHERE paper_code = ${paperCode} OR id = ${paperCode};
          `;
        }
      } else if (docType === 'presentation') {
        if (isAppend) {
          await sql`
            UPDATE papers
            SET 
              presentation_file_data = COALESCE(presentation_file_data, '') || ${file.fileData},
              updated_at = ${now}
            WHERE paper_code = ${paperCode} OR id = ${paperCode};
          `;
        } else {
          await sql`
            UPDATE papers
            SET 
              presentation_file_name = ${file.fileName},
              presentation_file_data = ${file.fileData},
              updated_at = ${now}
            WHERE paper_code = ${paperCode} OR id = ${paperCode};
          `;
        }
      } else {
        if (isAppend) {
          await sql`
            UPDATE papers
            SET 
              full_paper_file_data = COALESCE(full_paper_file_data, '') || ${file.fileData},
              file_data = COALESCE(file_data, '') || ${file.fileData},
              updated_at = ${now}
            WHERE paper_code = ${paperCode} OR id = ${paperCode};
          `;
        } else {
          await sql`
            UPDATE papers
            SET 
              full_paper_file_name = ${file.fileName},
              full_paper_file_data = ${file.fileData},
              full_paper_status = 'Submitted',
              file_name = ${file.fileName},
              file_type = ${file.fileType || 'application/pdf'},
              file_size = ${file.fileSize || 'Unknown'},
              file_data = ${file.fileData},
              updated_at = ${now}
            WHERE paper_code = ${paperCode} OR id = ${paperCode};
          `;
        }
      }
    } catch (err) {
      console.warn('[DB] Error attaching paper file to DB:', err);
    }
  }

  const store = getStore();
  const paper = store.papers.find(p => p.paperCode === paperCode || p.id === paperCode);
  if (paper) {
    if (docType === 'abstract') {
      if (isAppend) {
        paper.abstractFileData = (paper.abstractFileData || '') + file.fileData;
      } else {
        paper.abstractFileName = file.fileName;
        paper.abstractFileData = file.fileData;
      }
    } else if (docType === 'presentation') {
      if (isAppend) {
        paper.presentationFileData = (paper.presentationFileData || '') + file.fileData;
      } else {
        paper.presentationFileName = file.fileName;
        paper.presentationFileData = file.fileData;
      }
    } else {
      if (isAppend) {
        paper.fullPaperFileData = (paper.fullPaperFileData || '') + file.fileData;
        paper.fileData = (paper.fileData || '') + file.fileData;
      } else {
        paper.fullPaperFileName = file.fileName;
        paper.fullPaperFileData = file.fileData;
        paper.fullPaperStatus = 'Submitted';
        paper.fileName = file.fileName;
        paper.fileData = file.fileData;
      }
    }
    paper.updatedAt = now;
    saveStore(store);
  }
  return true;
}

export async function dbDeletePaper(paperCode: string): Promise<boolean> {
  const sql = getDb();
  if (sql) {
    try {
      await sql`
        DELETE FROM papers
        WHERE paper_code = ${paperCode} OR id = ${paperCode};
      `;
    } catch (err) {
      console.warn('[DB] Error deleting paper from DB:', err);
    }
  }

  const store = getStore();
  store.papers = store.papers.filter(p => p.paperCode !== paperCode && p.id !== paperCode);
  saveStore(store);
  return true;
}

export async function dbDeleteRegistration(ticketId: string): Promise<boolean> {
  const sql = getDb();
  if (sql) {
    try {
      await sql`
        DELETE FROM registrations
        WHERE ticket_id = ${ticketId} OR id = ${ticketId};
      `;
    } catch (err) {
      console.warn('[DB] Error deleting registration from DB:', err);
    }
  }

  const store = getStore();
  store.registrations = store.registrations.filter(r => r.ticketId !== ticketId && r.id !== ticketId);
  saveStore(store);
  return true;
}

export async function dbUpdatePaperDecision(
  paperCode: string, 
  score?: number, 
  comments?: string, 
  status?: string, 
  assignedReviewer?: string, 
  reviewerEmail?: string,
  reviewType: 'abstract' | 'full_paper' = 'abstract'
): Promise<boolean> {
  const sql = getDb();
  const now = new Date().toISOString();

  if (sql) {
    try {
      if (reviewType === 'full_paper') {
        await sql`
          UPDATE papers
          SET 
            full_paper_score = COALESCE(${score ?? null}, full_paper_score),
            full_paper_review_comments = COALESCE(${comments ?? null}, full_paper_review_comments),
            full_paper_status = COALESCE(${status ?? null}, full_paper_status),
            full_paper_reviewed_by = COALESCE(${reviewerEmail ?? null}, full_paper_reviewed_by),
            updated_at = ${now}
          WHERE paper_code = ${paperCode} OR id = ${paperCode};
        `;
      } else {
        await sql`
          UPDATE papers
          SET 
            review_score = COALESCE(${score ?? null}, review_score),
            review_comments = COALESCE(${comments ?? null}, review_comments),
            status = COALESCE(${status ?? null}, status),
            reviewed_by = COALESCE(${reviewerEmail ?? null}, reviewed_by),
            updated_at = ${now}
          WHERE paper_code = ${paperCode} OR id = ${paperCode};
        `;
      }
    } catch (err) {
      console.warn('[DB] Error updating paper decision in DB:', err);
    }
  }

  const store = getStore();
  const paper = store.papers.find(p => p.paperCode === paperCode || p.id === paperCode);
  if (paper) {
    if (reviewType === 'full_paper') {
      if (score !== undefined) paper.fullPaperScore = Number(score);
      if (comments !== undefined) paper.fullPaperReviewComments = comments;
      if (status !== undefined) paper.fullPaperStatus = status;
    } else {
      if (score !== undefined) paper.reviewScore = Number(score);
      if (comments !== undefined) paper.reviewComments = comments;
      if (status !== undefined) paper.status = status;
    }
    if (assignedReviewer !== undefined) paper.assignedReviewer = assignedReviewer;
    paper.updatedAt = now;
    if (reviewerEmail) paper.reviewedBy = reviewerEmail;
    saveStore(store);
    return true;
  }
  return true;
}

// 3. Registrations (Delegates)
export async function dbGetRegistrations(filters?: { status?: string | null; search?: string | null }): Promise<any[]> {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, 
          ticket_id as "ticketId", 
          full_name as "fullName", 
          gender, 
          designation, 
          organization, 
          department, 
          email, 
          mobile_number as "mobileNumber", 
          country, 
          state, 
          city, 
          address, 
          category, 
          tier_name as "tierName", 
          membership_number as "membershipNumber", 
          gst_number as "gstNumber", 
          base_amount as "baseAmount", 
          gst_amount as "gstAmount", 
          total_amount as "totalAmount", 
          payment_method as "paymentMethod", 
          status, 
          qr_code_url as "qrCodeUrl", 
          registration_date as "registrationDate"
        FROM registrations
        ORDER BY registration_date DESC;
      `;
      let list = rows || [];
      if (filters?.status && filters.status !== 'all') {
        list = list.filter((r: any) => (r.status || '').toLowerCase().includes(filters.status!.toLowerCase()));
      }
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        list = list.filter((r: any) =>
          (r.fullName || '').toLowerCase().includes(s) ||
          (r.email || '').toLowerCase().includes(s) ||
          (r.ticketId || '').toLowerCase().includes(s) ||
          (r.organization || '').toLowerCase().includes(s)
        );
      }
      return list;
    } catch (err) {
      console.warn('[DB] Error fetching registrations from DB:', err);
    }
  }

  const store = getStore();
  let list = [...store.registrations];
  if (filters?.status && filters.status !== 'all') {
    list = list.filter(r => (r.status || '').toLowerCase().includes(filters.status!.toLowerCase()));
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(r =>
      (r.fullName || '').toLowerCase().includes(s) ||
      (r.email || '').toLowerCase().includes(s) ||
      (r.ticketId || r.id || '').toLowerCase().includes(s) ||
      (r.organization || '').toLowerCase().includes(s)
    );
  }
  return list;
}

export async function dbInsertRegistration(reg: any): Promise<any> {
  const sql = getDb();
  const ticketId = reg.ticketId || ('GUJ27-DEL-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const id = reg.id || ticketId;
  const now = new Date().toISOString();
  const qrCodeUrl = reg.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GUJCORR2027:${ticketId}`;

  if (sql) {
    try {
      await sql`
        INSERT INTO registrations (
          id, ticket_id, full_name, gender, designation, organization, department,
          email, mobile_number, country, state, city, address, category, tier_name,
          membership_number, gst_number, base_amount, gst_amount, total_amount,
          payment_method, status, qr_code_url, registration_date
        ) VALUES (
          ${id},
          ${ticketId},
          ${reg.fullName || ''},
          ${reg.gender || 'Male'},
          ${reg.designation || ''},
          ${reg.organization || ''},
          ${reg.department || ''},
          ${reg.email || ''},
          ${reg.mobileNumber || ''},
          ${reg.country || 'India'},
          ${reg.state || 'Gujarat'},
          ${reg.city || 'Vadodara'},
          ${reg.address || ''},
          ${reg.category || ''},
          ${reg.tierName || ''},
          ${reg.membershipNumber || ''},
          ${reg.gstNumber || ''},
          ${reg.baseAmount || 0},
          ${reg.gstAmount || 0},
          ${reg.totalAmount || 0},
          ${reg.paymentMethod || 'Bank Transfer / NEFT'},
          ${reg.status || 'Confirmed & Paid'},
          ${qrCodeUrl},
          ${reg.registrationDate || now}
        )
        ON CONFLICT (ticket_id) DO NOTHING;
      `;
    } catch (err) {
      console.warn('[DB] Error inserting registration into DB:', err);
    }
  }

  const store = getStore();
  const newReg = {
    ...reg,
    id,
    ticketId,
    qrCodeUrl,
    registrationDate: reg.registrationDate || now,
    status: reg.status || 'Confirmed & Paid'
  };
  const filtered = store.registrations.filter(item => item.id !== id && item.ticketId !== ticketId);
  filtered.unshift(newReg);
  store.registrations = filtered;
  saveStore(store);

  return newReg;
}

export async function dbUpdateRegistrationStatus(ticketId: string, status: string): Promise<boolean> {
  const sql = getDb();
  const now = new Date().toISOString();

  if (sql) {
    try {
      await sql`
        UPDATE registrations
        SET status = ${status}, updated_at = ${now}
        WHERE ticket_id = ${ticketId} OR id = ${ticketId};
      `;
    } catch (err) {
      console.warn('[DB] Error updating registration status in DB:', err);
    }
  }

  const store = getStore();
  const reg = store.registrations.find(r => r.ticketId === ticketId || r.id === ticketId);
  if (reg) {
    reg.status = status;
    saveStore(store);
  }
  return true;
}

// 4. Booths
export async function dbGetBooths(): Promise<any[]> {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, 
          booth_number as "boothNumber", 
          company_name as "companyName", 
          contact_person as "contactPerson", 
          email, 
          mobile_number as "mobileNumber", 
          booth_size as "boothSize", 
          base_price as "basePrice", 
          gst_amount as "gstAmount", 
          total_price as "totalPrice", 
          status, 
          booked_at as "bookedAt"
        FROM booths
        ORDER BY booth_number ASC;
      `;
      if (rows && rows.length > 0) return rows;
    } catch (err) {
      console.warn('[DB] Error fetching booths from DB:', err);
    }
  }
  return getStore().booths;
}

export async function dbUpdateBooth(boothNumber: string, data: any): Promise<boolean> {
  const sql = getDb();
  const now = new Date().toISOString();

  if (sql) {
    try {
      await sql`
        UPDATE booths
        SET 
          status = COALESCE(${data.status ?? null}, status),
          company_name = COALESCE(${data.companyName ?? null}, company_name),
          contact_person = COALESCE(${data.contactPerson ?? null}, contact_person),
          email = COALESCE(${data.email ?? null}, email),
          mobile_number = COALESCE(${data.mobileNumber ?? null}, mobile_number),
          booked_at = CASE WHEN ${data.status} = 'Booked' THEN NOW() ELSE booked_at END
        WHERE booth_number = ${boothNumber};
      `;
    } catch (err) {
      console.warn('[DB] Error updating booth in DB:', err);
    }
  }

  const store = getStore();
  const booth = store.booths.find(b => b.boothNumber === boothNumber);
  if (booth) {
    Object.assign(booth, data);
    saveStore(store);
  }
  return true;
}

// 5. CMS Content
export async function dbGetCmsContent(): Promise<Record<string, any>> {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`SELECT section_key, data FROM cms_content;`;
      if (rows && rows.length > 0) {
        const contentObj: Record<string, any> = {};
        for (const row of rows) {
          contentObj[row.section_key] = row.data;
        }
        return contentObj;
      }
    } catch (err) {
      console.warn('[DB] Error fetching CMS content from DB:', err);
    }
  }
  return getStore().content;
}

export async function dbSaveCmsContent(sectionKey: string, data: any, updatedBy: string = 'admin@gujcorr.org'): Promise<boolean> {
  const sql = getDb();
  if (sql) {
    try {
      await sql`
        INSERT INTO cms_content (section_key, data, updated_by, updated_at)
        VALUES (${sectionKey}, ${JSON.stringify(data)}, ${updatedBy}, NOW())
        ON CONFLICT (section_key) DO UPDATE SET data = EXCLUDED.data, updated_by = EXCLUDED.updated_by, updated_at = NOW();
      `;
    } catch (err) {
      console.warn('[DB] Error saving CMS content to DB:', err);
    }
  }

  const store = getStore();
  store.content[sectionKey] = data;
  saveStore(store);
  return true;
}

// 6. Audit Logs
export async function dbGetAuditLogs(limit: number = 50): Promise<any[]> {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, 
          user_id as "userId", 
          user_email as "userEmail", 
          action, 
          resource_type as "resourceType", 
          resource_id as "resourceId", 
          details, 
          ip_address as "ipAddress", 
          status, 
          created_at as "createdAt"
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
      if (rows && rows.length > 0) return rows;
    } catch (err) {
      console.warn('[DB] Error fetching audit logs from DB:', err);
    }
  }
  return getStore().auditLogs.slice(0, limit);
}

export async function dbAppendAuditLog(entry: {
  userId: string;
  userEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress?: string;
  status?: 'Success' | 'Failed';
}): Promise<void> {
  const sql = getDb();
  const id = 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  if (sql) {
    try {
      await sql`
        INSERT INTO audit_logs (id, user_id, user_email, action, resource_type, resource_id, details, ip_address, status, created_at)
        VALUES (
          ${id},
          ${entry.userId},
          ${entry.userEmail},
          ${entry.action},
          ${entry.resourceType},
          ${entry.resourceId},
          ${entry.details},
          ${entry.ipAddress || '127.0.0.1'},
          ${entry.status || 'Success'},
          ${now}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    } catch (err) {
      console.warn('[DB] Error appending audit log to DB:', err);
    }
  }
}

// 7. Users management
export async function dbInsertUser(u: any): Promise<any> {
  const sql = getDb();
  const id = u.id || ('usr-' + Math.random().toString(36).substring(2, 9));
  const now = new Date().toISOString();

  if (sql) {
    try {
      await sql`
        INSERT INTO users (
          id, email, username, full_name, role, password_hash, status, created_at, updated_at
        ) VALUES (
          ${id},
          ${u.email},
          ${u.username || u.email.split('@')[0]},
          ${u.fullName},
          ${u.role},
          ${u.passwordHash},
          ${u.status || 'Active'},
          ${now},
          ${now}
        )
        ON CONFLICT (email) DO NOTHING;
      `;
    } catch (err) {
      console.warn('[DB] Error inserting user into DB:', err);
    }
  }

  const store = getStore();
  const newUser = {
    id,
    email: u.email,
    username: u.username || u.email.split('@')[0],
    fullName: u.fullName,
    role: u.role,
    passwordHash: u.passwordHash,
    status: (u.status || 'Active') as 'Active' | 'Disabled',
    createdAt: now,
    lastLogin: undefined
  };
  store.users.push(newUser);
  saveStore(store);
  return newUser;
}

export async function dbUpdateUserStatus(userId: string, status: string): Promise<boolean> {
  const sql = getDb();
  const now = new Date().toISOString();

  if (sql) {
    try {
      await sql`
        UPDATE users
        SET status = ${status}, updated_at = ${now}
        WHERE id = ${userId};
      `;
    } catch (err) {
      console.warn('[DB] Error updating user status in DB:', err);
    }
  }

  const store = getStore();
  const target = store.users.find(u => u.id === userId);
  if (target) {
    target.status = status as 'Active' | 'Disabled';
    saveStore(store);
  }
  return true;
}

// 8. Inquiries
export async function dbGetInquiries(filters?: { status?: string | null; search?: string | null }): Promise<any[]> {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, 
          name, 
          email, 
          mobile_number as "mobileNumber", 
          organization, 
          subject, 
          message, 
          status, 
          internal_notes as "internalNotes", 
          assigned_to as "assignedTo", 
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM inquiries
        ORDER BY created_at DESC;
      `;
      let list = rows || [];
      if (filters?.status && filters.status !== 'all') {
        list = list.filter((i: any) => (i.status || '').toLowerCase() === filters.status!.toLowerCase());
      }
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        list = list.filter((i: any) =>
          (i.name || '').toLowerCase().includes(s) ||
          (i.email || '').toLowerCase().includes(s) ||
          (i.subject || '').toLowerCase().includes(s) ||
          (i.organization || '').toLowerCase().includes(s) ||
          (i.message || '').toLowerCase().includes(s)
        );
      }
      return list;
    } catch (err) {
      console.warn('[DB] Error fetching inquiries from DB:', err);
    }
  }

  const store = getStore();
  let list = [...store.inquiries];
  if (filters?.status && filters.status !== 'all') {
    list = list.filter(i => (i.status || '').toLowerCase() === filters.status!.toLowerCase());
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(i =>
      (i.name || '').toLowerCase().includes(s) ||
      (i.email || '').toLowerCase().includes(s) ||
      (i.subject || '').toLowerCase().includes(s) ||
      (i.organization || '').toLowerCase().includes(s) ||
      (i.message || '').toLowerCase().includes(s)
    );
  }
  return list;
}

export async function dbInsertInquiry(inq: any): Promise<any> {
  const sql = getDb();
  const id = inq.id || ('inq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6));
  const now = new Date().toISOString();

  if (sql) {
    try {
      await sql`
        INSERT INTO inquiries (
          id, name, email, mobile_number, organization, subject, message, status, created_at, updated_at
        ) VALUES (
          ${id},
          ${inq.name || ''},
          ${inq.email || ''},
          ${inq.mobileNumber || ''},
          ${inq.organization || ''},
          ${inq.subject || ''},
          ${inq.message || ''},
          ${inq.status || 'Unread'},
          ${now},
          ${now}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    } catch (err) {
      console.warn('[DB] Error inserting inquiry into DB:', err);
    }
  }

  const store = getStore();
  const newInq = {
    ...inq,
    id,
    status: inq.status || 'Unread',
    createdAt: inq.createdAt || now
  };
  store.inquiries.unshift(newInq);
  saveStore(store);
  return newInq;
}

export async function dbUpdateInquiry(id: string, data: { status?: string; internalNotes?: string; assignedTo?: string }): Promise<boolean> {
  const sql = getDb();
  const now = new Date().toISOString();

  if (sql) {
    try {
      await sql`
        UPDATE inquiries
        SET 
          status = COALESCE(${data.status ?? null}, status),
          internal_notes = COALESCE(${data.internalNotes ?? null}, internal_notes),
          assigned_to = COALESCE(${data.assignedTo ?? null}, assigned_to),
          updated_at = ${now}
        WHERE id = ${id};
      `;
    } catch (err) {
      console.warn('[DB] Error updating inquiry in DB:', err);
    }
  }

  const store = getStore();
  const inq = store.inquiries.find(i => i.id === id);
  if (inq) {
    if (data.status !== undefined) inq.status = data.status;
    if (data.internalNotes !== undefined) inq.internalNotes = data.internalNotes;
    if (data.assignedTo !== undefined) inq.assignedTo = data.assignedTo;
    inq.updatedAt = now;
    saveStore(store);
  }
  return true;
}

