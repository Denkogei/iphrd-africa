// src/pages/Admin/AdminApplications.jsx
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Search, Eye, Trash2, X, Loader2, Download, ExternalLink,
  User, Mail, Phone, Briefcase, Calendar, FileText, Filter,
  CheckCircle, XCircle, Hash, MessageSquare, StickyNote, Send, Clock,
} from 'lucide-react';

const API = 'https://trial.iphrdafrica.org';
const getFullUrl = (url) => (!url ? null : url.startsWith('http') ? url : `${API}${url}`);

const STATUS_STYLES = {
  pending:     'bg-yellow-100 text-yellow-700 border-yellow-200',
  reviewed:    'bg-blue-100 text-blue-700 border-blue-200',
  shortlisted: 'bg-purple-100 text-purple-700 border-purple-200',
  approved:    'bg-green-100 text-green-700 border-green-200',
  accepted:    'bg-green-100 text-green-700 border-green-200',
  rejected:    'bg-red-100 text-red-700 border-red-200',
};
const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'approved', 'rejected'];

function AdminApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfTitle, setPdfTitle] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/admin/applications`, { withCredentials: true });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (item) => {
    setSelectedItem(item);
    setShowDetail(true);
    setNewNote('');
    document.body.style.overflow = 'hidden';
    setNotesLoading(true);
    try {
      const { data } = await axios.get(
        `${API}/api/admin/applications/${item.id}/notes`,
        { withCredentials: true }
      );
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      setNotes([]);
    } finally {
      setNotesLoading(false);
    }
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedItem(null);
    setNotes([]);
    document.body.style.overflow = 'auto';
  };

  const openPdf = (url, title) => {
    if (!url) return;
    setSelectedPdf(getFullUrl(url));
    setPdfTitle(title);
    setShowPdfModal(true);
  };
  const closePdf = () => { setShowPdfModal(false); setSelectedPdf(null); };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.patch(
        `${API}/api/admin/applications/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Marked as ${status}`);
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, status });
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !selectedItem) return;
    setSavingNote(true);
    try {
      const { data } = await axios.post(
        `${API}/api/admin/applications/${selectedItem.id}/notes`,
        { note: newNote },
        { withCredentials: true }
      );
      toast.success('Note added');
      setNotes((prev) => [data.note, ...prev]);
      setNewNote('');
    } catch {
      toast.error('Failed to add note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/api/admin/applications/${deleteId}`, { withCredentials: true });
      toast.success('Application deleted');
      setDeleteId(null);
      closeDetail();
      fetchItems();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() =>
    items.filter((a) => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q
        || a.full_name?.toLowerCase().includes(q)
        || a.email?.toLowerCase().includes(q)
        || a.phone?.toLowerCase().includes(q)
        || a.opportunity_title?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || (a.status || 'pending') === statusFilter;
      return matchSearch && matchStatus;
    }),
    [items, searchTerm, statusFilter]
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Applications Management</h1>
          <p className="text-sm text-gray-500">Review applicant details, CVs, cover letters, and notes.</p>
        </div>
        <span className="text-sm text-gray-500">{filtered.length} of {items.length}</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-3 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, or position…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green outline-none"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No applications found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const status = (item.status || 'pending').toLowerCase();
            const stCls = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600 border-gray-200';
            return (
              <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${stCls}`}>{status}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date_applied).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Hash className="w-3 h-3" /> #{item.id}
                      </span>
                      {item.application_type && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                          {item.application_type}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base mb-1 truncate">{item.full_name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      {item.email && <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {item.email}</span>}
                      {item.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {item.phone}</span>}
                      {item.opportunity_title && <span className="inline-flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {item.opportunity_title}</span>}
                    </div>
                    <div className="flex gap-4 mt-3">
                      <button onClick={() => openDetail(item)} className="text-sm text-iphrd-green hover:underline inline-flex items-center gap-1">
                        <Eye className="w-4 h-4" /> View details
                      </button>
                      {item.cv_url && (
                        <>
                          <button onClick={() => openPdf(item.cv_url, 'CV')} className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                            <Eye className="w-4 h-4" /> Preview CV
                          </button>
                          <a href={getFullUrl(item.cv_url)} download className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                            <Download className="w-4 h-4" /> Download
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => updateStatus(item.id, 'approved')}
                      disabled={updatingId === item.id || status === 'approved'}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-40"
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, 'rejected')}
                      disabled={updatingId === item.id || status === 'rejected'}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg disabled:opacity-40"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============ DETAIL MODAL ============ */}
      {showDetail && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start px-6 py-4 border-b sticky top-0 bg-white z-10">
              <div className="min-w-0">
                <h2 className="text-xl font-bold truncate">{selectedItem.full_name}</h2>
                <p className="text-sm text-gray-500 truncate">
                  {selectedItem.opportunity_title} · Application #{selectedItem.id}
                </p>
              </div>
              <button onClick={closeDetail} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status workflow */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current status</p>
                    <span className={`inline-block text-sm px-3 py-1 rounded-full border capitalize font-medium ${STATUS_STYLES[(selectedItem.status || 'pending').toLowerCase()] || ''}`}>
                      {selectedItem.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {STATUS_OPTIONS.filter((s) => s !== (selectedItem.status || '').toLowerCase()).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedItem.id, s)}
                        disabled={updatingId === selectedItem.id}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 capitalize"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Applicant */}
              <Section title="Applicant" icon={<User className="w-4 h-4" />}>
                <Grid>
                  <Field label="Full Name" value={selectedItem.full_name} icon={<User className="w-3.5 h-3.5" />} />
                  <Field label="Email" value={selectedItem.email} icon={<Mail className="w-3.5 h-3.5" />} />
                  <Field label="Phone" value={selectedItem.phone} icon={<Phone className="w-3.5 h-3.5" />} />
                </Grid>
              </Section>

              {/* Application */}
              <Section title="Application" icon={<Briefcase className="w-4 h-4" />}>
                <Grid>
                  <Field label="Position / Opportunity" value={selectedItem.opportunity_title} icon={<Briefcase className="w-3.5 h-3.5" />} />
                  <Field label="Opportunity ID" value={selectedItem.opportunity_id} icon={<Hash className="w-3.5 h-3.5" />} />
                  <Field label="Application Type" value={selectedItem.application_type} />
                  <Field
                    label="Date Applied"
                    value={new Date(selectedItem.date_applied).toLocaleString()}
                    icon={<Calendar className="w-3.5 h-3.5" />}
                  />
                </Grid>
              </Section>

              {/* CV */}
              <Section title="CV / Resume" icon={<FileText className="w-4 h-4" />}>
                {selectedItem.cv_url ? (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">CV document</span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => openPdf(selectedItem.cv_url, 'CV')} className="p-1.5 text-iphrd-green hover:bg-iphrd-green/10 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <a href={getFullUrl(selectedItem.cv_url)} download className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                        <Download className="w-4 h-4" />
                      </a>
                      <a href={getFullUrl(selectedItem.cv_url)} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ) : <p className="text-sm text-gray-400">No CV attached</p>}
              </Section>

              {/* Cover Letter */}
              <Section title="Cover Letter" icon={<MessageSquare className="w-4 h-4" />}>
                {selectedItem.cover_letter
                  ? <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedItem.cover_letter}</div>
                  : <p className="text-sm text-gray-400">No cover letter provided</p>}
              </Section>

              {/* Notes */}
              <Section title={`Notes (${notes.length})`} icon={<StickyNote className="w-4 h-4" />}>
                <div className="flex gap-2 mb-3">
                  <input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this applicant…"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green outline-none"
                  />
                  <button
                    onClick={addNote}
                    disabled={savingNote || !newNote.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-iphrd-green text-white rounded-lg text-sm hover:bg-iphrd-green/90 disabled:opacity-50"
                  >
                    {savingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Add
                  </button>
                </div>
                {notesLoading ? (
                  <p className="text-sm text-gray-400"><Loader2 className="w-4 h-4 animate-spin inline mr-1" /> Loading notes…</p>
                ) : notes.length === 0 ? (
                  <p className="text-sm text-gray-400">No notes yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {notes.map((n) => (
                      <li key={n.id} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{n.note}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {n.created_by || 'unknown'} · {new Date(n.created_at).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <div className="flex justify-end pt-2 border-t">
                <button
                  onClick={() => setDeleteId(selectedItem.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" /> Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ PDF MODAL ============ */}
      {showPdfModal && selectedPdf && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold truncate">{pdfTitle}</h2>
              <div className="flex gap-2">
                <a href={selectedPdf} download className="p-2 text-iphrd-green hover:bg-iphrd-green/10 rounded-lg"><Download className="w-5 h-5" /></a>
                <a href={selectedPdf} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><ExternalLink className="w-5 h-5" /></a>
                <button onClick={closePdf} className="p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <iframe src={selectedPdf} className="w-full h-full min-h-[70vh] bg-white rounded-lg" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}

      {/* ============ DELETE CONFIRM ============ */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-1">Delete Application?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="border border-gray-100 rounded-lg">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 font-semibold text-gray-800 text-sm">
        {icon} {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}
function Field({ label, value, icon }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">{icon} {label}</p>
      <p className="text-sm font-medium text-gray-800 break-words">{value}</p>
    </div>
  );
}
export default AdminApplications;