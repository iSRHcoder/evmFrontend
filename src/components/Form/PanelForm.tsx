import { useState } from "react";
import { createPanel, type CreatePanelDto } from "../../services/panel.ts";

export function PanelForm() {
  const [constituency, setConstituency] = useState("");
  const [wardNo, setWardNo] = useState("");
  const [multipleVotes, setMultipleVotes] = useState(false);

  // Candidate A
  const [candidateAName, setCandidateAName] = useState("");
  const [candidateASerialNo, setCandidateASerialNo] = useState<number | "">("");
  const [candidateAParty, setCandidateAParty] = useState("");
  const [candidateASymbolName, setCandidateASymbolName] = useState("");
  const [candidateAPhoto, setCandidateAPhoto] = useState<File | null>(null);
  const [candidateASymbolImage, setCandidateASymbolImage] =
    useState<File | null>(null);

  // Candidate B
  const [candidateBName, setCandidateBName] = useState("");
  const [candidateBSerialNo, setCandidateBSerialNo] = useState<number | "">("");
  const [candidateBParty, setCandidateBParty] = useState("");
  const [candidateBSymbolName, setCandidateBSymbolName] = useState("");
  const [candidateBPhoto, setCandidateBPhoto] = useState<File | null>(null);
  const [candidateBSymbolImage, setCandidateBSymbolImage] =
    useState<File | null>(null);

  // Adhyaksh
  const [candidateAdhyakshName, setCandidateAdhyakshName] = useState("");
  const [candidateAdhyakshSerialNo, setCandidateAdhyakshSerialNo] = useState<
    number | ""
  >("");
  const [candidateAdhyakshParty, setCandidateAdhyakshParty] = useState("");
  const [candidateAdhyakshSymbolName, setCandidateAdhyakshSymbolName] =
    useState("");
  const [candidateAdhyakshPhoto, setCandidateAdhyakshPhoto] =
    useState<File | null>(null);
  const [candidateAdhyakshSymbolImage, setCandidateAdhyakshSymbolImage] =
    useState<File | null>(null);

  const [candidatePoster, setCandidatePoster] = useState<File | null>(null);

  const validateSerial = (value: number | "") =>
    value !== "" && value >= 1 && value <= 50;

  const validateAdhyakshSerial = (value: number | "") =>
    value !== "" && value >= 1 && value <= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!constituency || !wardNo) {
      alert("Constituency & Ward Number are required");
      return;
    }

    if (
      !validateSerial(candidateASerialNo) ||
      !validateSerial(candidateBSerialNo) ||
      !validateAdhyakshSerial(candidateAdhyakshSerialNo)
    ) {
      alert("Serial numbers are invalid");
      return;
    }

    if (
      !candidateAPhoto ||
      !candidateBPhoto ||
      !candidateAdhyakshPhoto ||
      !candidateASymbolImage ||
      !candidateBSymbolImage ||
      !candidateAdhyakshSymbolImage
    ) {
      alert("Please upload all required photos!");
      return;
    }

    const dto: CreatePanelDto = {
      constituency,
      wardNo,
      multipleVotes,

      candidateAName,
      candidateASerialNo: Number(candidateASerialNo),
      candidateAParty,
      candidateASymbolName,
      candidateAPhoto,
      candidateASymbolImage,

      candidateBName,
      candidateBSerialNo: Number(candidateBSerialNo),
      candidateBParty,
      candidateBSymbolName,
      candidateBPhoto,
      candidateBSymbolImage,

      candidateAdhyakshName,
      candidateAdhyakshSerialNo: Number(candidateAdhyakshSerialNo),
      candidateAdhyakshParty,
      candidateAdhyakshSymbolName,
      candidateAdhyakshPhoto,
      candidateAdhyakshSymbolImage,

      candidatePoster: candidatePoster ?? undefined,
    };

    const result = await createPanel(dto);

    if (result.success) {
      alert("Panel created successfully!");
      window.location.reload();
    } else {
      alert(result.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center w-full py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Create Panel
        </h2>

        {/* Basic */}
        <div className="flex flex-col gap-2">
          <label>Constituency</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={constituency}
            onChange={(e) => setConstituency(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Ward Number</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={wardNo}
            onChange={(e) => setWardNo(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Multiple Votes</label>
          <input
            type="checkbox"
            checked={multipleVotes}
            onChange={(e) => setMultipleVotes(e.target.checked)}
          />
        </div>

        <hr />

        {/* Candidate A */}
        <h3 className="text-xl font-semibold">Candidate A</h3>

        <div className="flex flex-col gap-2">
          <label>Name</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={candidateAName}
            onChange={(e) => setCandidateAName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Serial No (1–50)</label>
          <input
            type="number"
            min={1}
            max={50}
            className="px-3 py-2 border rounded-lg"
            value={candidateASerialNo}
            onChange={(e) =>
              setCandidateASerialNo(
                e.target.value ? Number(e.target.value) : ""
              )
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Party</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={candidateAParty}
            onChange={(e) => setCandidateAParty(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Symbol Name</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={candidateASymbolName}
            onChange={(e) => setCandidateASymbolName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Candidate Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && setCandidateAPhoto(e.target.files[0])
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Symbol Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && setCandidateASymbolImage(e.target.files[0])
            }
          />
        </div>

        <hr />

        {/* Candidate B */}
        <h3 className="text-xl font-semibold">Candidate B</h3>

        <div className="flex flex-col gap-2">
          <label>Name</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={candidateBName}
            onChange={(e) => setCandidateBName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Serial No (1–50)</label>
          <input
            type="number"
            min={1}
            max={50}
            className="px-3 py-2 border rounded-lg"
            value={candidateBSerialNo}
            onChange={(e) =>
              setCandidateBSerialNo(
                e.target.value ? Number(e.target.value) : ""
              )
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Party</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={candidateBParty}
            onChange={(e) => setCandidateBParty(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Symbol Name</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={candidateBSymbolName}
            onChange={(e) => setCandidateBSymbolName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Candidate Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && setCandidateBPhoto(e.target.files[0])
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Symbol Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && setCandidateBSymbolImage(e.target.files[0])
            }
          />
        </div>

        <hr />

        {/* Adhyaksh */}
        <h3 className="text-xl font-semibold">Adhyaksh (President)</h3>

        <div className="flex flex-col gap-2">
          <label>Name</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={candidateAdhyakshName}
            onChange={(e) => setCandidateAdhyakshName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Serial No (1–20)</label>
          <input
            type="number"
            min={1}
            max={20}
            className="px-3 py-2 border rounded-lg"
            value={candidateAdhyakshSerialNo}
            onChange={(e) =>
              setCandidateAdhyakshSerialNo(
                e.target.value ? Number(e.target.value) : ""
              )
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Party</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={candidateAdhyakshParty}
            onChange={(e) => setCandidateAdhyakshParty(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Symbol Name</label>
          <input
            className="px-3 py-2 border rounded-lg"
            value={candidateAdhyakshSymbolName}
            onChange={(e) => setCandidateAdhyakshSymbolName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Candidate Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && setCandidateAdhyakshPhoto(e.target.files[0])
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Symbol Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files &&
              setCandidateAdhyakshSymbolImage(e.target.files[0])
            }
          />
        </div>

        {/* Optional poster */}
        <hr />
        <h3 className="text-lg font-semibold">Optional Poster</h3>

        <div className="flex flex-col gap-2">
          <label>Poster Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && setCandidatePoster(e.target.files[0])
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg"
        >
          Create Panel
        </button>
      </form>
    </div>
  );
}
