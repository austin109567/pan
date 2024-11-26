import { FC, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Trash2, ArrowLeft, Check, X } from 'lucide-react';
import { submissionService, QuestSubmission } from '../../services/submissionService';
import { playerService } from '../../services/playerService';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const SubmissionsAdmin: FC = () => {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionData, setSubmissionData] = useState<Awaited<ReturnType<typeof submissionService.getSubmissionPage>>>();
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await submissionService.getSubmissionPage(currentPage);
      setSubmissionData(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    try {
      await submissionService.deleteSubmission(id);
      loadSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await submissionService.updateSubmissionStatus(id, 'approved');
      loadSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await submissionService.updateSubmissionStatus(id, 'rejected');
      loadSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (submissionData && currentPage < submissionData.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin"
          className="flex items-center gap-2 text-neutral-lightGray hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Admin Panel
        </Link>
        <h1 className="text-2xl font-bold text-white">Quest Submissions</h1>
      </div>

      {/* Table */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-primary-pink/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/40 border-b border-primary-pink/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Proof</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-pink/10">
              {submissionData?.submissions.map((submission) => (
                <tr 
                  key={submission.id}
                  className="hover:bg-primary-pink/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-neutral-lightGray whitespace-nowrap">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {`${submission.wallet_address.slice(0, 4)}...${submission.wallet_address.slice(-4)}`}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      submission.quest_type === 'raid' 
                        ? 'bg-primary-pink/20 text-primary-pink'
                        : 'bg-primary-teal/20 text-primary-teal'
                    }`}>
                      {submission.quest_type === 'raid' ? 'Raid Quest' : 'Daily Quest'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      submission.status === 'approved' 
                        ? 'bg-green-500/20 text-green-500'
                        : submission.status === 'rejected'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={submission.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary-pink hover:text-primary-pink/80 transition-colors"
                    >
                      <span className="text-sm truncate max-w-[200px]">
                        View Proof
                      </span>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {submission.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(submission.id)}
                            className="p-2 text-green-400 hover:text-green-300 transition-colors rounded-lg hover:bg-green-400/5"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(submission.id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-400/5"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-400/5"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!submissionData?.submissions || submissionData.submissions.length === 0) && (
          <div className="text-center py-8 text-neutral-lightGray">
            No submissions found
          </div>
        )}
      </div>

      {/* Pagination */}
      {submissionData && submissionData.totalPages > 1 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-neutral-lightGray">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, submissionData.totalSubmissions)} of {submissionData.totalSubmissions} submissions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink hover:bg-primary-pink/20 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white">
              Page {currentPage} of {submissionData.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === submissionData.totalPages}
              className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink hover:bg-primary-pink/20 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};