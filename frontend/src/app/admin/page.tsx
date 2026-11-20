'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  CreditCard, 
  Store, 
  Mail, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Edit3, 
  RefreshCw, 
  TrendingUp, 
  FileSpreadsheet, 
  Building2, 
  Phone, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  UserCheck, 
  Shield, 
  Eye, 
  LogOut, 
  Sliders, 
  History, 
  FileCheck, 
  Award, 
  Layers, 
  Check, 
  X, 
  PlusCircle, 
  HelpCircle, 
  UploadCloud, 
  MessageSquare, 
  Trash2, 
  Presentation,
  BookOpen
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { api } from '@/lib/api';
import { DelegateRegistration, PaperSubmission } from '@/types';
import { useAuth, UserRole } from '@/context/AuthContext';

export default function AdminPage() {
  const { user, login, logout, checkSession } = useAuth();
  
  // Active Tab state (Supporting separate dedicated tabs for Abstract & Full Paper Approvals)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'delegates' | 'abstracts' | 'fullpapers' | 'papers' | 'booths' | 'sponsorship' | 'finance' | 'inquiries' | 'cms' | 'staff' | 'audit'
  >('overview');

  // Login gate state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [registrations, setRegistrations] = useState<DelegateRegistration[]>([]);
  const [papers, setPapers] = useState<PaperSubmission[]>([]);
  const [booths, setBooths] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals state
  const [selectedPaper, setSelectedPaper] = useState<PaperSubmission | null>(null);
  const [reviewModalType, setReviewModalType] = useState<'abstract' | 'full_paper'>('abstract');
  const [abstractTextModalPaper, setAbstractTextModalPaper] = useState<PaperSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(8.5);
  const [commentsInput, setCommentsInput] = useState<string>('');
  const [paperStatusInput, setPaperStatusInput] = useState<string>('Accepted for Oral Presentation');

  const [selectedBooth, setSelectedBooth] = useState<any | null>(null);
  const [boothCompanyInput, setBoothCompanyInput] = useState('');
  const [boothContactInput, setBoothContactInput] = useState('');
  const [boothEmailInput, setBoothEmailInput] = useState('');
  const [boothMobileInput, setBoothMobileInput] = useState('');
  const [boothStatusInput, setBoothStatusInput] = useState('Confirmed');

  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [inquiryNotesInput, setInquiryNotesInput] = useState('');
  const [inquiryStatusInput, setInquiryStatusInput] = useState('In Progress');
  const [inquiryAssignInput, setInquiryAssignInput] = useState('Secretariat Staff');

  // Staff creation modal state
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Secretariat Staff');
  const [showStaffModal, setShowStaffModal] = useState(false);

  // CMS Form state
  const [cmsForm, setCmsForm] = useState({
    conferenceName: 'GUJCORR 2027',
    tagline: 'Stronger Together: Uniting the Global Fight Against Corrosion',
    dates: '18th – 20th February 2027',
    venue: 'Vadodara, Gujarat, India',
    abstractDeadline: '28th October 2026',
    earlyBirdDeadline: '30th October 2026',
    organizerEmail: 'iim.barodachapter@gmail.com',
    organizerPhone: '+91 9988881674'
  });

  const isStaffAuthorized = !!(
    user && [
      'Super Administrator',
      'Administrator',
      'Secretariat Staff',
      'Finance Staff',
      'Paper Coordinator',
      'Reviewer',
      'Content Editor',
      'Admin'
    ].includes(user.role)
  );

  const isSuperAdmin = user?.role === 'Super Administrator' || user?.role === 'Admin';

  useEffect(() => {
    if (isStaffAuthorized) {
      loadAllAdminData();
    }
  }, [isStaffAuthorized]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const loadAllAdminData = async () => {
    setIsLoadingData(true);
    try {
      const [overRes, regRes, papRes, boothRes, inqRes, cmsRes, userRes, audRes] = await Promise.allSettled([
        api.getAdminOverview(),
        fetch('/api/admin/registrations', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/papers', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/booths', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/inquiries', { credentials: 'include' }).then(r => r.json()),
        api.getCmsContent(),
        api.getAdminUsers(),
        api.getAuditLogs('all', 50)
      ]);

      if (overRes.status === 'fulfilled' && overRes.value.data) {
        setOverviewData(overRes.value.data);
      }
      if (regRes.status === 'fulfilled' && regRes.value.data) {
        setRegistrations(regRes.value.data);
      }
      if (papRes.status === 'fulfilled' && papRes.value.data) {
        setPapers(papRes.value.data);
      }
      if (boothRes.status === 'fulfilled' && boothRes.value.data) {
        setBooths(boothRes.value.data);
      }
      if (inqRes.status === 'fulfilled' && inqRes.value.data) {
        setInquiries(inqRes.value.data);
      }
      if (cmsRes.status === 'fulfilled' && cmsRes.value.data) {
        setCmsContent(cmsRes.value.data);
        if (cmsRes.value.data.general) {
          setCmsForm(prev => ({
            ...prev,
            conferenceName: cmsRes.value.data.general.conferenceName || prev.conferenceName,
            tagline: cmsRes.value.data.general.tagline || prev.tagline,
            dates: cmsRes.value.data.general.dates || prev.dates,
            venue: cmsRes.value.data.general.venue || prev.venue,
            organizerEmail: cmsRes.value.data.general.email || prev.organizerEmail,
            organizerPhone: cmsRes.value.data.general.phone || prev.organizerPhone,
            abstractDeadline: cmsRes.value.data.deadlines?.abstractSubmission || prev.abstractDeadline,
            earlyBirdDeadline: cmsRes.value.data.deadlines?.earlyBirdRegistration || prev.earlyBirdDeadline
          }));
        }
      }
      if (userRes.status === 'fulfilled' && userRes.value.data) {
        setStaffUsers(userRes.value.data);
      }
      if (audRes.status === 'fulfilled' && audRes.value.data) {
        setAuditLogs(audRes.value.data);
      }
    } catch (err) {
      console.warn('Error loading admin records:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await login(loginEmail, loginPassword, 'Admin');
      if (res.success) {
        showToast('Authenticated successfully with server-verified credentials.');
      } else {
        setLoginError(res.message || 'Invalid administrative email or password.');
      }
    } catch {
      setLoginError('Authentication error occurred. Please check network connectivity.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    showToast('Signed out of administrative console.');
  };

  // Delegate actions
  const handleUpdateDelegateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await api.updateRegistration(ticketId, newStatus);
      if (res.success) {
        showToast(`Registration #${ticketId} status updated to "${newStatus}".`);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed updating status.');
      }
    } catch (err) {
      alert('Error updating delegate status.');
    }
  };

  // Paper review save (abstract or full paper)
  const handleSavePaperReview = async () => {
    if (!selectedPaper) return;
    const paperCode = selectedPaper.paperCode || selectedPaper.id;
    try {
      const res = await api.updatePaperDecision(
        paperCode, 
        scoreInput, 
        commentsInput, 
        paperStatusInput, 
        user?.email, 
        reviewModalType
      );
      if (res.success) {
        showToast(
          reviewModalType === 'full_paper'
            ? `Full Paper #${paperCode} reviewed: Score ${scoreInput}/10, Status: "${paperStatusInput}".`
            : `Abstract #${paperCode} reviewed: Score ${scoreInput}/10, Status: "${paperStatusInput}".`
        );
        setSelectedPaper(null);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed saving review.');
      }
    } catch {
      alert('Error saving review decision.');
    }
  };

  const openReviewModal = (p: PaperSubmission, type: 'abstract' | 'full_paper' = 'abstract') => {
    setSelectedPaper(p);
    setReviewModalType(type);
    if (type === 'full_paper') {
      setScoreInput(p.fullPaperScore || 8.5);
      setCommentsInput(p.fullPaperReviewComments || '');
      setPaperStatusInput(p.fullPaperStatus || 'Accepted for Proceedings');
    } else {
      setScoreInput(p.reviewScore || 8.5);
      setCommentsInput(p.reviewComments || '');
      setPaperStatusInput(p.status || 'Accepted for Oral Presentation');
    }
  };

  // View any uploaded document (abstract, paper, or presentation) directly in a new tab
  const handleViewFile = (fileData?: string, fallbackTitle: string = 'document.pdf') => {
    if (!fileData) {
      alert(`No document file is attached for ${fallbackTitle} yet.`);
      return;
    }
    try {
      if (fileData.startsWith('data:')) {
        const parts = fileData.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const byteString = atob(parts[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } else {
        window.open(fileData, '_blank');
      }
    } catch {
      window.open(fileData, '_blank');
    }
  };

  // Legacy fallback wrapper
  const handleViewPaperPdf = (p: any) => {
    handleViewFile(p.abstractFileData || p.fileData, p.abstractFileName || p.fileName || `${p.paperCode || p.id}_Abstract.pdf`);
  };

  // Download any single file
  const handleDownloadSingleFile = (fileData?: string, fileName: string = 'document.pdf') => {
    if (!fileData) {
      alert(`No file has been uploaded for "${fileName}" yet.`);
      return;
    }
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Legacy fallback wrapper
  const handleDownloadPaperFile = (p: any) => {
    handleDownloadSingleFile(p.abstractFileData || p.fileData, p.abstractFileName || p.fileName || `${p.paperCode || p.id}_Manuscript.pdf`);
  };

  // 1-click Approve, Under Review, or Reject Abstract decision
  const handleQuickAbstractDecision = async (paperCode: string, newStatus: string) => {
    const isApprove = newStatus.includes('Accepted');
    const isUnder = newStatus.toLowerCase().includes('under review');
    const actionLabel = isApprove ? 'APPROVE ABSTRACT' : isUnder ? 'MARK ABSTRACT AS UNDER REVIEW' : 'REJECT ABSTRACT';
    if (!window.confirm(`Are you sure you want to ${actionLabel} for paper #${paperCode}?`)) {
      return;
    }

    try {
      const res = await api.updatePaperDecision(paperCode, undefined, undefined, newStatus, user?.email, 'abstract');
      if (res.success) {
        showToast(`Abstract #${paperCode} successfully updated to "${newStatus}".`);
        setPapers(prev => prev.map(p => (p.paperCode === paperCode || p.id === paperCode) ? { ...p, status: newStatus } : p));
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed updating abstract status.');
      }
    } catch {
      alert('Network error while updating abstract decision.');
    }
  };

  // 1-click Quick Full Paper Proceedings Decision
  const handleQuickFullPaperDecision = async (paperCode: string, newStatus: string) => {
    const isApprove = newStatus.includes('Accepted') || newStatus.includes('Proceedings');
    const isUnder = newStatus.toLowerCase().includes('under review');
    const actionLabel = isApprove ? 'APPROVE FOR PROCEEDINGS' : isUnder ? 'MARK UNDER REVIEW' : 'REJECT FULL PAPER';
    if (!window.confirm(`Are you sure you want to ${actionLabel} for paper #${paperCode}?`)) {
      return;
    }

    try {
      const res = await api.updatePaperDecision(paperCode, undefined, undefined, newStatus, user?.email, 'full_paper');
      if (res.success) {
        showToast(`Full Paper #${paperCode} successfully updated to "${newStatus}".`);
        setPapers(prev => prev.map(p => (p.paperCode === paperCode || p.id === paperCode) ? { ...p, fullPaperStatus: newStatus } : p));
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed updating full paper status.');
      }
    } catch {
      alert('Network error while updating full paper decision.');
    }
  };

  // Legacy fallback alias
  const handleQuickPaperDecision = handleQuickAbstractDecision;

  // Upload or attach abstract, manuscript or presentation file
  const handleUploadPaperFile = async (
    paperCode: string, 
    file: File, 
    docType: 'abstract' | 'full_paper' | 'presentation' = 'full_paper'
  ) => {
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) {
      alert('File size exceeds 30MB limit.');
      return;
    }
    const docLabel = docType === 'abstract' ? 'Abstract' : docType === 'presentation' ? 'Presentation Slide Deck' : 'Full Paper Manuscript';
    showToast(`Uploading ${docLabel} for paper #${paperCode}...`);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      const res = await api.attachManuscript(paperCode, base64Data, file.name, fileSize, user?.email, docType);
      if (res.success) {
        showToast(`✅ ${docLabel} uploaded and saved for paper #${paperCode}!`);
        loadAllAdminData();
      } else {
        alert(res.message || `Failed uploading ${docLabel}.`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete Paper Submission from Live Neon DB
  const handleDeletePaper = async (paperCode: string, title?: string) => {
    const displayTitle = title ? `"${title}" ` : '';
    if (!window.confirm(`⚠️ Are you sure you want to PERMANENTLY DELETE paper submission ${displayTitle}(#${paperCode}) from the live database?\n\nThis will remove the author entry and all attached documents. This action CANNOT be undone.`)) {
      return;
    }
    try {
      showToast(`Deleting paper #${paperCode}...`);
      const res = await api.deletePaper(paperCode);
      if (res.success) {
        showToast(`✅ Paper #${paperCode} successfully deleted from database.`);
        setPapers(prev => prev.filter(p => (p.paperCode !== paperCode && p.id !== paperCode)));
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed deleting paper submission.');
      }
    } catch {
      alert('Network error while deleting paper.');
    }
  };

  // Delete Delegate Registration from Live Neon DB
  const handleDeleteRegistration = async (ticketId: string, name?: string) => {
    const displayName = name ? `for "${name}" ` : '';
    if (!window.confirm(`⚠️ Are you sure you want to PERMANENTLY DELETE delegate registration ${displayName}(Ticket #${ticketId}) from the live database?\n\nThis action CANNOT be undone.`)) {
      return;
    }
    try {
      showToast(`Deleting registration #${ticketId}...`);
      const res = await api.deleteRegistration(ticketId);
      if (res.success) {
        showToast(`✅ Registration #${ticketId} successfully deleted from database.`);
        setRegistrations(prev => prev.filter(r => (r.ticketId !== ticketId && r.id !== ticketId)));
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed deleting delegate registration.');
      }
    } catch {
      alert('Network error while deleting registration.');
    }
  };

  // Booth allocation save
  const handleSaveBoothAllocation = async () => {
    if (!selectedBooth) return;
    try {
      const res = await api.updateBoothAllocation(selectedBooth.boothNumber, boothStatusInput, {
        companyName: boothCompanyInput,
        contactPerson: boothContactInput,
        email: boothEmailInput,
        mobileNumber: boothMobileInput
      });
      if (res.success) {
        showToast(`Booth #${selectedBooth.boothNumber} updated to "${boothStatusInput}".`);
        setSelectedBooth(null);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed updating booth.');
      }
    } catch {
      alert('Error updating booth reservation.');
    }
  };

  // Inquiry update save
  const handleSaveInquiry = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await api.updateInquiry(selectedInquiry.id, inquiryStatusInput, inquiryNotesInput, inquiryAssignInput);
      if (res.success) {
        showToast(`Inquiry #${selectedInquiry.id} updated.`);
        setSelectedInquiry(null);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed updating inquiry.');
      }
    } catch {
      alert('Error updating inquiry status.');
    }
  };

  // CMS update save
  const handleSaveCmsContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        general: {
          conferenceName: cmsForm.conferenceName,
          tagline: cmsForm.tagline,
          dates: cmsForm.dates,
          venue: cmsForm.venue,
          email: cmsForm.organizerEmail,
          phone: cmsForm.organizerPhone
        },
        deadlines: {
          abstractSubmission: cmsForm.abstractDeadline,
          earlyBirdRegistration: cmsForm.earlyBirdDeadline
        }
      };

      const res = await api.updateCmsContent('general', payload.general);
      await api.updateCmsContent('deadlines', payload.deadlines);

      if (res.success) {
        showToast('Live conference CMS content updated and published successfully.');
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed publishing CMS content.');
      }
    } catch {
      alert('Error publishing CMS updates.');
    }
  };

  // Staff creation
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createAdminUser({
        email: newStaffEmail,
        fullName: newStaffName,
        password: newStaffPassword,
        role: newStaffRole
      });
      if (res.success) {
        showToast(`Staff account provisioned for ${newStaffEmail}.`);
        setShowStaffModal(false);
        setNewStaffEmail('');
        setNewStaffName('');
        setNewStaffPassword('');
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed creating staff user.');
      }
    } catch {
      alert('Error provisioning staff account.');
    }
  };

  // Toggle Staff status
  const handleToggleStaffStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
    if (!confirm(`Are you sure you want to change this staff account to ${nextStatus}?`)) return;

    try {
      const res = await api.updateAdminUserStatus(userId, nextStatus as any);
      if (res.success) {
        showToast(`Account status updated to ${nextStatus}.`);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed toggling status.');
      }
    } catch {
      alert('Error toggling staff status.');
    }
  };

  // CSV Exports
  const exportDelegatesCsv = () => {
    const headers = ['Ticket ID', 'Full Name', 'Email', 'Mobile', 'Organization', 'Designation', 'Category', 'Total Amount', 'Status', 'Date'];
    const rows = registrations.map(r => [
      r.ticketId || r.id,
      `"${r.fullName}"`,
      r.email,
      r.mobileNumber,
      `"${r.organization}"`,
      `"${r.designation}"`,
      r.category,
      r.totalAmount || 4720,
      r.status,
      r.registrationDate?.split('T')[0] || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GUJCORR_2027_Delegates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPapersCsv = () => {
    const headers = ['Paper Code', 'Author Name', 'Email', 'Mobile', 'Organization', 'Symposium ID', 'Symposium Title', 'Paper Title', 'Type', 'Status', 'Review Score'];
    const rows = papers.map(p => [
      p.paperCode || p.id,
      `"${p.fullName}"`,
      p.email,
      p.mobileNumber,
      `"${p.companyName}"`,
      p.symposiumId,
      `"${p.symposiumTitle}"`,
      `"${(p.paperTitle || '').replace(/"/g, '""')}"`,
      p.presentationType,
      p.status,
      p.reviewScore || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GUJCORR_2027_Abstracts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportFullPapersCsv = () => {
    const headers = ['Paper Code', 'Author Name', 'Email', 'Mobile', 'Organization', 'Symposium ID', 'Symposium Title', 'Paper Title', 'Abstract Decision', 'Manuscript File', 'Proceedings Status', 'Manuscript Score', 'Reviewer Feedback'];
    const rows = papers.map(p => [
      p.paperCode || p.id,
      `"${p.fullName}"`,
      p.email,
      p.mobileNumber,
      `"${p.companyName}"`,
      p.symposiumId,
      `"${p.symposiumTitle}"`,
      `"${(p.paperTitle || '').replace(/"/g, '""')}"`,
      p.status || 'Submitted',
      p.fullPaperFileName || 'None',
      p.fullPaperStatus || 'Pending Submission',
      p.fullPaperScore || 'N/A',
      `"${(p.fullPaperReviewComments || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GUJCORR_2027_Full_Papers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics computation from overviewData or local
  const totalDelegates = overviewData?.registrations?.total ?? registrations.length;
  const confirmedDelegates = overviewData?.registrations?.confirmed ?? registrations.filter(r => (r.status || '').toLowerCase().includes('confirmed')).length;
  const verifiedRevenue = overviewData?.registrations?.verifiedRevenue ?? registrations.filter(r => (r.status || '').toLowerCase().includes('confirmed')).reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const outstandingRevenue = overviewData?.registrations?.outstandingRevenue ?? registrations.filter(r => (r.status || '').toLowerCase().includes('pending')).reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const totalPapers = overviewData?.papers?.total ?? papers.length;
  const acceptedPapers = overviewData?.papers?.accepted ?? papers.filter(p => (p.status || '').toLowerCase().includes('accepted')).length;

  const papersWithFullPaper = useMemo(() => {
    return papers.filter(p => !!(p.fullPaperFileData || p.fullPaperFileName || (p.fullPaperStatus && p.fullPaperStatus !== 'Pending Submission')));
  }, [papers]);

  const acceptedFullPapers = useMemo(() => {
    return papers.filter(p => (p.fullPaperStatus || '').toLowerCase().includes('proceeding') || (p.fullPaperStatus || '').toLowerCase().includes('accept')).length;
  }, [papers]);

  const totalBoothsBooked = overviewData?.exhibition?.booked ?? booths.filter(b => b.status === 'Confirmed' || b.status === 'Reserved').length;
  const unreadInquiries = overviewData?.inquiries?.unread ?? inquiries.filter(i => (i.status || '').toLowerCase() === 'unread').length;

  // Filtered Delegate records
  const filteredDelegates = registrations.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchQuery = (r.fullName || '').toLowerCase().includes(q) ||
                       (r.email || '').toLowerCase().includes(q) ||
                       (r.ticketId || '').toLowerCase().includes(q) ||
                       (r.organization || '').toLowerCase().includes(q);
    if (statusFilter !== 'all' && (r.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (categoryFilter !== 'all' && (r.category || '').toLowerCase() !== categoryFilter.toLowerCase()) return false;
    return matchQuery;
  });

  // Filtered Abstracts records
  const filteredAbstracts = papers.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchQuery = (p.paperTitle || '').toLowerCase().includes(q) ||
                       (p.fullName || '').toLowerCase().includes(q) ||
                       (p.paperCode || p.id || '').toLowerCase().includes(q) ||
                       (p.symposiumTitle || '').toLowerCase().includes(q);
    if (statusFilter !== 'all' && !(p.status || '').toLowerCase().includes(statusFilter.toLowerCase())) return false;
    return matchQuery;
  });

  // Filtered Full Papers records
  const filteredFullPapers = papers.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchQuery = (p.paperTitle || '').toLowerCase().includes(q) ||
                       (p.fullName || '').toLowerCase().includes(q) ||
                       (p.paperCode || p.id || '').toLowerCase().includes(q) ||
                       (p.symposiumTitle || '').toLowerCase().includes(q);
    if (statusFilter === 'all') return matchQuery;
    if (statusFilter === 'uploaded') return matchQuery && !!(p.fullPaperFileData || p.fullPaperFileName);
    if (statusFilter === 'missing') return matchQuery && !(p.fullPaperFileData || p.fullPaperFileName);
    return matchQuery && (p.fullPaperStatus || '').toLowerCase().includes(statusFilter.toLowerCase());
  });

  // Legacy fallback alias
  const filteredPapers = filteredAbstracts;

  // Filtered Booth records
  const filteredBooths = booths.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchQuery = (b.companyName || b.company_name || '').toLowerCase().includes(q) ||
                       (b.contactPerson || b.contact_person || '').toLowerCase().includes(q) ||
                       (b.boothNumber || b.stallNumber || '').toLowerCase().includes(q);
    if (statusFilter !== 'all' && (b.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    return matchQuery;
  });

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(i => {
    const q = searchTerm.toLowerCase();
    const matchQuery = (i.name || '').toLowerCase().includes(q) ||
                       (i.email || '').toLowerCase().includes(q) ||
                       (i.subject || '').toLowerCase().includes(q) ||
                       (i.organization || '').toLowerCase().includes(q);
    if (statusFilter !== 'all' && (i.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    return matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between" suppressHydrationWarning>
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Enterprise Control Center"
        title="Conference Secretariat"
        highlightedTitle="Master Admin Panel"
        description="Centralized administration for GUJCORR 2027 delegates, peer-review editorial scoring, exhibition floor allocation, and revenue reconciliation."
        breadcrumbs={[{ label: 'Admin Portal' }]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* 1. AUTHENTICATION GATE (Server-Validated, No Insecure PINs) */}
        {!isStaffAuthorized ? (
          <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded">
                Restricted Administrative Area
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Staff Authentication Required
              </h2>
              <p className="text-xs text-slate-500">
                Sign in with authorized conference credentials to access registration manifests, paper scoring, booth allocation, and financial auditing.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Administrative Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@gujcorr.org"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter administrative password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isLoggingIn ? 'Verifying Credentials...' : 'Sign In to Secretariat Panel →'}</span>
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Need staff credentials? Contact the AMPP Gujarat Chapter &amp; IIM Baroda Secretariat (<code>iim.barodachapter@gmail.com</code>).
            </div>
          </div>
        ) : (
          <>
            {/* 2. AUTHENTICATED STAFF STATUS HEADER */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base">{user?.fullName}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {user?.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllAdminData}
                  disabled={isLoadingData}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Refresh all datasets"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Toast feedback */}
            {toastMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
              </div>
            )}

            {/* 3. NAVIGATION TABS (ENTERPRISE MODULES WITH SEPARATE ABSTRACT & FULL PAPER APPROVALS) */}
            <div className="flex overflow-x-auto gap-1 p-1.5 bg-slate-200/70 rounded-2xl mb-8 scrollbar-none text-xs font-bold">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'delegates', label: `Delegates (${registrations.length})`, icon: Users },
                { id: 'abstracts', label: `Abstracts (${papers.length})`, icon: FileText },
                { id: 'fullpapers', label: `Full Papers (${papersWithFullPaper.length})`, icon: FileCheck },
                { id: 'booths', label: `Booths (${booths.length})`, icon: Store },
                { id: 'sponsorship', label: 'Sponsors & Souvenir', icon: Award },
                { id: 'finance', label: 'Finance & Billing', icon: DollarSign },
                { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
                { id: 'cms', label: 'Website CMS', icon: Edit3 },
                ...(isSuperAdmin ? [{ id: 'staff', label: `Staff (${staffUsers.length})`, icon: ShieldCheck }] : []),
                { id: 'audit', label: 'Audit Trail', icon: History }
              ].map(t => {
                const Icon = t.icon;
                const active = activeTab === t.id || (t.id === 'abstracts' && activeTab === 'papers');
                return (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id as any); setSearchTerm(''); }}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ============================================================== */}
            {/* MODULE 1: EXECUTIVE OVERVIEW (3.1) */}
            {/* ============================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Total Delegates</span>
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{totalDelegates}</div>
                    <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{confirmedDelegates} Confirmed &amp; Paid</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Verified Revenue</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-emerald-700">₹{verifiedRevenue.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-amber-600 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>₹{outstandingRevenue.toLocaleString('en-IN')} Pending Verification</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Papers / CFP</span>
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{totalPapers}</div>
                    <div className="text-xs text-purple-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{acceptedPapers} Accepted for Presentation</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Exhibition Space</span>
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{totalBoothsBooked} / 42</div>
                    <div className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <span>{42 - totalBoothsBooked} Stalls Available</span>
                    </div>
                  </div>
                </div>

                {/* 1. ALL SUBMITTED TECHNICAL PAPERS & AUTHORS (Executive Overview) */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <span>Submitted Technical Papers &amp; Author Directory</span>
                        </h3>
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          {papers.length} Papers Received
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        All abstracts submitted online through the live portal, synced with the cloud database.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={exportPapersCsv}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Papers CSV</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('abstracts')}
                        className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Abstract Approvals &rarr;</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('fullpapers')}
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Full Paper Approvals &rarr;</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Paper Code</th>
                          <th className="py-3 px-4">Primary Author</th>
                          <th className="py-3 px-4">Author Contact &amp; Org</th>
                          <th className="py-3 px-4">Paper Title &amp; Symposium</th>
                          <th className="py-3 px-4">Uploaded Documents (Abstract / Paper / PPT)</th>
                          <th className="py-3 px-4">Score</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Review Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {papers.map((p: any, idx) => {
                          const s = (p.status || '').toLowerCase();
                          const isAcc = s.includes('accept');
                          const isUnder = s.includes('under review');
                          const isRev = s.includes('revision');
                          const isRej = s.includes('reject');
                          return (
                            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-slate-900">
                                <span className="bg-slate-100 px-2 py-1 rounded text-[11px] font-bold text-slate-800">
                                  {p.paperCode || p.id}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-extrabold text-slate-900 text-xs">{p.fullName}</div>
                                <div className="text-[10px] text-slate-500 font-semibold">{p.presentationType || 'Oral'} Presentation</div>
                              </td>
                              <td className="py-3 px-4 max-w-xs">
                                <div className="text-[11px] font-bold text-slate-700 truncate">{p.email}</div>
                                <div className="text-[10px] text-slate-400">{p.mobileNumber}</div>
                                <div className="text-[10px] text-slate-500 truncate font-medium">{p.companyName}</div>
                              </td>
                              <td className="py-3 px-4 max-w-sm">
                                <div className="font-bold text-slate-900 line-clamp-1" title={p.paperTitle}>
                                  {p.paperTitle}
                                </div>
                                <div className="text-[10px] text-purple-700 font-semibold truncate">
                                  Track {p.symposiumId}: {p.symposiumTitle}
                                </div>
                              </td>
                              <td className="py-3 px-4 min-w-[240px]">
                                <div className="space-y-1.5 text-[10px]">
                                  {/* 1. ABSTRACT DOCUMENT */}
                                  <div className="flex items-center justify-between gap-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                      <span className="font-bold text-slate-800">Abstract:</span>
                                      {(p.abstractFileData || p.fileData) ? (
                                        <span className="text-slate-600 truncate max-w-[85px]" title={p.abstractFileName || p.fileName || 'Abstract.pdf'}>
                                          {p.abstractFileName || p.fileName || 'Abstract.pdf'}
                                        </span>
                                      ) : (
                                        <span className="text-amber-700 font-semibold italic">Missing</span>
                                      )}
                                    </div>
                                    {(p.abstractFileData || p.fileData) ? (
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => handleViewFile(p.abstractFileData || p.fileData, p.abstractFileName || 'Abstract.pdf')}
                                          className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
                                          title="View Abstract PDF"
                                        >
                                          <Eye className="w-2.5 h-2.5" />
                                          <span>View</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDownloadSingleFile(p.abstractFileData || p.fileData, p.abstractFileName || `${p.paperCode || p.id}_Abstract.pdf`)}
                                          className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
                                          title="Download Abstract"
                                        >
                                          <Download className="w-2.5 h-2.5" />
                                          <span>DL</span>
                                        </button>
                                      </div>
                                    ) : (
                                      <label className="px-1.5 py-0.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[9px] font-bold cursor-pointer flex items-center gap-0.5 shrink-0 shadow-2xs">
                                        <UploadCloud className="w-2.5 h-2.5 text-slate-500" />
                                        <span>Attach</span>
                                        <input
                                          type="file"
                                          accept=".pdf,.doc,.docx"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUploadPaperFile(p.paperCode || p.id, file, 'abstract');
                                          }}
                                        />
                                      </label>
                                    )}
                                  </div>

                                  {/* 2. FULL PAPER MANUSCRIPT */}
                                  <div className="flex items-center justify-between gap-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <FileCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                      <span className="font-bold text-slate-800">Paper:</span>
                                      {p.fullPaperFileData ? (
                                        <span className="text-slate-600 truncate max-w-[85px]" title={p.fullPaperFileName || 'Paper.pdf'}>
                                          {p.fullPaperFileName || 'Manuscript.pdf'}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 font-medium italic">Due 15 Dec</span>
                                      )}
                                    </div>
                                    {p.fullPaperFileData ? (
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => handleViewFile(p.fullPaperFileData, p.fullPaperFileName || 'FullPaper.pdf')}
                                          className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
                                          title="View Full Paper Manuscript"
                                        >
                                          <Eye className="w-2.5 h-2.5" />
                                          <span>View</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDownloadSingleFile(p.fullPaperFileData, p.fullPaperFileName || `${p.paperCode || p.id}_FullPaper.pdf`)}
                                          className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
                                          title="Download Full Paper"
                                        >
                                          <Download className="w-2.5 h-2.5" />
                                          <span>DL</span>
                                        </button>
                                      </div>
                                    ) : (
                                      <label className="px-1.5 py-0.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[9px] font-bold cursor-pointer flex items-center gap-0.5 shrink-0 shadow-2xs">
                                        <UploadCloud className="w-2.5 h-2.5 text-slate-500" />
                                        <span>Attach</span>
                                        <input
                                          type="file"
                                          accept=".pdf,.doc,.docx"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUploadPaperFile(p.paperCode || p.id, file, 'full_paper');
                                          }}
                                        />
                                      </label>
                                    )}
                                  </div>

                                  {/* 3. PRESENTATION SLIDES (PPT) */}
                                  <div className="flex items-center justify-between gap-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <Presentation className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                      <span className="font-bold text-slate-800">PPT:</span>
                                      {p.presentationFileData ? (
                                        <span className="text-slate-600 truncate max-w-[85px]" title={p.presentationFileName || 'Presentation.pptx'}>
                                          {p.presentationFileName || 'Slides.pptx'}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 font-medium italic">Due 25 Dec</span>
                                      )}
                                    </div>
                                    {p.presentationFileData ? (
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => handleViewFile(p.presentationFileData, p.presentationFileName || 'Presentation.pptx')}
                                          className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
                                          title="View Presentation"
                                        >
                                          <Eye className="w-2.5 h-2.5" />
                                          <span>View</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDownloadSingleFile(p.presentationFileData, p.presentationFileName || `${p.paperCode || p.id}_Presentation.pptx`)}
                                          className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
                                          title="Download Presentation"
                                        >
                                          <Download className="w-2.5 h-2.5" />
                                          <span>DL</span>
                                        </button>
                                      </div>
                                    ) : (
                                      <label className="px-1.5 py-0.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[9px] font-bold cursor-pointer flex items-center gap-0.5 shrink-0 shadow-2xs">
                                        <UploadCloud className="w-2.5 h-2.5 text-slate-500" />
                                        <span>Attach</span>
                                        <input
                                          type="file"
                                          accept=".ppt,.pptx,.pdf"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUploadPaperFile(p.paperCode || p.id, file, 'presentation');
                                          }}
                                        />
                                      </label>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-bold text-purple-700">
                                {p.reviewScore ? `${p.reviewScore}/10` : 'Pending'}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                  isAcc ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  isUnder ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                  isRev ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                                  isRej ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                  'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}>
                                  {p.status || 'Submitted'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  {/* Quick Approve Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleQuickPaperDecision(p.paperCode || p.id, 'Accepted for Oral Presentation')}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                      isAcc 
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                    title="Approve Paper for Presentation"
                                  >
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>{isAcc ? 'Approved' : 'Approve'}</span>
                                  </button>

                                  {/* Quick Under Review Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleQuickPaperDecision(p.paperCode || p.id, 'Under Review')}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                      isUnder
                                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                    }`}
                                    title="Mark paper as Under Review"
                                  >
                                    <Clock className="w-3 h-3 stroke-[2.5]" />
                                    <span>{isUnder ? 'In Review' : 'Under Review'}</span>
                                  </button>

                                  {/* Quick Reject Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleQuickPaperDecision(p.paperCode || p.id, 'Rejected')}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                      isRej
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                    }`}
                                    title="Reject Paper"
                                  >
                                    <X className="w-3 h-3 stroke-[3]" />
                                    <span>Reject</span>
                                  </button>

                                  {/* Score Modal Trigger */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedPaper(p);
                                      setScoreInput(p.reviewScore || 8.5);
                                      setCommentsInput(p.reviewComments || '');
                                      setPaperStatusInput(p.status || 'Accepted for Oral Presentation');
                                    }}
                                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                                    title="Score, add comments, and request changes for author"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>Review / Score</span>
                                  </button>

                                  {/* Delete Entry Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePaper(p.paperCode || p.id, p.paperTitle)}
                                    className="p-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                    title="Permanently remove this paper submission from the live database"
                                  >
                                    <Trash2 className="w-3 h-3 text-rose-600 shrink-0" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. ALL REGISTERED DELEGATES MANIFEST (Executive Overview) */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span>Registered Conference Delegates</span>
                        </h3>
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {registrations.length} Passes Issued
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        All conference attendees, institution delegates, and industry participants.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={exportDelegatesCsv}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Delegates CSV</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('delegates')}
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Full Manifest &rarr;</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Ticket ID</th>
                          <th className="py-3 px-4">Delegate Name</th>
                          <th className="py-3 px-4">Contact &amp; Org</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Tariff</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {registrations.map((reg, idx) => {
                          const isPaid = (reg.status || '').toLowerCase().includes('confirmed');
                          return (
                            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-slate-900">
                                <span className="bg-slate-100 px-2 py-1 rounded text-[11px] font-bold text-slate-800">
                                  {reg.ticketId || reg.id}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900">
                                {reg.fullName}
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-[11px] text-slate-600 truncate">{reg.email}</div>
                                <div className="text-[10px] text-slate-400 font-medium">{reg.organization}</div>
                              </td>
                              <td className="py-3 px-4 font-medium text-slate-700">{reg.category}</td>
                              <td className="py-3 px-4 font-extrabold text-slate-900">₹{(reg.totalAmount || 4720).toLocaleString('en-IN')}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                  isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {reg.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  {!isPaid ? (
                                    <button
                                      onClick={() => handleUpdateDelegateStatus(reg.ticketId || reg.id, 'Confirmed')}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer shadow-2xs"
                                    >
                                      Confirm Pass
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleUpdateDelegateStatus(reg.ticketId || reg.id, 'Pending')}
                                      className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-[10px] font-bold cursor-pointer"
                                    >
                                      Hold Pass
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRegistration(reg.ticketId || reg.id, reg.fullName)}
                                    className="p-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                    title="Permanently delete delegate registration from database"
                                  >
                                    <Trash2 className="w-3 h-3 text-rose-600 shrink-0" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Categories & Symposia breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-600" />
                      <span>Registration Categories Breakdown</span>
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'IIM / AMPP Member', count: registrations.filter(r => (r.category || '').includes('Member')).length, price: '₹4,720' },
                        { name: 'Non-Member Delegate', count: registrations.filter(r => (r.category || '').includes('Non-Member')).length, price: '₹7,670' },
                        { name: 'Student Delegate', count: registrations.filter(r => (r.category || '').includes('Student')).length, price: '₹1,770' }
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{c.name}</span>
                            <span className="text-slate-400 block text-[11px]">Tariff with 18% GST: {c.price}</span>
                          </div>
                          <span className="font-extrabold text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-xl">
                            {c.count} Registered
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <History className="w-4 h-4 text-blue-600" />
                      <span>Recent Administrative Actions</span>
                    </h3>
                    <div className="space-y-2">
                      {auditLogs.slice(0, 5).map((log, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900">{log.action}</span>
                            <span className="text-[10px] text-slate-400">{log.createdAt?.split('T')[0]}</span>
                          </div>
                          <div className="text-slate-600 text-[11px] truncate">{log.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 2: DELEGATES & REGISTRATIONS (3.3) */}
            {/* ============================================================== */}
            {activeTab === 'delegates' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search delegate, email, pass ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportDelegatesCsv}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Ticket ID</th>
                        <th className="py-3 px-4">Delegate Name</th>
                        <th className="py-3 px-4">Organization</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDelegates.map((reg, idx) => {
                        const isPaid = (reg.status || '').toLowerCase().includes('confirmed');
                        return (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">{reg.ticketId || reg.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{reg.fullName}</div>
                              <div className="text-[11px] text-slate-400">{reg.email}</div>
                            </td>
                            <td className="py-3 px-4 font-medium">{reg.organization}</td>
                            <td className="py-3 px-4 font-medium">{reg.category}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">₹{(reg.totalAmount || 4720).toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              {!isPaid ? (
                                <button
                                  onClick={() => handleUpdateDelegateStatus(reg.ticketId || reg.id, 'Confirmed')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Confirm Pass
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateDelegateStatus(reg.ticketId || reg.id, 'Pending')}
                                  className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Hold Pass
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 3A: ABSTRACT SUBMISSIONS & SCREENING APPROVALS */}
            {/* ============================================================== */}
            {(activeTab === 'abstracts' || activeTab === 'papers') && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-6 p-6 animate-in fade-in">
                {/* Header Switcher & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('abstracts'); setStatusFilter('all'); setSearchTerm(''); }}
                        className="px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 bg-white text-purple-800 shadow-xs cursor-pointer transition-all"
                      >
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span>1. Abstract Approvals ({papers.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('fullpapers'); setStatusFilter('all'); setSearchTerm(''); }}
                        className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 cursor-pointer transition-all"
                      >
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span>2. Full Paper Approvals ({papersWithFullPaper.length})</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportPapersCsv}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Abstracts CSV</span>
                    </button>
                  </div>
                </div>

                {/* 4 Summary Stat Cards for Abstracts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">Total Received</div>
                    <div className="text-2xl font-black text-purple-900">{papers.length}</div>
                    <div className="text-[10px] text-purple-700 font-semibold">Abstracts submitted</div>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Oral Accepted</div>
                    <div className="text-2xl font-black text-emerald-900">
                      {papers.filter(p => (p.status || '').toLowerCase().includes('oral')).length}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Accepted for Oral Presentation</div>
                  </div>
                  <div className="bg-teal-50/60 border border-teal-200 p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-teal-700 tracking-wider">Poster Accepted</div>
                    <div className="text-2xl font-black text-teal-900">
                      {papers.filter(p => (p.status || '').toLowerCase().includes('poster')).length}
                    </div>
                    <div className="text-[10px] text-teal-700 font-semibold">Accepted for Poster Session</div>
                  </div>
                  <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Under Review</div>
                    <div className="text-2xl font-black text-blue-900">
                      {papers.filter(p => (p.status || '').toLowerCase().includes('under review') || (p.status || '').toLowerCase() === 'submitted').length}
                    </div>
                    <div className="text-[10px] text-blue-700 font-semibold">Awaiting Committee Evaluation</div>
                  </div>
                </div>

                {/* Search & Status Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative flex-1 w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search abstract title, author, track, code..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold w-full sm:w-auto"
                  >
                    <option value="all">All Abstract Statuses</option>
                    <option value="submitted">Submitted (Awaiting Review)</option>
                    <option value="under review">Under Review</option>
                    <option value="oral">Accepted for Oral Presentation</option>
                    <option value="poster">Accepted for Poster Presentation</option>
                    <option value="revision">Revision Required</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Abstract Approvals Table */}
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Paper Code</th>
                        <th className="py-3 px-4">Primary Author</th>
                        <th className="py-3 px-4">Symposium &amp; Title</th>
                        <th className="py-3 px-4">Abstract Screening</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Abstract Status</th>
                        <th className="py-3 px-4 text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAbstracts.map((p: any, idx) => {
                        const s = (p.status || '').toLowerCase();
                        const isAcc = s.includes('accept');
                        const isOral = s.includes('oral');
                        const isPoster = s.includes('poster');
                        const isUnder = s.includes('under review');
                        const isRev = s.includes('revision');
                        const isRej = s.includes('reject');

                        return (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              <span className="bg-slate-100 px-2 py-1 rounded text-[11px] font-bold text-slate-800">
                                {p.paperCode || p.id}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-extrabold text-slate-900">{p.fullName}</div>
                              <div className="text-[10px] text-slate-400">{p.email}</div>
                              <div className="text-[10px] text-slate-500 font-medium">{p.companyName}</div>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <div className="font-bold text-slate-900 line-clamp-1" title={p.paperTitle}>
                                {p.paperTitle}
                              </div>
                              <div className="text-[10px] text-purple-700 font-semibold truncate">
                                Track {p.symposiumId}: {p.symposiumTitle}
                              </div>
                            </td>
                            <td className="py-3 px-4 min-w-[210px]">
                              <div className="space-y-1.5">
                                {/* Text Preview Drawer Button */}
                                <button
                                  type="button"
                                  onClick={() => setAbstractTextModalPaper(p)}
                                  className="w-full px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-[10px] font-bold flex items-center justify-between gap-1 cursor-pointer shadow-2xs"
                                  title="Read full submitted abstract text"
                                >
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3 text-purple-600" />
                                    <span>Read Abstract Text</span>
                                  </span>
                                  <span className="text-[9px] text-purple-600 font-mono">
                                    {p.abstract ? `${p.abstract.split(/\s+/).filter(Boolean).length}w` : 'Preview'} &rarr;
                                  </span>
                                </button>

                                {/* Abstract PDF attachment actions */}
                                <div className="flex items-center justify-between gap-1 p-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px]">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <span className="font-bold text-slate-700">PDF:</span>
                                    {(p.abstractFileData || p.fileData) ? (
                                      <span className="text-slate-600 truncate max-w-[80px]" title={p.abstractFileName || p.fileName || 'Abstract.pdf'}>
                                        {p.abstractFileName || p.fileName || 'Abstract.pdf'}
                                      </span>
                                    ) : (
                                      <span className="text-amber-700 italic">None</span>
                                    )}
                                  </div>
                                  {(p.abstractFileData || p.fileData) ? (
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleViewFile(p.abstractFileData || p.fileData, p.abstractFileName || 'Abstract.pdf')}
                                        className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                                        title="View Abstract PDF"
                                      >
                                        <Eye className="w-2.5 h-2.5" />
                                        <span>View</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadSingleFile(p.abstractFileData || p.fileData, p.abstractFileName || `${p.paperCode || p.id}_Abstract.pdf`)}
                                        className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                                        title="Download Abstract"
                                      >
                                        <Download className="w-2.5 h-2.5" />
                                        <span>DL</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="px-1.5 py-0.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[9px] font-bold cursor-pointer flex items-center gap-0.5 shrink-0">
                                      <UploadCloud className="w-2.5 h-2.5 text-slate-500" />
                                      <span>Attach</span>
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={e => {
                                          const file = e.target.files?.[0];
                                          if (file) handleUploadPaperFile(p.paperCode || p.id, file, 'abstract');
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-purple-700">
                              {p.reviewScore ? `${p.reviewScore}/10` : 'Pending'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                isOral ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' :
                                isPoster ? 'bg-teal-50 text-teal-800 border border-teal-300' :
                                isAcc ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                isUnder ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                isRev ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                                isRej ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {p.status || 'Submitted'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {/* Quick Approve Oral Button */}
                                <button
                                  type="button"
                                  onClick={() => handleQuickAbstractDecision(p.paperCode || p.id, 'Accepted for Oral Presentation')}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                    isOral 
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  }`}
                                  title="Approve for Oral Presentation"
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>{isOral ? 'Oral Approved' : 'Oral'}</span>
                                </button>

                                {/* Quick Approve Poster Button */}
                                <button
                                  type="button"
                                  onClick={() => handleQuickAbstractDecision(p.paperCode || p.id, 'Accepted for Poster Presentation')}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                    isPoster 
                                      ? 'bg-teal-100 text-teal-800 border border-teal-300' 
                                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                                  }`}
                                  title="Approve for Poster Presentation"
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>{isPoster ? 'Poster Approved' : 'Poster'}</span>
                                </button>

                                {/* Quick Under Review Button */}
                                <button
                                  type="button"
                                  onClick={() => handleQuickAbstractDecision(p.paperCode || p.id, 'Under Review')}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                    isUnder
                                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                  }`}
                                  title="Mark as Under Review"
                                >
                                  <Clock className="w-3 h-3 stroke-[2.5]" />
                                  <span>{isUnder ? 'In Review' : 'Review'}</span>
                                </button>

                                {/* Quick Reject Button */}
                                <button
                                  type="button"
                                  onClick={() => handleQuickAbstractDecision(p.paperCode || p.id, 'Rejected')}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                    isRej
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                  }`}
                                  title="Reject Abstract"
                                >
                                  <X className="w-3 h-3 stroke-[3]" />
                                  <span>Reject</span>
                                </button>

                                {/* Score Modal Trigger */}
                                <button
                                  type="button"
                                  onClick={() => openReviewModal(p, 'abstract')}
                                  className="px-2.5 py-1 bg-purple-900 hover:bg-purple-800 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                                  title="Score, add comments, and request changes for author"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Score / Review</span>
                                </button>

                                {/* Delete Entry Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeletePaper(p.paperCode || p.id, p.paperTitle)}
                                  className="p-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                  title="Permanently remove this paper submission"
                                >
                                  <Trash2 className="w-3 h-3 text-rose-600 shrink-0" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 3B: FULL PAPER MANUSCRIPTS & PROCEEDINGS APPROVALS */}
            {/* ============================================================== */}
            {activeTab === 'fullpapers' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-6 p-6 animate-in fade-in">
                {/* Header Switcher & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('abstracts'); setStatusFilter('all'); setSearchTerm(''); }}
                        className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 cursor-pointer transition-all"
                      >
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span>1. Abstract Approvals ({papers.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('fullpapers'); setStatusFilter('all'); setSearchTerm(''); }}
                        className="px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 bg-white text-blue-800 shadow-xs cursor-pointer transition-all"
                      >
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span>2. Full Paper Approvals ({papersWithFullPaper.length})</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportFullPapersCsv}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Full Papers CSV</span>
                    </button>
                  </div>
                </div>

                {/* 4 Summary Stat Cards for Full Papers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Manuscripts Received</div>
                    <div className="text-2xl font-black text-blue-900">{papersWithFullPaper.length}</div>
                    <div className="text-[10px] text-blue-700 font-semibold">Camera-ready uploaded</div>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Proceedings Approved</div>
                    <div className="text-2xl font-black text-emerald-900">{acceptedFullPapers}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Accepted for ISBN publication</div>
                  </div>
                  <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">Revisions Requested</div>
                    <div className="text-2xl font-black text-amber-900">
                      {papers.filter(p => (p.fullPaperStatus || '').toLowerCase().includes('revision')).length}
                    </div>
                    <div className="text-[10px] text-amber-800 font-semibold">Changes needed by author</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-slate-600 tracking-wider">Awaiting Manuscript</div>
                    <div className="text-2xl font-black text-slate-800">
                      {Math.max(0, papers.length - papersWithFullPaper.length)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold">Due 15 Dec 2026</div>
                  </div>
                </div>

                {/* Search & Status Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative flex-1 w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search full paper title, author, code..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold w-full sm:w-auto"
                  >
                    <option value="all">All Full Papers</option>
                    <option value="uploaded">Uploaded Manuscripts Only</option>
                    <option value="accepted for proceedings">Accepted for Proceedings</option>
                    <option value="under review">Under Review</option>
                    <option value="revision">Revision Required</option>
                    <option value="missing">Awaiting Upload (Missing)</option>
                  </select>
                </div>

                {/* Full Papers Approvals Table */}
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Paper Code</th>
                        <th className="py-3 px-4">Author &amp; Org</th>
                        <th className="py-3 px-4">Paper Title &amp; Symposium</th>
                        <th className="py-3 px-4">Abstract Status</th>
                        <th className="py-3 px-4">Full Paper Manuscript</th>
                        <th className="py-3 px-4">Oral Slides (PPT)</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Proceedings Status</th>
                        <th className="py-3 px-4 text-right">Editorial Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFullPapers.map((p: any, idx) => {
                        const fpStatus = (p.fullPaperStatus || (p.fullPaperFileData ? 'Submitted' : 'Pending Submission')).toLowerCase();
                        const isFpAccepted = fpStatus.includes('proceeding') || fpStatus.includes('accept');
                        const isFpUnder = fpStatus.includes('under review');
                        const isFpRev = fpStatus.includes('revision');
                        const isFpRej = fpStatus.includes('reject');
                        const hasFullPaper = !!(p.fullPaperFileData || p.fullPaperFileName);

                        return (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              <span className="bg-slate-100 px-2 py-1 rounded text-[11px] font-bold text-slate-800">
                                {p.paperCode || p.id}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-extrabold text-slate-900">{p.fullName}</div>
                              <div className="text-[10px] text-slate-400">{p.email}</div>
                              <div className="text-[10px] text-slate-500 font-medium">{p.companyName}</div>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <div className="font-bold text-slate-900 line-clamp-1" title={p.paperTitle}>
                                {p.paperTitle}
                              </div>
                              <div className="text-[10px] text-blue-700 font-semibold truncate">
                                Track {p.symposiumId}: {p.symposiumTitle}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                {p.status || 'Submitted'}
                              </span>
                            </td>
                            <td className="py-3 px-4 min-w-[210px]">
                              {/* 1. FULL PAPER MANUSCRIPT */}
                              <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <FileCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    {hasFullPaper ? (
                                      <span className="font-bold text-slate-800 truncate max-w-[110px]" title={p.fullPaperFileName || 'Manuscript.pdf'}>
                                        {p.fullPaperFileName || 'Manuscript.pdf'}
                                      </span>
                                    ) : (
                                      <span className="text-amber-800 font-semibold italic text-[10px]">Due 15 Dec 2026</span>
                                    )}
                                  </div>
                                  <label className="text-[9px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer underline shrink-0">
                                    <span>{hasFullPaper ? 'Replace' : 'Attach'}</span>
                                    <input
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      className="hidden"
                                      onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadPaperFile(p.paperCode || p.id, file, 'full_paper');
                                      }}
                                    />
                                  </label>
                                </div>

                                {hasFullPaper && (
                                  <div className="flex items-center gap-1 pt-0.5">
                                    <button
                                      type="button"
                                      onClick={() => handleViewFile(p.fullPaperFileData, p.fullPaperFileName || 'FullPaper.pdf')}
                                      className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Eye className="w-2.5 h-2.5" />
                                      <span>View Manuscript</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadSingleFile(p.fullPaperFileData, p.fullPaperFileName || `${p.paperCode || p.id}_FullPaper.pdf`)}
                                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Download className="w-2.5 h-2.5" />
                                      <span>Download</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 min-w-[170px]">
                              {/* 2. PRESENTATION SLIDES (PPT) */}
                              <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <Presentation className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                    {p.presentationFileData ? (
                                      <span className="font-bold text-slate-800 truncate max-w-[90px]" title={p.presentationFileName || 'Slides.pptx'}>
                                        {p.presentationFileName || 'Slides.pptx'}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 italic text-[10px]">Due 25 Dec</span>
                                    )}
                                  </div>
                                  <label className="text-[9px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer underline shrink-0">
                                    <span>{p.presentationFileData ? 'Replace' : 'Attach'}</span>
                                    <input
                                      type="file"
                                      accept=".ppt,.pptx,.pdf"
                                      className="hidden"
                                      onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadPaperFile(p.paperCode || p.id, file, 'presentation');
                                      }}
                                    />
                                  </label>
                                </div>

                                {p.presentationFileData && (
                                  <div className="flex items-center gap-1 pt-0.5">
                                    <button
                                      type="button"
                                      onClick={() => handleViewFile(p.presentationFileData, p.presentationFileName || 'Presentation.pptx')}
                                      className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Eye className="w-2.5 h-2.5" />
                                      <span>View PPT</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadSingleFile(p.presentationFileData, p.presentationFileName || `${p.paperCode || p.id}_Presentation.pptx`)}
                                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Download className="w-2.5 h-2.5" />
                                      <span>DL</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-blue-700">
                              {p.fullPaperScore ? `${p.fullPaperScore}/10` : 'Pending'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                isFpAccepted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                isFpUnder ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                isFpRev ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                                isFpRej ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                hasFullPaper ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}>
                                {p.fullPaperStatus || (hasFullPaper ? 'Submitted' : 'Awaiting Upload')}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {/* Quick Approve for Proceedings Button */}
                                <button
                                  type="button"
                                  onClick={() => handleQuickFullPaperDecision(p.paperCode || p.id, 'Accepted for Proceedings')}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                    isFpAccepted 
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  }`}
                                  title="Approve camera-ready manuscript for ISBN Proceedings"
                                >
                                  <BookOpen className="w-3 h-3 stroke-[2.5]" />
                                  <span>{isFpAccepted ? 'Proceedings Approved' : 'Approve Proceedings'}</span>
                                </button>

                                {/* Quick Under Review Button */}
                                <button
                                  type="button"
                                  onClick={() => handleQuickFullPaperDecision(p.paperCode || p.id, 'Under Review')}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                    isFpUnder
                                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                  }`}
                                  title="Mark Full Paper as Under Technical Review"
                                >
                                  <Clock className="w-3 h-3 stroke-[2.5]" />
                                  <span>{isFpUnder ? 'In Review' : 'Review'}</span>
                                </button>

                                {/* Quick Request Revision Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    openReviewModal(p, 'full_paper');
                                    setPaperStatusInput('Revision Required');
                                  }}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                    isFpRev
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}
                                  title="Request Manuscript Revision"
                                >
                                  <AlertCircle className="w-3 h-3 stroke-[2.5]" />
                                  <span>Revision</span>
                                </button>

                                {/* Quick Reject Button */}
                                <button
                                  type="button"
                                  onClick={() => handleQuickFullPaperDecision(p.paperCode || p.id, 'Rejected')}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                                    isFpRej
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                  }`}
                                  title="Reject Full Paper Manuscript"
                                >
                                  <X className="w-3 h-3 stroke-[3]" />
                                  <span>Reject</span>
                                </button>

                                {/* Review / Score Modal Trigger */}
                                <button
                                  type="button"
                                  onClick={() => openReviewModal(p, 'full_paper')}
                                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                                  title="Score full manuscript, record committee evaluation, and give feedback"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Score / Review</span>
                                </button>

                                {/* Delete Entry Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeletePaper(p.paperCode || p.id, p.paperTitle)}
                                  className="p-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                  title="Permanently remove paper from database"
                                >
                                  <Trash2 className="w-3 h-3 text-rose-600 shrink-0" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DEDICATED ABSTRACT TEXT READING MODAL */}
            {abstractTextModalPaper && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg">
                        {abstractTextModalPaper.paperCode || abstractTextModalPaper.id}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Track {abstractTextModalPaper.symposiumId}: {abstractTextModalPaper.symposiumTitle}
                      </span>
                    </div>
                    <button
                      onClick={() => setAbstractTextModalPaper(null)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-black text-slate-900">
                      {abstractTextModalPaper.paperTitle}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div><strong>Author:</strong> {abstractTextModalPaper.fullName}</div>
                      <div>•</div>
                      <div><strong>Org:</strong> {abstractTextModalPaper.companyName}</div>
                      <div>•</div>
                      <div><strong>Email:</strong> {abstractTextModalPaper.email}</div>
                      <div>•</div>
                      <div><strong>Format:</strong> {abstractTextModalPaper.presentationType || 'Oral'}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                        <span>Submitted Abstract Text</span>
                        <span className="text-purple-700 font-mono">
                          {abstractTextModalPaper.abstract ? abstractTextModalPaper.abstract.split(/\s+/).filter(Boolean).length : 0} words
                        </span>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap max-h-72 overflow-y-auto">
                        {abstractTextModalPaper.abstract || 'No abstract text entered.'}
                      </div>
                    </div>

                    {abstractTextModalPaper.keywords && (
                      <div className="text-xs text-slate-600">
                        <strong className="text-slate-800">Keywords: </strong> {abstractTextModalPaper.keywords}
                      </div>
                    )}

                    {abstractTextModalPaper.coAuthors && (
                      <div className="text-xs text-slate-600">
                        <strong className="text-slate-800">Co-Authors: </strong> {abstractTextModalPaper.coAuthors}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const p = abstractTextModalPaper;
                          setAbstractTextModalPaper(null);
                          openReviewModal(p, 'abstract');
                        }}
                        className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Score &amp; Review Abstract</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAbstractTextModalPaper(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC REVIEW EVALUATION MODAL (Abstract Review vs Full Paper Manuscript Review) */}
            {selectedPaper && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${reviewModalType === 'full_paper' ? 'bg-blue-600' : 'bg-purple-600'}`} />
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {reviewModalType === 'full_paper' ? 'Full Paper Manuscript Review' : 'Abstract Screening & Review'}: {selectedPaper.paperCode || selectedPaper.id}
                      </h4>
                    </div>
                    <button onClick={() => setSelectedPaper(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mode Selector Tabs inside Modal */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setReviewModalType('abstract');
                        setScoreInput(selectedPaper.reviewScore || 8.5);
                        setCommentsInput(selectedPaper.reviewComments || '');
                        setPaperStatusInput(selectedPaper.status || 'Accepted for Oral Presentation');
                      }}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        reviewModalType === 'abstract' ? 'bg-white text-purple-800 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Abstract Decision</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReviewModalType('full_paper');
                        setScoreInput(selectedPaper.fullPaperScore || 8.5);
                        setCommentsInput(selectedPaper.fullPaperReviewComments || '');
                        setPaperStatusInput(selectedPaper.fullPaperStatus || 'Accepted for Proceedings');
                      }}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        reviewModalType === 'full_paper' ? 'bg-white text-blue-800 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Full Paper Decision</span>
                    </button>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-200">
                    <div className="font-bold text-slate-900 line-clamp-1">{selectedPaper.paperTitle}</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Author: <span className="font-bold text-slate-700">{selectedPaper.fullName}</span> ({selectedPaper.companyName})
                    </div>
                    <div className="text-[10px] text-purple-700 font-bold">
                      Symposium Track {selectedPaper.symposiumId}: {selectedPaper.symposiumTitle}
                    </div>

                    {/* Review context documents */}
                    {reviewModalType === 'full_paper' ? (
                      <div className="mt-2 space-y-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between p-2 bg-blue-50/80 border border-blue-200 rounded-xl">
                          <div className="flex items-center gap-1.5 text-xs text-blue-900 font-bold truncate">
                            <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="truncate">{selectedPaper.fullPaperFileName || 'Camera-ready Manuscript'}</span>
                          </div>
                          {selectedPaper.fullPaperFileData ? (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleViewFile(selectedPaper.fullPaperFileData, selectedPaper.fullPaperFileName || 'FullPaper.pdf')}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View PDF</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadSingleFile(selectedPaper.fullPaperFileData, selectedPaper.fullPaperFileName || `${selectedPaper.paperCode || selectedPaper.id}_FullPaper.pdf`)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3 h-3" />
                                <span>DL</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-amber-800 font-semibold italic">Not uploaded yet (Due 15 Dec)</span>
                          )}
                        </div>

                        {selectedPaper.presentationFileData && (
                          <div className="flex items-center justify-between p-2 bg-purple-50/80 border border-purple-200 rounded-xl">
                            <div className="flex items-center gap-1.5 text-xs text-purple-900 font-bold truncate">
                              <Presentation className="w-4 h-4 text-purple-600 shrink-0" />
                              <span className="truncate">{selectedPaper.presentationFileName || 'Presentation Slides'}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleViewFile(selectedPaper.presentationFileData, selectedPaper.presentationFileName || 'Presentation.pptx')}
                                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View PPT</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadSingleFile(selectedPaper.presentationFileData, selectedPaper.presentationFileName || `${selectedPaper.paperCode || selectedPaper.id}_Presentation.pptx`)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3 h-3" />
                                <span>DL</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2 pt-2 border-t border-slate-200">
                        <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                          {selectedPaper.abstract || 'No abstract text entered.'}
                        </p>
                        {(selectedPaper.abstractFileData || selectedPaper.fileData) && (
                          <div className="flex items-center justify-between p-2 bg-purple-50/80 border border-purple-200 rounded-xl">
                            <div className="flex items-center gap-1.5 text-xs text-purple-900 font-bold truncate">
                              <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                              <span className="truncate">{selectedPaper.abstractFileName || selectedPaper.fileName || 'Abstract PDF'}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleViewFile(selectedPaper.abstractFileData || selectedPaper.fileData, selectedPaper.abstractFileName || 'Abstract.pdf')}
                                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View PDF</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadSingleFile(selectedPaper.abstractFileData || selectedPaper.fileData, selectedPaper.abstractFileName || `${selectedPaper.paperCode || selectedPaper.id}_Abstract.pdf`)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3 h-3" />
                                <span>DL</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {reviewModalType === 'full_paper' ? 'Technical Evaluation Score (0.0 to 10.0)' : 'Abstract Peer Review Score (0.0 to 10.0)'}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={scoreInput}
                        onChange={e => setScoreInput(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {reviewModalType === 'full_paper' ? 'Proceedings Editorial Decision' : 'Abstract Editorial Decision'}
                      </label>
                      <select
                        value={paperStatusInput}
                        onChange={e => setPaperStatusInput(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-bold"
                      >
                        {reviewModalType === 'full_paper' ? (
                          <>
                            <option value="Submitted">Submitted (Awaiting Technical Review)</option>
                            <option value="Under Review">Under Review (Technical Committee)</option>
                            <option value="Accepted for Proceedings">Accepted for Proceedings (ISBN Publication)</option>
                            <option value="Revision Required">Revision Required (Camera-Ready Changes)</option>
                            <option value="Rejected">Rejected</option>
                          </>
                        ) : (
                          <>
                            <option value="Submitted">Submitted (Awaiting Review)</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Accepted for Oral Presentation">Accepted for Oral Presentation</option>
                            <option value="Accepted for Poster Presentation">Accepted for Poster Presentation</option>
                            <option value="Revision Required">Revision Required (Changes Needed)</option>
                            <option value="Rejected">Rejected</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {reviewModalType === 'full_paper' 
                          ? 'Technical Committee Feedback on Manuscript (Shown to Author)' 
                          : 'Abstract Review Comments & Instructions (Shown to Author)'}
                      </label>
                      <textarea
                        rows={4}
                        value={commentsInput}
                        onChange={e => setCommentsInput(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-medium"
                        placeholder={reviewModalType === 'full_paper' 
                          ? 'Enter technical manuscript feedback, formatting corrections, or publication approval comments for the author...' 
                          : 'Enter feedback or required revisions for the author. This will be displayed live on the author portal...'}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {reviewModalType === 'full_paper' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              handleQuickFullPaperDecision(selectedPaper.paperCode || selectedPaper.id, 'Accepted for Proceedings');
                              setSelectedPaper(null);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Approve Proceedings</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleQuickFullPaperDecision(selectedPaper.paperCode || selectedPaper.id, 'Under Review');
                              setSelectedPaper(null);
                            }}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Mark In Review</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              handleQuickAbstractDecision(selectedPaper.paperCode || selectedPaper.id, 'Accepted for Oral Presentation');
                              setSelectedPaper(null);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Approve Oral</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleQuickAbstractDecision(selectedPaper.paperCode || selectedPaper.id, 'Accepted for Poster Presentation');
                              setSelectedPaper(null);
                            }}
                            className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Approve Poster</span>
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedPaper(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">
                        Cancel
                      </button>
                      <button onClick={handleSavePaperReview} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Save &amp; Update Author</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 4: EXHIBITION BOOTHS (3.5) */}
            {/* ============================================================== */}
            {activeTab === 'booths' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Exhibition Floor Plan (42 Stalls)</h3>
                    <p className="text-xs text-slate-500">Official GUJCORR Expo layout in Vadodara: 12 sqm &amp; 9 sqm stalls.</p>
                  </div>
                  <div className="text-xs font-bold text-emerald-600">
                    {totalBoothsBooked} Occupied / {42 - totalBoothsBooked} Open
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                  {filteredBooths.map((b, idx) => {
                    const isOcc = b.status === 'Confirmed' || b.status === 'Reserved';
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedBooth(b);
                          setBoothCompanyInput(b.companyName || '');
                          setBoothContactInput(b.contactPerson || '');
                          setBoothEmailInput(b.email || '');
                          setBoothMobileInput(b.mobileNumber || '');
                          setBoothStatusInput(b.status || 'Confirmed');
                        }}
                        className={`p-3 rounded-2xl border text-center cursor-pointer transition-all hover:scale-102 ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : b.status === 'Reserved'
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="font-black text-sm">{b.boothNumber}</div>
                        <div className="text-[10px] font-bold text-slate-500">{b.boothSize}</div>
                        <div className="text-[10px] font-extrabold mt-1 truncate">
                          {b.companyName ? b.companyName : 'Available'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Booth Modal */}
                {selectedBooth && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="font-extrabold text-slate-900 text-sm">Booth #{selectedBooth.boothNumber} Allocation</h4>
                        <button onClick={() => setSelectedBooth(null)}><X className="w-5 h-5 text-slate-400" /></button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Company / Exhibitor Name</label>
                          <input
                            type="text"
                            value={boothCompanyInput}
                            onChange={e => setBoothCompanyInput(e.target.value)}
                            placeholder="e.g. CorroServe Technologies"
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                          <input
                            type="text"
                            value={boothContactInput}
                            onChange={e => setBoothContactInput(e.target.value)}
                            placeholder="e.g. Deepak Merchant"
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                            <input
                              type="email"
                              value={boothEmailInput}
                              onChange={e => setBoothEmailInput(e.target.value)}
                              className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile</label>
                            <input
                              type="text"
                              value={boothMobileInput}
                              onChange={e => setBoothMobileInput(e.target.value)}
                              className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                          <select
                            value={boothStatusInput}
                            onChange={e => setBoothStatusInput(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-bold"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Available">Available (Release)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <button onClick={() => setSelectedBooth(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                        <button onClick={handleSaveBoothAllocation} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Commit Allocation</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 5: SPONSORSHIP & SOUVENIR (3.6) */}
            {/* ============================================================== */}
            {activeTab === 'sponsorship' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { tier: 'Diamond Sponsor', rate: '₹5,00,000 + GST', delegates: '5 Delegates', stall: '12 sqm Stall', color: 'border-blue-300 bg-blue-50/50' },
                    { tier: 'Gold Sponsor', rate: '₹3,00,000 + GST', delegates: '3 Delegates', stall: '9 sqm Stall', color: 'border-amber-300 bg-amber-50/50' },
                    { tier: 'Silver Sponsor', rate: '₹2,00,000 + GST', delegates: '2 Delegates', stall: '6 sqm Stall', color: 'border-slate-300 bg-slate-50' }
                  ].map((p, i) => (
                    <div key={i} className={`p-6 rounded-3xl border ${p.color} space-y-3`}>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white border">{p.tier}</span>
                      <div className="text-2xl font-black text-slate-900">{p.rate}</div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div>&bull; {p.delegates} included</div>
                        <div>&bull; {p.stall} included</div>
                        <div>&bull; Full-page souvenir advertisement</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-sm">Conference Souvenir Advertising Tariff</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="font-bold text-slate-500">Back Cover</div>
                      <div className="text-lg font-black text-slate-900">₹45,000</div>
                      <div className="text-[11px] text-slate-400">+18% GST</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="font-bold text-slate-500">Inside Covers</div>
                      <div className="text-lg font-black text-slate-900">₹30,000</div>
                      <div className="text-[11px] text-slate-400">+18% GST</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="font-bold text-slate-500">Full Page Special</div>
                      <div className="text-lg font-black text-slate-900">₹20,000</div>
                      <div className="text-[11px] text-slate-400">+18% GST</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="font-bold text-slate-500">Half Page Regular</div>
                      <div className="text-lg font-black text-slate-900">₹10,000</div>
                      <div className="text-[11px] text-slate-400">+18% GST</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 6: FINANCE & BILLING (3.7) */}
            {/* ============================================================== */}
            {activeTab === 'finance' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Financial Reconciliation &amp; Tax Invoices</h3>
                    <p className="text-xs text-slate-500">SAC Code: 998397 &bull; Applicable GST Rate: 18% (9% CGST + 9% SGST)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Verified Collections</span>
                    <div className="text-2xl font-black text-emerald-700">₹{verifiedRevenue.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Confirmed NEFT/UPI passes</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">18% GST Component</span>
                    <div className="text-2xl font-black text-blue-700">₹{Math.round(verifiedRevenue * 18 / 118).toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-500 mt-1">CGST 9% + SGST 9%</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Outstanding Invoices</span>
                    <div className="text-2xl font-black text-amber-700">₹{outstandingRevenue.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Pending receipt verification</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 border">
                  <div className="font-bold text-slate-900">Official Conference Bank Account:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                    <div>Bank: <strong>Union Bank of India</strong> (Dandia Bazar Branch, Vadodara)</div>
                    <div>Account Name: <strong>The Indian Institute of Metals Baroda Chapter</strong></div>
                    <div>Account Number: <strong>520101234030441</strong></div>
                    <div>IFSC Code: <strong>UBIN0901555</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 7: INQUIRIES & COMMUNICATIONS (3.8) */}
            {/* ============================================================== */}
            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">Delegate &amp; Sponsor Inquiries Inbox</h3>
                  <div className="text-xs text-slate-500">{unreadInquiries} Unread inquiries</div>
                </div>

                <div className="space-y-3">
                  {filteredInquiries.map((inq, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-white transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{inq.name}</span>
                          <span className="text-slate-400">({inq.organization || inq.email})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          inq.status === 'Unread' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800">{inq.subject}</div>
                      <p className="text-slate-600">{inq.message}</p>
                      
                      {inq.internalNotes && (
                        <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                          <strong>Internal Staff Note:</strong> {inq.internalNotes}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setInquiryStatusInput(inq.status);
                            setInquiryNotesInput(inq.internalNotes || '');
                            setInquiryAssignInput(inq.assignedTo || 'Secretariat Staff');
                          }}
                          className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Update / Note
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inquiry Modal */}
                {selectedInquiry && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="font-extrabold text-slate-900 text-sm">Inquiry Resolution</h4>
                        <button onClick={() => setSelectedInquiry(null)}><X className="w-5 h-5 text-slate-400" /></button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                          <select
                            value={inquiryStatusInput}
                            onChange={e => setInquiryStatusInput(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-bold"
                          >
                            <option value="Unread">Unread</option>
                            <option value="Read">Read</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Assign Staff</label>
                          <select
                            value={inquiryAssignInput}
                            onChange={e => setInquiryAssignInput(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          >
                            <option value="Secretariat Staff">Secretariat Staff</option>
                            <option value="Paper Coordinator">Paper Coordinator</option>
                            <option value="Finance Staff">Finance Staff</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Private Internal Notes</label>
                          <textarea
                            rows={3}
                            value={inquiryNotesInput}
                            onChange={e => setInquiryNotesInput(e.target.value)}
                            placeholder="Add internal action notes..."
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <button onClick={() => setSelectedInquiry(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                        <button onClick={handleSaveInquiry} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Save Updates</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 8: CONFERENCE WEBSITE CMS (3.2) */}
            {/* ============================================================== */}
            {activeTab === 'cms' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
                <div className="border-b pb-4">
                  <h3 className="font-extrabold text-slate-900 text-base">Live Conference Website Content CMS</h3>
                  <p className="text-xs text-slate-500">Edit and publish core conference details across public routes without source code changes.</p>
                </div>

                <form onSubmit={handleSaveCmsContent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Conference Title</label>
                      <input
                        type="text"
                        value={cmsForm.conferenceName}
                        onChange={e => setCmsForm({ ...cmsForm, conferenceName: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Dates</label>
                      <input
                        type="text"
                        value={cmsForm.dates}
                        onChange={e => setCmsForm({ ...cmsForm, dates: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Theme Tagline</label>
                    <input
                      type="text"
                      value={cmsForm.tagline}
                      onChange={e => setCmsForm({ ...cmsForm, tagline: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Venue Location</label>
                      <input
                        type="text"
                        value={cmsForm.venue}
                        onChange={e => setCmsForm({ ...cmsForm, venue: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Abstract Submission Deadline</label>
                      <input
                        type="text"
                        value={cmsForm.abstractDeadline}
                        onChange={e => setCmsForm({ ...cmsForm, abstractDeadline: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer"
                    >
                      Publish Updates to Website &rarr;
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 9: STAFF & PERMISSIONS (PHASE 4 - SUPER ADMIN) */}
            {/* ============================================================== */}
            {activeTab === 'staff' && isSuperAdmin && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Administrative Staff Accounts</h3>
                    <p className="text-xs text-slate-500">Least privilege role matrix: Super Admin, Secretariat, Finance, Editorial, Reviewer.</p>
                  </div>
                  <button
                    onClick={() => setShowStaffModal(true)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Provision Account</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b">
                      <tr>
                        <th className="py-3 px-4">Staff Member</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Last Login</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {staffUsers.map((u, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{u.fullName}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{u.lastLogin ? u.lastLogin.split('T')[0] : 'Never'}</td>
                          <td className="py-3 px-4 text-right">
                            {u.id !== user?.id && (
                              <button
                                onClick={() => handleToggleStaffStatus(u.id, u.status)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                                  u.status === 'Active' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Provision Staff Modal */}
                {showStaffModal && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="font-extrabold text-slate-900 text-sm">Provision Staff Account</h4>
                        <button onClick={() => setShowStaffModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                      </div>

                      <form onSubmit={handleCreateStaff} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={newStaffName}
                            onChange={e => setNewStaffName(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            value={newStaffEmail}
                            onChange={e => setNewStaffEmail(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password</label>
                          <input
                            type="password"
                            required
                            value={newStaffPassword}
                            onChange={e => setNewStaffPassword(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment</label>
                          <select
                            value={newStaffRole}
                            onChange={e => setNewStaffRole(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-bold"
                          >
                            <option value="Secretariat Staff">Secretariat Staff</option>
                            <option value="Finance Staff">Finance Staff</option>
                            <option value="Paper Coordinator">Paper Coordinator</option>
                            <option value="Reviewer">Reviewer</option>
                            <option value="Content Editor">Content Editor</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Super Administrator">Super Administrator</option>
                          </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t">
                          <button type="button" onClick={() => setShowStaffModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Provision</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 10: AUDIT TRAIL (PHASE 7) */}
            {/* ============================================================== */}
            {activeTab === 'audit' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Append-Only Administrative Audit Log</h3>
                    <p className="text-xs text-slate-500">Immutable security event records: authentication, mutations, score submissions, booth bookings.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Actor</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Resource</th>
                        <th className="py-3 px-4">Details</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {auditLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 text-slate-500">{log.createdAt?.replace('T', ' ').substring(0, 19)}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{log.userEmail}</td>
                          <td className="py-3 px-4 text-blue-700 font-bold">{log.action}</td>
                          <td className="py-3 px-4 text-slate-600">{log.resourceType}: {log.resourceId}</td>
                          <td className="py-3 px-4 font-sans text-slate-700 max-w-xs truncate">{log.details}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              log.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
