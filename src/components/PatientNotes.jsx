import { useMemo, useState } from "react";
import { LuFileText, LuPencil, LuPlus, LuX } from "react-icons/lu";
import { useUpdatePatientNotes } from "../hooks/useUpdatePatientNotes";

const PatientNotes = ({ data, patientId, refetch }) => {
  const notes = Array.isArray(data) ? data : [];

  const [isExpanded, setIsExpanded] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [editingNote, setEditingNote] = useState(null);

  const [newNote, setNewNote] = useState({
    note: "",
    type: "General",
  });

  const [editForm, setEditForm] = useState({
    note: "",
    type: "General",
  });

  const { addPatientNote, updatePatientNote, loading, error } =
    useUpdatePatientNotes(patientId, refetch);

  const currentDoctor = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const displayedNotes = useMemo(() => {
    if (isExpanded) return notes;
    return notes.slice(0, 3);
  }, [isExpanded, notes]);

  const formatDate = (d) => {
    if (!d) return "—";

    const dt = new Date(d);

    if (Number.isNaN(dt.getTime())) return "—";

    return dt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNoteText = (note) => {
    return note?.note ?? note?.content ?? note?.text ?? note?.body ?? "—";
  };

const canEditNote = (note) => {
  const loggedDoctor = currentDoctor?.doctorId || currentDoctor?._id;

  const noteDoctor =
    typeof note?.doctorId === "object"
      ? note?.doctorId?._id
      : note?.doctorId;

  // fallback safety check
  if (!loggedDoctor || !noteDoctor) return false;



  return String(loggedDoctor) === String(noteDoctor);
};

  const handleAddNote = async () => {
    if (!newNote.note.trim()) return;

    const success = await addPatientNote({
      note: newNote.note,
      type: newNote.type,
    });

    if (success) {
      setNewNote({
        note: "",
        type: "General",
      });

      setShowAddModal(false);
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note);

    setEditForm({
      note: note?.note || "",
      type: note?.type || "General",
    });
  };

  const handleUpdateNote = async () => {
    if (!editingNote?._id) return;

    const success = await updatePatientNote({
      noteId: editingNote._id,
      note: editForm.note,
      type: editForm.type,
    });

    if (success) {
      setEditingNote(null);

      setEditForm({
        note: "",
        type: "General",
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <LuFileText className="w-5 h-5 text-blue-600" />
          </div>

          <h2 className="text-[22px] font-semibold text-slate-900">
            Patient Notes
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
            {notes.length} notes
          </span>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700">
            <LuPlus size={15} />
            Add Note
          </button>

          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="hidden sm:inline-flex items-center gap-2 text-[12px] font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl"
            type="button">
            {isExpanded ? "Show Less" : "Show All"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <LuFileText size={34} />
          <p className="text-[13px] mt-3">No notes recorded</p>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white">
            <LuPlus />
            Add First Note
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedNotes.map((note) => {
            const doctorName = note?.doctorName || "—";

            const createdAt =
              note?.createdAt ||
              note?.updatedAt ||
              null;

            const text = getNoteText(note);

            return (
              <div
                key={note?._id}
                className="border border-slate-100 bg-slate-50 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12px] uppercase tracking-wide text-slate-400 font-medium">
                      {doctorName}
                    </p>

                    <p className="text-[13px] text-slate-600 mt-1 whitespace-pre-wrap">
                      {text}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {canEditNote(note) && (
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(note)
                        }
                        className="w-9 h-9 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 flex items-center justify-center">
                        <LuPencil
                          size={16}
                          className="text-blue-600"
                        />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[12px] text-slate-500">
                    {formatDate(createdAt)}
                  </span>

                  <span className="text-[12px] text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                    {note?.type || "General"}
                  </span>
                </div>
              </div>
            );
          })}

          {!isExpanded && notes.length > 3 && (
            <div className="flex items-center justify-center pt-2">
              <button
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center gap-2 text-[12px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl"
                type="button">
                <LuPlus size={14} />
                Show more
              </button>
            </div>
          )}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">
                Add Patient Note
              </h3>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }>
                <LuX size={20} />
              </button>
            </div>

            <textarea
              rows={6}
              value={newNote.note}
              onChange={(e) =>
                setNewNote((prev) => ({
                  ...prev,
                  note: e.target.value,
                }))
              }
              className="w-full border rounded-xl p-3"
              placeholder="Enter note..."
            />
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() =>
                  setShowAddModal(false)
                }
                className="px-4 py-2 border rounded-xl">
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleAddNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl">
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">
                Edit Note
              </h3>

              <button
                onClick={() =>
                  setEditingNote(null)
                }>
                <LuX size={20} />
              </button>
            </div>

            <textarea
              rows={6}
              value={editForm.note}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  note: e.target.value,
                }))
              }
              className="w-full border rounded-xl p-3"
            />

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() =>
                  setEditingNote(null)
                }
                className="px-4 py-2 border rounded-xl">
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleUpdateNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl">
                {loading
                  ? "Updating..."
                  : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientNotes;