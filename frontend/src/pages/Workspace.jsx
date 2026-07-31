import { useEffect, useMemo, useState } from "react";
import {
  FiAward,
  FiBookOpen,
  FiCheck,
  FiClipboard,
  FiExternalLink,
  FiFileText,
  FiLock,
  FiPlus,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import {
  certificatesApi,
  employersApi,
  internshipsApi,
  mentorsApi,
  submissionsApi,
  tasksApi,
} from "../api/client";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/PageLoader";

const formatDate = (value) => value
  ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value))
  : "No deadline";

const statusLabel = (status) => status?.replaceAll("_", " ") || "applied";

export default function Workspace() {
  const { user } = useAuth();

  if (user.role === "student") return <StudentWorkspace user={user} />;
  if (user.role === "employer") return <EmployerWorkspace user={user} />;
  if (user.role === "mentor") return <ReviewWorkspace />;

  return (
    <section className="panel empty-workspace">
      <FiClipboard />
      <h2>No project workspace for this role</h2>
      <p>Use the administration area to review platform activity.</p>
    </section>
  );
}

function StudentWorkspace({ user }) {
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [links, setLinks] = useState({});
  const [busy, setBusy] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [applicationData, certificateData] = await Promise.all([
        internshipsApi.myApplications(),
        user.profile?.id
          ? certificatesApi.forStudent(user.profile.id)
          : Promise.resolve([]),
      ]);
      setApplications(applicationData);
      setCertificates(certificateData);
      setTasks(Object.fromEntries(
        applicationData.map((application) => [
          application.internship_id,
          application.tasks || [],
        ]),
      ));
      setSubmissions(applicationData.flatMap((application) => (
        (application.tasks || []).flatMap((task) => task.submissions || [])
      )));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user.profile?.id]);

  const submit = async (task) => {
    const contentUrl = links[task.id]?.trim();
    if (!contentUrl) {
      setMessage("Add a public link before submitting your work.");
      return;
    }
    setBusy(task.id);
    setMessage("");
    try {
      const data = await tasksApi.submit(task.id, contentUrl);
      setSubmissions((current) => [data.submission, ...current]);
      setLinks((current) => ({ ...current, [task.id]: "" }));
      setMessage(`Submitted “${task.title}” successfully.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <PageLoader label="Loading your projects…" />;

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <div>
          <span className="eyebrow">My work</span>
          <h2>Applications, tasks, and outcomes.</h2>
          <p>Follow every application from first submission through reviewed work and certification.</p>
        </div>
        <div className="workspace-counts">
          <span><strong>{applications.length}</strong> applications</span>
          <span><strong>{submissions.length}</strong> submissions</span>
          <span><strong>{certificates.length}</strong> certificates</span>
        </div>
      </section>

      {message && <Notice message={message} onClose={() => setMessage("")} />}

      {applications.length ? applications.map((application) => {
        const internship = application.internship || {};
        const internshipTasks = tasks[application.internship_id] || [];
        return (
          <section className="panel project-panel" key={application.id}>
            <header className="project-head">
              <span className="company-mark blue">
                {(internship.company_name || "SC").slice(0, 2).toUpperCase()}
              </span>
              <div>
                <small>{internship.company_name || "Partner company"}</small>
                <h3>{internship.title || "Internship"}</h3>
                <p>{internship.location || "Remote"} · Applied {formatDate(application.applied_at)}</p>
              </div>
              <span className={`application-status ${application.status}`}>
                {statusLabel(application.status)}
              </span>
            </header>

            {application.status === "rejected" ? (
              <div className="project-note">This application was not selected. Keep exploring—your next fit may be close.</div>
            ) : internshipTasks.length ? (
              <>
                {application.status === "applied" && (
                  <div className="task-access-note"><FiLock /><span><strong>Tasks are visible</strong>You can review the brief now. Submission unlocks when the employer accepts your application.</span></div>
                )}
                <div className="task-list">
                  {internshipTasks.map((task) => {
                  const taskSubmissions = submissions
                    .filter((submission) => submission.task_id === task.id)
                    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
                  const latest = taskSubmissions[0];
                  const canSubmit = ["accepted", "completed"].includes(application.status);
                  return (
                    <article className={`task-row ${canSubmit ? "" : "locked"}`} key={task.id}>
                      <span className={`task-state ${latest ? "done" : ""}`}>
                        {latest ? <FiCheck /> : task.order + 1}
                      </span>
                      <div className="task-copy">
                        <strong>{task.title}</strong>
                        <p>{task.description || "Complete the project deliverable and share a public link."}</p>
                        <small>Due {formatDate(task.due_date)} · {task.max_score} points</small>
                        {latest?.feedback && (
                          <blockquote>
                            <b>Reviewer feedback</b>
                            {latest.feedback}
                          </blockquote>
                        )}
                      </div>
                      <div className="task-submit">
                        {latest && (
                          <span className="score-chip">
                            {latest.score == null ? "Awaiting review" : `${latest.score}/${task.max_score}`}
                          </span>
                        )}
                        <div>
                          <input
                            type="url"
                            aria-label={`Submission link for ${task.title}`}
                            placeholder={!canSubmit ? "Submission available after acceptance" : latest ? "Submit a revised link" : "https://your-work.com"}
                            value={links[task.id] || ""}
                            onChange={(event) => setLinks({ ...links, [task.id]: event.target.value })}
                            disabled={!canSubmit}
                          />
                          <button
                            className="secondary-button"
                            onClick={() => submit(task)}
                            disabled={!canSubmit || busy === task.id}
                          >
                            {canSubmit ? <FiSend /> : <FiLock />} {busy === task.id ? "Sending…" : !canSubmit ? "Locked" : latest ? "Resubmit" : "Submit"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                  })}
                </div>
              </>
            ) : (
              <div className="project-note">{application.status === "applied" ? "The employer has not published tasks for this project yet. They will appear here as soon as they are added." : "You’re accepted. The employer has not published project tasks yet."}</div>
            )}
          </section>
        );
      }) : (
        <EmptyState
          icon={<FiBookOpen />}
          title="No applications yet"
          copy="Explore opportunities and apply to start building your project workspace."
        />
      )}

      <section className="workspace-section">
        <div className="section-row">
          <div><span className="eyebrow">Verified outcomes</span><h2>Certificates</h2></div>
        </div>
        {certificates.length ? (
          <div className="certificate-grid">
            {certificates.map((certificate) => (
              <article className="panel certificate-card" key={certificate.id}>
                <FiAward />
                <small>Certificate #{certificate.id}</small>
                <h3>{certificate.certificate_data || "Certificate of completion"}</h3>
                <p>{certificate.grade_summary}</p>
                <span>Issued {formatDate(certificate.issued_at)}</span>
              </article>
            ))}
          </div>
        ) : <div className="project-note">Completed, assessed internships will appear here as verified certificates.</div>}
      </section>
    </div>
  );
}

function EmployerWorkspace({ user }) {
  const [internships, setInternships] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [taskForm, setTaskForm] = useState({ title: "", description: "", due_date: "", max_score: 100 });
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", location: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingInternships, setLoadingInternships] = useState(true);
  const [loadingProject, setLoadingProject] = useState(false);

  useEffect(() => {
    employersApi.internships(user.id)
      .then((data) => {
        setInternships(data);
        setSelectedId((current) => current || data[0]?.id || null);
        setLoadingProject(Boolean(data[0]));
      })
      .catch((error) => setMessage(error.message))
      .finally(() => setLoadingInternships(false));
  }, [user.id]);

  const selected = useMemo(
    () => internships.find((internship) => internship.id === selectedId),
    [internships, selectedId],
  );

  useEffect(() => {
    if (!selected) return;
    setEditForm({
      title: selected.title || "",
      description: selected.description || "",
      location: selected.location || "",
    });
  }, [selected]);

  const loadProject = async () => {
    if (!selectedId) return;
    setLoadingProject(true);
    try {
      const data = await internshipsApi.workspace(selectedId);
      setTasks(data.tasks);
      setApplications(data.applications);
      setSubmissions(Object.fromEntries(
        data.tasks.map((task) => [task.id, task.submissions || []]),
      ));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingProject(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [selectedId]);

  const createTask = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const data = await tasksApi.create(selectedId, {
        ...taskForm,
        max_score: Number(taskForm.max_score),
        due_date: taskForm.due_date || null,
        order: tasks.length,
      });
      setTasks((current) => [...current, data.task]);
      setSubmissions((current) => ({ ...current, [data.task.id]: [] }));
      setTaskForm({ title: "", description: "", due_date: "", max_score: 100 });
      setMessage("Task added to the project.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (application, status) => {
    setMessage("");
    try {
      const data = await internshipsApi.updateApplication(application.id, status);
      setApplications((current) => current.map((item) => (
        item.id === application.id ? data.application : item
      )));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const review = async (submission) => {
    const draft = reviewDrafts[submission.id] || {};
    if (draft.score === "" || draft.score == null) {
      setMessage("Add a score before saving the review.");
      return;
    }
    setBusy(true);
    try {
      const data = await submissionsApi.review(submission.id, {
        score: Number(draft.score),
        feedback: draft.feedback || "",
        passed: draft.passed ?? true,
      });
      setSubmissions((current) => ({
        ...current,
        [submission.task_id]: current[submission.task_id].map((item) => (
          item.id === submission.id ? data.submission : item
        )),
      }));
      setMessage("Submission review saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const issueCertificate = async (application) => {
    try {
      await internshipsApi.certificate(selectedId, application.student_id);
      setMessage(`Certificate issued to ${studentName(application.student)}.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const togglePublishing = async () => {
    if (!selected) return;
    try {
      const data = await internshipsApi.update(selected.id, {
        is_active: !selected.is_active,
      });
      setInternships((current) => current.map((item) => (
        item.id === selected.id ? data.internship : item
      )));
      setMessage(data.internship.is_active ? "Opportunity reopened." : "Opportunity closed.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const saveInternship = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const data = await internshipsApi.update(selected.id, editForm);
      setInternships((current) => current.map((item) => (
        item.id === selected.id ? data.internship : item
      )));
      setEditing(false);
      setMessage("Opportunity details updated.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <div><span className="eyebrow">Delivery workspace</span><h2>Manage projects and talent.</h2><p>Turn each published opportunity into structured tasks, decisions, and reviewed outcomes.</p></div>
      </section>
      {message && <Notice message={message} onClose={() => setMessage("")} />}
      {loadingInternships || loadingProject ? (
        <PageLoader label={loadingInternships ? "Loading your opportunities…" : "Loading project details…"} />
      ) : !internships.length ? (
        <EmptyState icon={<FiBookOpen />} title="Publish an opportunity first" copy="Create an opportunity from Overview, then return here to add tasks and manage applicants." />
      ) : (
        <>
          <div className="project-tabs" role="tablist">
            {internships.map((internship) => (
              <button key={internship.id} className={selectedId === internship.id ? "active" : ""} onClick={() => {
                if (selectedId === internship.id) return;
                setLoadingProject(true);
                setSelectedId(internship.id);
              }}>
                {internship.title}<small>{internship.is_active ? "Live" : "Closed"}</small>
              </button>
            ))}
          </div>
          <section className="panel project-panel">
            <header className="project-head">
              <span className="company-mark blue">{(user.profile?.company_name || "SC").slice(0, 2).toUpperCase()}</span>
              <div><small>{user.profile?.company_name}</small><h3>{selected?.title}</h3><p>{selected?.location || "Remote"} · {applications.length} applicants · {tasks.length} tasks</p></div>
              <div className="project-actions">
                <button className="secondary-button" onClick={() => setEditing(true)}>Edit details</button>
                <button className="secondary-button" onClick={togglePublishing}>{selected?.is_active ? "Close" : "Reopen"}</button>
              </div>
            </header>
          </section>

          <div className="workspace-columns">
            <section className="panel workspace-card">
              <div className="workspace-card-head"><span><FiUsers /></span><div><h3>Applicants</h3><p>Accept candidates to unlock their tasks.</p></div></div>
              {applications.length ? (
                <div className="workspace-table-wrap">
                  <table className="workspace-data-table applicants-table">
                    <thead><tr><th>Candidate</th><th>Status</th><th>Applied</th><th>Outcome</th></tr></thead>
                    <tbody>{applications.map((application) => (
                      <tr key={application.id}>
                        <td data-label="Candidate"><div className="table-user"><span className="avatar">{studentInitials(application.student)}</span><span><strong>{studentName(application.student)}</strong><small>{application.student?.email} · {application.student?.university || "Education not added"}</small></span></div></td>
                        <td data-label="Status"><select className={`status-select ${application.status}`} value={application.status} onChange={(event) => changeStatus(application, event.target.value)} aria-label={`Application status for ${studentName(application.student)}`}><option value="applied">Applied</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option><option value="completed">Completed</option></select></td>
                        <td data-label="Applied"><span className="date-cell">{formatDate(application.applied_at)}</span></td>
                        <td data-label="Outcome">{application.status === "completed" ? <button className="table-link-action" onClick={() => issueCertificate(application)}><FiAward /> Issue certificate</button> : <span className="table-placeholder">Not ready</span>}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : <p className="muted-copy">No applications have arrived yet.</p>}
            </section>

            <section className="panel workspace-card">
              <div className="workspace-card-head"><span><FiPlus /></span><div><h3>Add a project task</h3><p>Give accepted candidates a clear deliverable.</p></div></div>
              <form className="compact-form" onSubmit={createTask}>
                <label>Task title<input required value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} /></label>
                <label>Instructions<textarea rows="3" value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} /></label>
                <div className="field-row">
                  <label>Due date<input type="datetime-local" value={taskForm.due_date} onChange={(event) => setTaskForm({ ...taskForm, due_date: event.target.value })} /></label>
                  <label>Maximum score<input type="number" min="1" max="1000" value={taskForm.max_score} onChange={(event) => setTaskForm({ ...taskForm, max_score: event.target.value })} /></label>
                </div>
                <button className="button small" disabled={busy}><FiPlus /> Add task</button>
              </form>
            </section>
          </div>

          <section className="workspace-section">
            <div className="section-row"><div><span className="eyebrow">Review queue</span><h2>Tasks and submissions</h2></div></div>
            {tasks.length ? tasks.map((task) => (
              <article className="panel review-task" key={task.id}>
                <header><span className="task-state">{task.order + 1}</span><div><h3>{task.title}</h3><p>{task.description || "No additional instructions"} · Due {formatDate(task.due_date)}</p></div><strong>{(submissions[task.id] || []).length} submissions</strong></header>
                {(submissions[task.id] || []).length ? (
                  <div className="workspace-table-wrap">
                    <table className="workspace-data-table review-table">
                      <thead><tr><th>Student</th><th>Submission</th><th>Score</th><th>Feedback</th><th>Action</th></tr></thead>
                      <tbody>{(submissions[task.id] || []).map((submission) => {
                        const applicant = applications.find((item) => item.student_id === submission.student_id);
                        const draft = reviewDrafts[submission.id] || { score: submission.score ?? "", feedback: submission.feedback ?? "", passed: submission.passed ?? true };
                        return (
                          <tr key={submission.id}>
                            <td data-label="Student"><strong>{studentName(applicant?.student)}</strong><small>{applicant?.student?.email}</small></td>
                            <td data-label="Submission"><a className="work-link" href={submission.content_url} target="_blank" rel="noreferrer">Open work <FiExternalLink /></a><small>{formatDate(submission.submitted_at)}</small></td>
                            <td data-label="Score"><input className="score-input" type="number" min="0" max={task.max_score} placeholder={`/${task.max_score}`} value={draft.score} onChange={(event) => setReviewDrafts({ ...reviewDrafts, [submission.id]: { ...draft, score: event.target.value } })} /></td>
                            <td data-label="Feedback"><input className="feedback-input" placeholder="Add useful feedback" value={draft.feedback} onChange={(event) => setReviewDrafts({ ...reviewDrafts, [submission.id]: { ...draft, feedback: event.target.value } })} /></td>
                            <td data-label="Action"><button className="table-save-action" onClick={() => review(submission)} disabled={busy}>Save review</button></td>
                          </tr>
                        );
                      })}</tbody>
                    </table>
                  </div>
                ) : <p className="muted-copy">No work submitted for this task yet.</p>}
              </article>
            )) : <div className="project-note">Add the first task to begin the delivery workflow.</div>}
          </section>
          {editing && (
            <div className="modal-backdrop" role="presentation" onMouseDown={() => setEditing(false)}>
              <form className="create-modal" onSubmit={saveInternship} onMouseDown={(event) => event.stopPropagation()}>
                <span className="eyebrow">Edit opportunity</span>
                <h2>Keep the project brief current.</h2>
                <label>Opportunity title<input required value={editForm.title} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} /></label>
                <label>Description<textarea rows="4" value={editForm.description} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} /></label>
                <label>Location<input value={editForm.location} onChange={(event) => setEditForm({ ...editForm, location: event.target.value })} /></label>
                <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setEditing(false)}>Cancel</button><button className="button small" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button></div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReviewWorkspace() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [assessment, setAssessment] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [showCandidates, setShowCandidates] = useState(false);
  const [loadingInternships, setLoadingInternships] = useState(true);
  const [loadingProject, setLoadingProject] = useState(false);

  useEffect(() => {
    internshipsApi.list()
      .then((data) => {
        setInternships(data);
        setSelectedId(data[0]?.id || null);
        setLoadingProject(Boolean(data[0]));
      })
      .catch((error) => setMessage(error.message))
      .finally(() => setLoadingInternships(false));
  }, []);

  useEffect(() => {
    if (!user.profile?.id) return;
    mentorsApi.students(user.profile.id)
      .then(setCandidates)
      .catch(() => {});
  }, [user.profile?.id]);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingProject(true);
    internshipsApi.workspace(selectedId)
      .then((data) => {
        setApplications(data.applications);
        setTasks(data.tasks);
        setSubmissions(Object.fromEntries(
          data.tasks.map((task) => [task.id, task.submissions || []]),
        ));
      })
      .catch((error) => setMessage(error.message))
      .finally(() => setLoadingProject(false));
  }, [selectedId]);

  const saveReview = async (submission) => {
    const draft = reviewDrafts[submission.id] || {};
    if (draft.score === "" || draft.score == null) {
      setMessage("Add a task score before saving the review.");
      return;
    }
    setBusy(true);
    try {
      const data = await submissionsApi.review(submission.id, {
        score: Number(draft.score),
        feedback: draft.feedback || "",
        passed: draft.passed ?? true,
      });
      setSubmissions((current) => ({
        ...current,
        [submission.task_id]: current[submission.task_id].map((item) => (
          item.id === submission.id ? data.submission : item
        )),
      }));
      setMessage("Task feedback saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const saveAssessment = async (application) => {
    const draft = assessment[application.id] || {};
    if (draft.score === "" || draft.score == null) {
      setMessage("Add a score between 0 and 100.");
      return;
    }
    setBusy(true);
    try {
      await internshipsApi.assess(selectedId, {
        student_id: application.student_id,
        score: Number(draft.score),
        feedback: draft.feedback || "",
        completed: draft.completed ?? true,
      });
      setMessage(`Assessment saved for ${studentName(application.student)}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="workspace-stack">
      <section className="workspace-hero"><div><span className="eyebrow">Mentor review</span><h2>Turn project work into useful feedback.</h2><p>Review participants across opportunities and record their final assessment.</p></div></section>
      {message && <Notice message={message} onClose={() => setMessage("")} />}
      {loadingInternships || loadingProject ? (
        <PageLoader label={loadingInternships ? "Loading opportunities…" : "Loading review workspace…"} />
      ) : (
      <>
      <div className="project-tabs">
        {internships.map((internship) => <button key={internship.id} className={selectedId === internship.id ? "active" : ""} onClick={() => {
          if (selectedId === internship.id) return;
          setLoadingProject(true);
          setSelectedId(internship.id);
        }}>{internship.title}<small>{internship.company_name}</small></button>)}
      </div>
      {!!candidates.length && (
        <section className="panel workspace-card">
          <div className="workspace-card-head">
            <span><FiUsers /></span>
            <div><h3>Candidate pool</h3><p>{candidates.length} students have applied across SkillConnect projects.</p></div>
          </div>
          <button type="button" className="secondary-button" onClick={() => setShowCandidates((current) => !current)}>
            {showCandidates ? "Hide candidates" : "Show candidates"}
          </button>
          {showCandidates && (
            <div className="workspace-table-wrap candidate-table-wrap">
              <table className="workspace-data-table candidate-table">
                <thead><tr><th>Candidate</th><th>Education</th><th>Skills</th></tr></thead>
                <tbody>{candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td data-label="Candidate"><div className="table-user"><span className="avatar">{studentInitials(candidate)}</span><span><strong>{studentName(candidate)}</strong><small>{candidate.email}</small></span></div></td>
                    <td data-label="Education"><span>{candidate.university || "Not added"}</span><small>{candidate.graduation_year ? `Class of ${candidate.graduation_year}` : "Graduation year not added"}</small></td>
                    <td data-label="Skills"><div className="table-skills">{candidate.skills ? candidate.skills.split(",").slice(0, 3).map((skill) => <span key={skill}>{skill.trim()}</span>) : <small>No skills listed</small>}</div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
      )}
      <section className="panel workspace-card">
        <div className="workspace-card-head"><span><FiClipboard /></span><div><h3>Final assessments</h3><p>Scores marked complete make a learner eligible for a certificate.</p></div></div>
        {applications.length ? (
          <div className="workspace-table-wrap">
            <table className="workspace-data-table assessment-table">
              <thead><tr><th>Student</th><th>Score</th><th>Final feedback</th><th>Action</th></tr></thead>
              <tbody>{applications.map((application) => {
                const draft = assessment[application.id] || { score: "", feedback: "", completed: true };
                return (
                  <tr key={application.id}>
                    <td data-label="Student"><div className="table-user"><span className="avatar">{studentInitials(application.student)}</span><span><strong>{studentName(application.student)}</strong><small>{application.student?.email} · {statusLabel(application.status)}</small></span></div></td>
                    <td data-label="Score"><input className="score-input" type="number" min="0" max="100" placeholder="/100" value={draft.score} onChange={(event) => setAssessment({ ...assessment, [application.id]: { ...draft, score: event.target.value } })} /></td>
                    <td data-label="Final feedback"><textarea rows="2" placeholder="Specific, actionable feedback" value={draft.feedback} onChange={(event) => setAssessment({ ...assessment, [application.id]: { ...draft, feedback: event.target.value } })} /></td>
                    <td data-label="Action"><button className="table-save-action" onClick={() => saveAssessment(application)} disabled={busy}>Save assessment</button></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        ) : <p className="muted-copy">No learners have applied to this opportunity yet.</p>}
      </section>
      <section className="workspace-section">
        <div className="section-row"><div><span className="eyebrow">Project feedback</span><h2>Submitted tasks</h2></div></div>
        {tasks.length ? tasks.map((task) => (
          <article className="panel review-task" key={task.id}>
            <header><span className="task-state">{task.order + 1}</span><div><h3>{task.title}</h3><p>{task.description || "No additional instructions"}</p></div><strong>{(submissions[task.id] || []).length} submissions</strong></header>
            {(submissions[task.id] || []).length ? (
              <div className="workspace-table-wrap">
                <table className="workspace-data-table review-table">
                  <thead><tr><th>Student</th><th>Submission</th><th>Score</th><th>Feedback</th><th>Action</th></tr></thead>
                  <tbody>{submissions[task.id].map((submission) => {
                    const applicant = applications.find((item) => item.student_id === submission.student_id);
                    const draft = reviewDrafts[submission.id] || { score: submission.score ?? "", feedback: submission.feedback ?? "", passed: submission.passed ?? true };
                    return (
                      <tr key={submission.id}>
                        <td data-label="Student"><strong>{studentName(applicant?.student)}</strong><small>{applicant?.student?.email}</small></td>
                        <td data-label="Submission"><a className="work-link" href={submission.content_url} target="_blank" rel="noreferrer">Open work <FiExternalLink /></a><small>{formatDate(submission.submitted_at)}</small></td>
                        <td data-label="Score"><input className="score-input" type="number" min="0" max={task.max_score} placeholder={`/${task.max_score}`} value={draft.score} onChange={(event) => setReviewDrafts({ ...reviewDrafts, [submission.id]: { ...draft, score: event.target.value } })} /></td>
                        <td data-label="Feedback"><input className="feedback-input" placeholder="Add task feedback" value={draft.feedback} onChange={(event) => setReviewDrafts({ ...reviewDrafts, [submission.id]: { ...draft, feedback: event.target.value } })} /></td>
                        <td data-label="Action"><button className="table-save-action" onClick={() => saveReview(submission)} disabled={busy}>Save feedback</button></td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            ) : <p className="muted-copy">No work submitted for this task yet.</p>}
          </article>
        )) : <div className="project-note">This opportunity has no tasks yet.</div>}
      </section>
      </>
      )}
    </div>
  );
}

function EmptyState({ icon, title, copy }) {
  return <section className="panel empty-workspace">{icon}<h2>{title}</h2><p>{copy}</p></section>;
}

function Notice({ message, onClose }) {
  return <div className="workspace-notice" role="status"><FiFileText /><span>{message}</span><button onClick={onClose}>Dismiss</button></div>;
}

function studentName(student) {
  return [student?.first_name, student?.last_name].filter(Boolean).join(" ") || student?.email?.split("@")[0] || "Student";
}

function studentInitials(student) {
  return `${student?.first_name?.[0] || ""}${student?.last_name?.[0] || ""}`.toUpperCase() || "ST";
}
