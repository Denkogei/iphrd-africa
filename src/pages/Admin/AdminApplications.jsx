// src/pages/Admin/AdminPublications.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Plus, Edit, Trash2, X, Search, FileText, Calendar,
  File, Download, Eye, Loader2,
} from 'lucide-react';

const API = 'https://trial.iphrdafrica.org';

const getFullUrl = (url) =>
  !url ? null : url.startsWith('http') ? url : `${API}${url}`;

function AdminPublications() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/reports`);
      setItems(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', year: new Date().getFullYear(), file: null });
    setPreviewUrl(null);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      year: item.year || new Date().getFullYear(),
      file: null,
    });
    setPreviewUrl(item.file_url ? getFullUrl(item.file_url) : null);
    setShowForm(true);
  };

  const viewPdf = (item) => {
    setSelectedItem(item);
    setSelectedPdf(getFullUrl(item.file_url));
    setShowPdfModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setSelectedPdf(null);
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('year', formData.year);
      if (formData.file) fd.append('file', formData.file);

      const url = editingId
        ? `${API}/api/admin/reports/${editingId}`
        : `${API}/api/admin/reports`;
      const method = editingId ? 'patch' : 'post';

      const res = await axios[method](url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(editingId ? 'Publication updated!' : 'Publication uploaded!');
        setShowForm(false);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save publication');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/api/admin/reports/${deleteId}`, {
        withCredentials: true,
      });
      toast.success('Publication deleted!');
      setDeleteId(null);
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filtered = items.filter(
    (i) =>
      i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Publications Management</h1>
          <p className="text-sm text-gray-500">
            Upload and manage publications, reports, and magazines
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 px-4 py-2 bg-iphrd-green text-white rounded-lg hover:bg-iphrd-green/90 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Upload Publication
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-100 p-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or description…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green outline-none text-sm"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No publications found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date_posted).toLocaleDateString()}
                    </span>
                    {item.year && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {item.year}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => viewPdf(item)}
                      className="text-sm text-iphrd-green hover:underline inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <a
                      href={getFullUrl(item.file_url)}
                      download
                      className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ Upload / Edit Modal ============ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">
                {editingId ? 'Edit Publication' : 'Upload Publication'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green outline-none"
                  placeholder="Enter publication title…"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  name="description"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green outline-none"
                  placeholder="Brief description…"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-iphrd-green/20 focus:border-iphrd-green outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  File (PDF) {!editingId && '*'}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required={!editingId}
                  onChange={handleFileChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2"
                />
                {previewUrl && (
                  <div className="mt-2 flex items-center gap-2 text-gray-500 bg-gray-50 p-2 rounded-lg">
                    <File className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm truncate">
                      {previewUrl.split('/').pop()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-iphrd-green text-white px-4 py-2 rounded-lg hover:bg-iphrd-green/90 disabled:opacity-50 transition"
                >
                  {submitting
                    ? 'Saving…'
                    : editingId
                    ? 'Save Changes'
                    : 'Upload Publication'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ PDF Preview Modal ============ */}
      {showPdfModal && selectedPdf && selectedItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 truncate pr-4">
                {selectedItem.title}
              </h2>
              <div className="flex gap-2 flex-shrink-0">
                <a
                  href={selectedPdf}
                  download
                  className="p-2 text-iphrd-green hover:bg-iphrd-green/10 rounded-lg transition"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={closePdfModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <iframe
                src={selectedPdf}
                className="w-full h-full min-h-[70vh] bg-white rounded-lg"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============ Delete Confirm ============ */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-1">Delete Publication?</h3>
              <p className="text-sm text-gray-500 mb-5">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPublications;