import { useState } from "react";
import {
  createCandidate,
  type CreateCandidateDto,
} from "../../services/Candidate";

export function CandidateForm() {
  const [candidateName, setCandidateName] = useState("");
  const [symbolName, setSymbolName] = useState("");
  const [party, setParty] = useState("");
  const [constituency, setConstituency] = useState("");
  const [serialNo, setSerialNo] = useState<number | "">("");
  const [wardNo, setWardNo] = useState("");
  const [candidatePhoto, setCandidatePhoto] = useState<File | null>(null);
  const [candidatePoster, setCandidatePoster] = useState<File | null>(null);

  const [symbolImage, setSymbolImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidatePhoto || !symbolImage) {
      alert("Please upload both candidate photo & symbol image!");
      return;
    }

    if (!serialNo || Number(serialNo) < 1 || Number(serialNo) > 19) {
      alert("SerialNo must be between 1–19");
      return;
    }

    const dto: CreateCandidateDto = {
      candidateName,
      symbolName,
      party,
      constituency,
      serialNo: Number(serialNo),
      wardNo,
      candidatePhoto,
      candidatePoster: candidatePoster!,
      symbolImage,
    };

    const result = await createCandidate(dto);

    if (result.success) {
      alert("Candidate created successfully!");
      setCandidateName("");
      setSymbolName("");
      setParty("");
      setConstituency("");
      setSerialNo("");
      setCandidatePhoto(null);
      setCandidatePoster(null);
      setWardNo("");
      setSymbolImage(null);
    } else {
      alert(result.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center w-full py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl space-y-5 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create New Candidate
        </h2>

        {/* Input Component */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Candidate Name</label>
          <input
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter candidate name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Symbol Name</label>
          <input
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter symbol name"
            value={symbolName}
            onChange={(e) => setSymbolName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Party Name</label>
          <input
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter party name"
            value={party}
            onChange={(e) => setParty(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Ward Number</label>
          <input
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter ward number"
            value={wardNo}
            onChange={(e) => setWardNo(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Constituency</label>
          <input
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter constituency"
            value={constituency}
            onChange={(e) => setConstituency(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Serial No (1–19)</label>
          <input
            type="number"
            min={1}
            max={19}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter serial number"
            value={serialNo}
            onChange={(e) =>
              setSerialNo(e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Candidate Photo</label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded-lg"
            onChange={(e) =>
              e.target.files && setCandidatePhoto(e.target.files[0])
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Candidate Poster</label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded-lg"
            onChange={(e) =>
              e.target.files && setCandidatePoster(e.target.files[0])
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Symbol Image</label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded-lg"
            onChange={(e) =>
              e.target.files && setSymbolImage(e.target.files[0])
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
        >
          Create Candidate
        </button>
      </form>
    </div>
  );
}
