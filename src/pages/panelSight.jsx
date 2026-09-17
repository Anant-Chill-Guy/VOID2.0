import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./panelSight.css";

// Ordered preferred domains as numbered chips (1 = top pick).
const renderDomains = (r) => {
  const domains = [r.domain, r.domain2, r.domain3].filter(Boolean);
  if (domains.length === 0) return "—";
  return domains.map((d, i) => (
    <span key={d} className="panel-sight-chip">
      <span className="panel-sight-chip-order">{i + 1}</span>
      {d}
    </span>
  ));
};

export default function PanelSight() {
  const [registrations, setRegistrations] = useState([]);
  const [loadError, setLoadError] = useState("");

  // Direct entry: no auth, load registrations straight from the DB-backed API.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/registrations");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (active) setRegistrations(data);
      } catch {
        if (active) setLoadError("Could not load registrations.");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="panel-sight">
      <Navbar />
      <div className="panel-sight-header">
        <div>
          <h1 className="panel-sight-title">VOID · PANEL SIGHT</h1>
          <p className="panel-sight-sub">{registrations.length} registration(s)</p>
        </div>
      </div>

      {loadError ? (
        <p className="panel-sight-empty">{loadError}</p>
      ) : (
        <div className="panel-sight-table-wrap">
          <table className="panel-sight-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Accommodation</th>
                <th>Preferred Domains</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{r.name}</td>
                  <td>{r.branch}</td>
                  <td>{r.year || "—"}</td>
                  <td>{r.email}</td>
                  <td>{r.whatsapp}</td>
                  <td>{r.accommodation}</td>
                  <td>{renderDomains(r)}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {registrations.length === 0 && (
            <p className="panel-sight-empty">No registrations yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
