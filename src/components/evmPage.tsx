import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCandidateById,
  type CandidateResponse,
  updateCandidateVotes,
} from "../services/Candidate";

const EvmPage = () => {
  const { id } = useParams(); // from /evm/:id
  const storedVote = localStorage.getItem("hasVoted");
  const [green, setGreen] = useState(false);
  const [candidates, setCandidates] = useState<CandidateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState<string | null>(storedVote);
  const [popupCandidate, setPopupCandidate] = useState<string | null>(null);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const res = await getCandidateById(id!);

        if (res.success && res.data) {
          const dataArray = Array.isArray(res.data) ? res.data : [res.data];
          setCandidates(dataArray);
        } else {
          console.error("Failed to fetch candidates:", res.message);
        }
      } catch (err) {
        console.error("Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [id]);

  const handleVote = async (candidateId: string) => {
    if (voted) return; // prevent revoting

    const candidate = candidates.find((c) => c._id === candidateId);
    if (!candidate) return;

    try {
      // Increment votes on backend
      const newVotes = (candidate.votes ?? 0) + 1;
      const res = await updateCandidateVotes(candidateId, newVotes);
      if (!res.success) {
        console.error("Vote update failed:", res.message);
        return;
      }

      // Mark as voted immediately
      setVoted(candidateId);
      setGreen(true);
      localStorage.setItem("hasVoted", candidateId);

      // Play vote sound immediately
      const audio = new Audio("/sounds/censor-beep.mp3");
      audio.play().catch((err) => console.error("Audio play failed:", err));

      // Keep dot green for 3 seconds
      setTimeout(() => {
        setGreen(false);

        // Update state to reflect new votes
        setCandidates((prev) =>
          prev.map((c) =>
            c._id === candidateId ? { ...c, votes: newVotes } : c
          )
        );

        // Show popup after dot turns red
        setPopupCandidate(candidate.candidateName);

        // Auto-hide popup after 3.5 seconds
        setTimeout(() => setPopupCandidate(null), 3500);
      }, 3000);
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!id)
    return <div className="p-4 text-center text-xl">Invalid Link ❌</div>;

  const banner = candidates[0];

  if (!banner) {
    return (
      <div className="p-4 text-center text-gray-500">No candidates found</div>
    );
  }

  // Build 10 fixed rows
  const fixedRows = Array.from({ length: 11 }, (_, i) => {
    const serial = i + 1;
    return candidates.find((c) => Number(c.serialNo) === serial) || null;
  });

  return (
    <>
      {candidates.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No candidates found</div>
      ) : (
        <div className="w-full p-2 mx-auto bg-white shadow rounded-md overflow-hidden">
          {/* HEADER & MAIN BANNER */}
          <div className="w-full bg-[#086cae] text-white p-2 rounded-lg overflow-hidden">
            <div
              className="bg-white sm:text-lg text-[15px] text-black font-bold text-center pt-2 rounded-md shadow"
              style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
            >
              {banner.constituency} नगरपालिका सार्वत्रिक निवडणूक २०२५
            </div>

            <div className="relative mt-2 rounded-lg overflow-hidden">
              {/* <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage: `url('/bg.png')`,
                  backgroundSize: "auto 100%", // height fits div, width scales automatically
                  backgroundRepeat: "no-repeat",
                }}
              ></div> */}
              <div className="absolute inset-0 bg-black/10"></div>

              <div className="relative z-10 flex items-center gap-2 p-2">
                <img
                  src={banner.candidatePhoto}
                  alt="candidate"
                  className="w-22 h-28 sm:w-28 sm:h-35 object-cover rounded-lg shadow-lg border border-white"
                />
                <div className="leading-snug">
                  <div className=" text-white rounded-md sm:text-xs text-[10px] font-bold">
                    प्रभाग क्र.{" "}
                    <span className="text-red-300 font-bold">
                      {banner.wardNo}
                    </span>{" "}
                    मधील{" "}
                    <span className="text-green-400 font-bold">
                      {banner.party}
                    </span>
                    चे अधिकृत उमेदवार
                  </div>
                  <div className="flex flex-col xs:flex-row justify-around items-center gap-1">
                    <h1
                      className="text-[22px] sm:text-[27px] pt-2 font-extrabold text-yellow-500"
                      style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
                    >
                      {banner.candidateName}
                    </h1>
                  </div>
                  <p className="text-white font-semibold sm:text-xs text-[10px]">
                    डमी मतदान करण्यासाठी{" "}
                    <span className="text-green-400 ">{banner.symbolName}</span>{" "}
                    या चिन्हासमोरील निळे बटन दाबावे.
                  </p>
                  <div className="bg-white text-black p-1 mt-2 rounded-md sm:text-xs text-[10px] font-semibold shadow">
                    मतदानाच्या दिवशीसुद्धा{" "}
                    <span className="text-red-600 font-bold">
                      {banner.symbolName}
                    </span>{" "}
                    या चिन्हासमोरील बटन दाबून{" "}
                    <span className="text-indigo-600 font-bold">
                      {banner.candidateName}
                    </span>{" "}
                    यांना प्रचंड बहूमतांनी विजयी करा.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DATE */}
          <div className="w-full text-xs bg-[#086cae] rounded-2xl mt-2">
            <p className="text-white font-semibold text-[10px] p-2">
              मतदान दिनांक: ०२ डिसेंबर २०२५, वेळ: सकाळी ०७:०० ते सायं. ०५:००
            </p>
          </div>

          {/* EVM TABLE */}
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
                {fixedRows.map((c, idx) => (
                  <tr key={idx} className="border border-gray-300">
                    <td className="border border-gray-300 p-2 text-center font-semibold">
                      {idx + 1}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {c ? (
                        <span className="truncate font-bold text-sm">
                          {c.candidateName}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {c ? (
                        <img
                          src={c.symbolImage}
                          alt="symbol"
                          className="w-10 h-10 sm:w-15 sm:h-15 mx-auto rounded-full border border-black"
                        />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {c ? (
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${
                              voted === c._id && green
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <button
                            disabled={voted !== null}
                            onClick={() => handleVote(c._id)}
                            className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white font-semibold text-xs sm:text-sm ${
                              voted ? "bg-gray-400" : "bg-blue-600"
                            }`}
                          >
                            Vote
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTAL VOTES */}
          <div className="mt-4 p-2 sm:p-2 bg-green-600 text-white text-center font-bold text-sm sm:text-lg rounded-md mx-3 sm:mx-4 mb-3">
            एकूण मते:{" "}
            {candidates.reduce((acc, cur) => acc + (cur.votes ?? 0), 0)}
          </div>

          {voted && (
            <p className="text-gray-400 text-[10px] p-2 italic">
              तुम्ही या किंवा इतर कोणत्याही उमेदवाराला आधीच मतदान केले आहे,
              त्यामुळे तुम्हाला पुन्हा मतदान करण्याची परवानगी नाही. धन्यवाद..!
            </p>
          )}

          {/* POPUP */}
          {popupCandidate && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-black/70 absolute inset-0"></div>
              <div
                className="bg-white rounded-lg p-6 z-10 text-center shadow-lg"
                style={{ fontFamily: "'Anek Devanagari', sans-serif" }}
              >
                <h2 className="text-lg font-bold text-green-600">
                  धन्यवाद! 🗳️
                </h2>
                <p className="mt-2 text-md">
                  आपण{" "}
                  <span className="font-semibold text-blue-600">
                    {popupCandidate}
                  </span>{" "}
                  यांना आपले अमूल्य मत दिल्या बद्दल धन्यवाद.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EvmPage;
