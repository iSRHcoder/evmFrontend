import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPanelById,
  updatePanelVotes,
  type PanelResponse,
} from "../services/panel";

const PanelEvmPage = () => {
  const { id } = useParams();

  const [panel, setPanel] = useState<PanelResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [greenLight, setGreenLight] = useState<string | null>(null);
  const [popupMsg, setPopupMsg] = useState<string | null>(null);
  const [showPoster, setShowPoster] = useState(() => {
    return !localStorage.getItem("posterShown");
  });
  const [votesPressed, setVotesPressed] = useState<{
    candidateAdhyakshVotes: boolean;
    candidateAVotes: boolean;
    candidateBVotes: boolean;
  }>({
    candidateAdhyakshVotes: false,
    candidateAVotes: false,
    candidateBVotes: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPanelById(id!);
        if (res.success && res.data) {
          setPanel(res.data);
        } else {
          console.error("Failed to fetch panel:", res.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleVote = async (
    key: "candidateAdhyakshVotes" | "candidateAVotes" | "candidateBVotes"
  ) => {
    if (!panel) return;

    const voteKey = `panelVote_${panel._id}_${key}`;

    if (localStorage.getItem(voteKey) && !panel.multipleVotes) {
      setPopupMsg("तुम्ही आधीच मतदान केले आहे.");
      return;
    }

    try {
      const newVotes = ((panel[key] as number) ?? 0) + 1;

      // -----------------------
      // Convert key → type
      // -----------------------
      let type: "A" | "B" | "ADHYAKSH";

      if (key === "candidateAVotes") type = "A";
      else if (key === "candidateBVotes") type = "B";
      else type = "ADHYAKSH";

      // -----------------------
      // 🔥 Now call correctly
      // -----------------------
      const res = await updatePanelVotes(panel._id, type, newVotes);

      if (!res.success) {
        console.error("Vote update failed:", res.message);
        return;
      }

      if (!panel.multipleVotes) {
        localStorage.setItem(voteKey, "true");
      }

      setPanel((p) =>
        p
          ? {
              ...p,
              [key]: newVotes,
            }
          : p
      );

      // Mark this vote as pressed
      setVotesPressed((prev) => ({
        ...prev,
        [key]: true,
      }));

      setGreenLight(key);
      new Audio("/sounds/censor-beep.mp3").play().catch(() => {});

      // ✅ Only show popup if all three votes pressed
      setTimeout(() => {
        setGreenLight(null);
        const allPressed = Object.values({
          ...votesPressed,
          [key]: true,
        }).every(Boolean);

        if (allPressed) {
          setPopupMsg("आपले मतदान नोंदवले गेले आहे 🙏");
          setTimeout(() => setPopupMsg(null), 6000);
        }
      }, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!panel) return <div className="p-4 text-center text-xl">Not Found</div>;

  // If poster should be shown first (like EvmPage behavior)
  if (showPoster && panel.candidatePoster) {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col items-center">
        <img
          src={panel.candidatePoster}
          alt="poster"
          className="w-full max-h-[90vh] mt-3 object-contain bg-black"
        />

        <button
          onClick={() => {
            localStorage.setItem("posterShown", "true");
            setShowPoster(false);
          }}
          className="
    relative mt-4 mb-2 
    bg-linear-to-r from-blue-600 to-blue-500
    text-white font-extrabold tracking-wide
    px-6 py-3 rounded-full shadow-2xl
    hover:scale-110 transition-all duration-300
    animate-blink
    overflow-hidden
  "
        >
          पुढे जा / to vote
          <span className="absolute inset-0 rounded-full ring-4 ring-blue-300 opacity-60 animate-pulse"></span>
          <span className="absolute inset-0 bg-white opacity-10 blur-xl animate-[shine_2s_infinite]"></span>
        </button>
      </div>
    );
  }

  // -----------------------------
  // DYNAMIC Adhyaksh Rows
  // -----------------------------
  const adhyakshSerial = panel.candidateAdhyakshSerialNo;
  const totalCandidates = 20; // total candidates

  const startSerial = Math.max(1, adhyakshSerial - 3);
  const endSerial = Math.min(totalCandidates, adhyakshSerial + 3);

  // Build rows array
  const adhyakshRows = Array.from(
    { length: endSerial - startSerial + 1 },
    (_, i) => {
      const serial = startSerial + i;
      return serial === adhyakshSerial ? panel : null;
    }
  );

  return (
    <div className="w-full p-2 mx-auto bg-white shadow rounded-md overflow-hidden">
      {/* HEADER & MAIN BANNER */}
      <div className="w-full bg-[#086cae] text-white p-2 rounded-lg overflow-hidden">
        <div
          className="bg-white sm:text-lg text-[15px] text-black font-bold text-center pt-2 rounded-md shadow"
          style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
        >
          {panel.constituency} नगरपालिका सार्वत्रिक निवडणूक 2025
        </div>
        <p className="text-center font-bold text-sm bg-indigo-500 p-1 mt-1 rounded-md">
          {[
            panel.candidateAdhyakshParty?.trim(),
            panel.candidateAParty?.trim(),
            panel.candidateBParty?.trim(),
          ]
            .filter(
              (p, i, arr) =>
                p &&
                arr.findIndex((x) => x?.toLowerCase() === p.toLowerCase()) === i
            ) // remove duplicates ignoring case & empty
            .join(" / ")}{" "}
          नगरअध्यक्ष पदाचे अधिकृत उमेदवार
        </p>

        <div className="relative mt-2 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative z-10 flex items-center justify-center gap-3 p-2">
            <img
              src={panel.candidateAdhyakshPhoto}
              alt="adhyaksh"
              className="w-22 h-28 sm:w-28 sm:h-35 object-fill rounded-lg shadow-lg border  border-white"
            />
            <div className="leading-snug">
              <div className="flex flex-col xs:flex-row justify-around items-center">
                <h1
                  className="text-[22px] sm:text-[27px] pt-2 font-extrabold text-yellow-500"
                  style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
                >
                  {panel.candidateAdhyakshName}
                </h1>
              </div>
              <p className="text-white font-semibold sm:text-xs text-[10px]">
                डमी मतदान करण्यासाठी{" "}
                <span className="text-green-400 ">
                  {panel.candidateAdhyakshSymbolName}
                </span>{" "}
                या चिन्हासमोरील निळे बटन दाबावे.
              </p>

              <div className="bg-white text-black p-1 mt-2 rounded-md sm:text-xs text-[10px] font-semibold shadow">
                मतदानाच्या दिवशीसुद्धा{" "}
                <span className="text-red-600 font-bold">
                  {panel.candidateAdhyakshSymbolName}
                </span>{" "}
                या चिन्हासमोरील{" "}
                <span className="text-red-600 font-bold">
                  {panel.candidateAdhyakshSerialNo}
                </span>{" "}
                नंबरचे बटन दाबून <br />
                <span className="text-indigo-600 font-bold">
                  {panel.candidateAdhyakshName}
                </span>{" "}
                यांना प्रचंड बहूमतांनी विजयी करा.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/*   ADHYAKSH EVM TABLE  */}
      {/* ===================== */}
      <div className="mt-3 ">
        <div className="mt-2 overflow-x-auto rounded-t-md">
          <table className="min-w-full border text-[10px] sm:text-sm">
            <thead className="bg-[#086cae] text-white font-semibold">
              <tr>
                <th className="border border-gray-300 p-2 w-12 text-center">
                  अ.क्र.
                </th>
                <th className="border border-gray-300 p-2 w-48">
                  उमेदवाराचे नाव
                </th>
                <th className="border border-gray-300 p-2 text-center w-20">
                  चिन्ह
                </th>
                <th className="border border-gray-300 p-2 text-center w-20">
                  मत
                </th>
              </tr>
            </thead>
            <tbody>
              {startSerial > 1 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400">
                    ...
                  </td>
                </tr>
              )}

              {adhyakshRows.map((row, idx) => (
                <tr key={idx} className="border border-gray-300">
                  <td
                    className={`border border-gray-300 p-2 text-center font-semibold ${
                      row ? "text-2xl" : "text-xs"
                    }`}
                  >
                    {startSerial + idx}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {row ? (
                      <span className="truncate font-bold text-sm">
                        {row.candidateAdhyakshName}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {row ? (
                      <img
                        src={row.candidateAdhyakshSymbolImage}
                        alt="symbol"
                        className="w-10 h-10 sm:w-15 sm:h-15 mx-auto rounded-full border border-black"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {row ? (
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${
                            greenLight === "candidateAdhyakshVotes"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <button
                          onClick={() => handleVote("candidateAdhyakshVotes")}
                          className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white font-semibold text-xs sm:text-sm ${
                            !panel.multipleVotes &&
                            localStorage.getItem(
                              `panelVote_${panel._id}_candidateAdhyakshVotes`
                            )
                              ? ` bg-gray-400`
                              : `bg-blue-600`
                          }`}
                        >
                          बटन
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}

              {endSerial < totalCandidates && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400">
                    ...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="font-bold rounded-b mb-2 bg-amber-300 text-blue-700 text-sm">
        <span className="text-black">
          {panel?.candidateAdhyakshName} यांना एकूण मत:
        </span>{" "}
        {panel?.candidateAdhyakshVotes ?? 0}
      </div>

      <hr />

      {/* ===================== */}
      {/*   CANDIDATES A & B TABLE */}
      {/* ===================== */}
      <h2 className="text-center font-bold text-sm mt-2  bg-green-700 text-white p-1 rounded-md">
        <p className="text-center font-bold text-sm rounded-md">
          {[
            panel.candidateAdhyakshParty?.trim(),
            panel.candidateAParty?.trim(),
            panel.candidateBParty?.trim(),
          ]
            .filter(
              (p, i, arr) =>
                p &&
                arr.findIndex((x) => x?.toLowerCase() === p.toLowerCase()) === i
            ) // remove duplicates ignoring case & empty
            .join(" / ")}{" "}
          नगरसेवक पदाचे अधिकृत उमेदवार
        </p>
      </h2>

      {/* ===================== */}
      {/*   CANDIDATE A TABLE  */}
      {/* ===================== */}
      <div className="relative mt-2 rounded-lg overflow-hidden">
        <div className="relative z-10 flex items-center justify-center bg-linear-to-r from-purple-600 via-pink-500 to-red-500 gap-3 p-3 rounded-lg shadow-xl">
          <img
            src={panel.candidateAPhoto}
            alt="candidate A"
            className="w-20 h-24 sm:w-24 sm:h-30 object-fill rounded-lg shadow-lg border-2 border-white"
          />

          <div className="leading-snug text-center px-2">
            <div className="text-white rounded-md sm:text-xs text-[12px] bg-black/30 font-bold px-2 py-1">
              प्रभाग क्र.{" "}
              <span className="text-yellow-300 font-bold">
                {panel.wardNo} अ
              </span>{" "}
              मधील{" "}
              {panel.candidateAParty !== "no"
                ? "अधिकृत उमेदवार"
                : "अपक्ष उमेदवार"}
            </div>

            <h1
              className="text-[20px] sm:text-[26px] pt-2 font-extrabold text-yellow-300 leading-tight"
              style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
            >
              {panel.candidateAName}
            </h1>

            <p className="text-white font-semibold sm:text-xs  text-[10px] mt-1">
              डमी मतदान करण्यासाठी{" "}
              <span className="text-black text-sm font-bold">
                {panel.candidateASymbolName}
              </span>{" "}
              या चिन्हासमोरील निळे बटन दाबावे.
            </p>
          </div>
        </div>
      </div>

      {/* Candidate A Voting Table */}
      <div className="mt-3 overflow-x-auto rounded-t-md">
        <table className="min-w-full border text-[10px] sm:text-sm">
          <thead className="bg-[#086cae] text-white font-semibold">
            <tr>
              <th className="border border-gray-300 p-2 w-12 text-center">
                अ.क्र.
              </th>
              <th className="border border-gray-300 p-2 w-48">
                उमेदवाराचे नाव
              </th>
              <th className="border border-gray-300 p-2 text-center w-20">
                चिन्ह
              </th>
              <th className="border border-gray-300 p-2 text-center w-20">
                मत
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-2 text-2xl text-center font-semibold">
                {panel.candidateASerialNo}
              </td>
              <td className="border border-gray-300 text-lg p-2 font-bold">
                {panel.candidateAName}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <img
                  src={panel.candidateASymbolImage}
                  alt="symbol A"
                  className="w-10 h-10 sm:w-15 sm:h-15 mx-auto rounded-full border border-black"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${
                      greenLight === "candidateAVotes"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <button
                    onClick={() => handleVote("candidateAVotes")}
                    className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white font-semibold text-xs sm:text-sm ${
                      !panel.multipleVotes &&
                      localStorage.getItem(
                        `panelVote_${panel._id}_candidateAVotes`
                      )
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600"
                    }`}
                    disabled={
                      !panel.multipleVotes &&
                      !!localStorage.getItem(
                        `panelVote_${panel._id}_candidateAVotes`
                      )
                    }
                  >
                    बटन
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="font-bold rounded-b-lg mb-2 bg-amber-200 text-blue-700 text-sm p-2">
        {" "}
        <span className="text-black">
          {" "}
          {panel?.candidateAName} यांना एकूण मत:{" "}
        </span>{" "}
        {panel?.candidateAVotes ?? 0} <br />{" "}
      </div>

      <hr />

      {/* ===================== */}
      {/*   CANDIDATE B TABLE  */}
      {/* ===================== */}
      <div className="relative mt-2 rounded-lg overflow-hidden">
        <div className="relative z-10 flex items-center justify-center bg-linear-to-r from-purple-600 via-pink-500 to-red-500 gap-3 p-3 rounded-lg shadow-xl">
          <img
            src={panel.candidateBPhoto}
            alt="candidate B"
            className="w-20 h-24 sm:w-24 sm:h-30 object-fill rounded-lg shadow-lg border-2 border-white"
          />

          <div className="leading-snug text-center px-2">
            <div className="text-white rounded-md sm:text-xs text-[12px] bg-black/30 font-bold px-2 py-1">
              प्रभाग क्र.{" "}
              <span className="text-yellow-300 font-bold">
                {panel.wardNo} ब
              </span>{" "}
              मधील{" "}
              {panel.candidateBParty !== "no"
                ? "अधिकृत उमेदवार"
                : "अपक्ष उमेदवार"}
            </div>

            <h1
              className="text-[20px] sm:text-[26px] pt-2 font-extrabold text-yellow-300 leading-tight"
              style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
            >
              {panel.candidateBName}
            </h1>

            <p className="text-white font-semibold sm:text-xs text-[10px] mt-1">
              डमी मतदान करण्यासाठी{" "}
              <span className="text-black text-sm font-bold">
                {panel.candidateBSymbolName}
              </span>{" "}
              या चिन्हासमोरील निळे बटन दाबावे.
            </p>
          </div>
        </div>
      </div>

      {/* Candidate B Voting Table */}
      <div className="mt-3 overflow-x-auto rounded-t-md">
        <table className="min-w-full border text-[10px] sm:text-sm">
          <thead className="bg-[#086cae] text-white font-semibold">
            <tr>
              <th className="border border-gray-300 p-2 w-12 text-center">
                अ.क्र.
              </th>
              <th className="border border-gray-300 p-2 w-48">
                उमेदवाराचे नाव
              </th>
              <th className="border border-gray-300 p-2 text-center w-20">
                चिन्ह
              </th>
              <th className="border border-gray-300 p-2 text-center w-20">
                मत
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-2 text-center text-2xl font-semibold">
                {panel.candidateBSerialNo}
              </td>
              <td className="border border-gray-300 text-lg p-2 font-bold">
                {panel.candidateBName}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <img
                  src={panel.candidateBSymbolImage}
                  alt="symbol B"
                  className="w-10 h-10 sm:w-15 sm:h-15 mx-auto rounded-full border border-black"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${
                      greenLight === "candidateBVotes"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <button
                    onClick={() => handleVote("candidateBVotes")}
                    className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white font-semibold text-xs sm:text-sm ${
                      !panel.multipleVotes &&
                      localStorage.getItem(
                        `panelVote_${panel._id}_candidateBVotes`
                      )
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600"
                    }`}
                    disabled={
                      !panel.multipleVotes &&
                      !!localStorage.getItem(
                        `panelVote_${panel._id}_candidateBVotes`
                      )
                    }
                  >
                    बटन
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="font-bold rounded-b-lg bg-amber-200 text-blue-700 text-sm p-2">
        {" "}
        <span className="text-black">
          {" "}
          {panel?.candidateBName} यांना एकूण मत:{" "}
        </span>{" "}
        {panel?.candidateBVotes ?? 0}{" "}
      </div>

      {/* TOTAL VOTES */}
      <div className="mt-4 p-2 sm:p-2 bg-green-600 text-white text-center font-bold text-sm sm:text-lg rounded-md mx-3 sm:mx-4 mb-3">
        एकूण मते:{" "}
        {(panel.candidateAVotes ?? 0) +
          (panel.candidateBVotes ?? 0) +
          (panel.candidateAdhyakshVotes ?? 0)}
      </div>

      {/* POSTER BUTTON */}
      {panel.candidatePoster && (
        <button
          onClick={() => {
            localStorage.removeItem("posterShown");
            setShowPoster(true);
          }}
          className="
    mx-auto mb-4 px-4 py-2 
    bg-blue-600 text-white text-xs font-semibold 
    rounded-full shadow-md hover:bg-blue-700 
    transition-all duration-200 block
  "
        >
          पोस्टर पहा
        </button>
      )}

      <div className="bg-white border-2 text-black p-1 mt-2 rounded-md sm:text-xs text-[10px] font-semibold shadow">
        मतदानाच्या दिवशीसुद्धा दोन्ही EVM मशीन वरील{" "}
        <span className="text-red-600 font-bold">
          {panel.candidateASymbolName}
          {panel.candidateBSymbolName !== panel.candidateASymbolName &&
            " / " + panel.candidateBSymbolName}
          {panel.candidateAdhyakshSymbolName !== panel.candidateASymbolName &&
            panel.candidateAdhyakshSymbolName !== panel.candidateBSymbolName &&
            " / " + panel.candidateAdhyakshSymbolName}
        </span>{" "}
        या चिन्हासमोरील बटन दाबून <br />
        आमच्या तिनही उमेदवारांना प्रचंड बहूमतांनी विजयी करा.
      </div>

      {/* DATE */}
      <div className="w-full text-xs bg-[#086cae] rounded-2xl mt-2">
        <p
          className="text-white font-semibold text-[13px] pt-2 pb-1"
          style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
        >
          मतदान दि. 02 डिसेंबर 2025 - वेळ: सकाळी 07:00 ते सायं. 05:30 पर्यंत
        </p>
      </div>

      {/* POPUP */}
      {popupMsg && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/70 absolute inset-0"></div>

          <div
            className="bg-white rounded-xl p-4 mx-4 z-10 text-center shadow-2xl space-y-3"
            style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
          >
            <h2 className="text-xl font-bold text-green-600">धन्यवाद! 🗳️</h2>

            <div className="bg-white border-2 text-black p-1 mt-2 rounded-md sm:text-xs text-[10px] font-semibold shadow">
              मतदानाच्या दिवशीसुद्धा दोन्ही EVM मशीन वरील{" "}
              <span className="text-red-600 font-bold">
                {panel.candidateASymbolName}
                {panel.candidateBSymbolName !== panel.candidateASymbolName &&
                  " / " + panel.candidateBSymbolName}
                {panel.candidateAdhyakshSymbolName !==
                  panel.candidateASymbolName &&
                  panel.candidateAdhyakshSymbolName !==
                    panel.candidateBSymbolName &&
                  " / " + panel.candidateAdhyakshSymbolName}
              </span>{" "}
              या चिन्हासमोरील बटन दाबून <br />
              आमच्या तिनही उमेदवारांना प्रचंड बहूमतांनी विजयी करा.
            </div>
            <div className="w-full text-xs bg-[#086cae] rounded-2xl mt-2">
              <p
                className="text-white font-semibold text-[13px] p-2 "
                style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
              >
                मतदान दि. 02 डिसेंबर 2025 - वेळ: सकाळी 07:00 ते सायं. 05:30
                पर्यंत
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelEvmPage;
