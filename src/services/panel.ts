import axios from "axios";
import api from "../lib/axios";

// -------------------------
// DTOs & Response Types
// -------------------------

export interface CreatePanelDto {
  // Election meta
  constituency: string;
  wardNo: string;
  multipleVotes: boolean;

  // Candidate A
  candidateAName: string;
  candidateASerialNo: number;
  candidateAParty: string;
  candidateASymbolName: string;
  candidateAPhoto: File;
  candidateASymbolImage: File;

  // Candidate B
  candidateBName: string;
  candidateBSerialNo: number;
  candidateBParty: string;
  candidateBSymbolName: string;
  candidateBPhoto: File;
  candidateBSymbolImage: File;

  // Candidate Adhyaksh
  candidateAdhyakshName: string;
  candidateAdhyakshSerialNo: number;
  candidateAdhyakshParty: string;
  candidateAdhyakshSymbolName: string;
  candidateAdhyakshPhoto: File;
  candidateAdhyakshSymbolImage: File;

  // Optional
  candidatePoster?: File | null;
}

export interface PanelResponse {
  _id: string;

  // serials
  candidateASerialNo: number;
  candidateBSerialNo: number;
  candidateAdhyakshSerialNo: number;

  multipleVotes: boolean;

  // names
  candidateAdhyakshName: string;
  candidateAName: string;
  candidateBName: string;

  // photos
  candidateAPhoto: string;
  candidateBPhoto: string;
  candidateAdhyakshPhoto: string;
  candidatePoster?: string | null;

  // symbols
  candidateASymbolName: string;
  candidateBSymbolName: string;
  candidateAdhyakshSymbolName: string;
  candidateASymbolImage: string;
  candidateBSymbolImage: string;
  candidateAdhyakshSymbolImage: string;

  // location
  constituency: string;
  wardNo: string;

  // votes
  candidateAdhyakshVotes: number;
  candidateAVotes: number;
  candidateBVotes: number;

  // parties
  candidateAParty: string;
  candidateBParty: string;
  candidateAdhyakshParty: string;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export type SinglePanelResponse = ApiResponse<PanelResponse>;

// -------------------------
// Create Panel
// -------------------------
export const createPanel = async (
  panel: CreatePanelDto
): Promise<ApiResponse<PanelResponse>> => {
  try {
    const formData = new FormData();

    // Election meta
    formData.append("constituency", panel.constituency);
    formData.append("wardNo", panel.wardNo);
    formData.append("multipleVotes", panel.multipleVotes ? "true" : "false");

    // Candidate A
    formData.append("candidateAName", panel.candidateAName);
    formData.append("candidateASerialNo", String(panel.candidateASerialNo));
    formData.append("candidateAParty", panel.candidateAParty);
    formData.append("candidateASymbolName", panel.candidateASymbolName);
    formData.append("candidateAPhoto", panel.candidateAPhoto);
    formData.append("candidateASymbolImage", panel.candidateASymbolImage);

    // Candidate B
    formData.append("candidateBName", panel.candidateBName);
    formData.append("candidateBSerialNo", String(panel.candidateBSerialNo));
    formData.append("candidateBParty", panel.candidateBParty);
    formData.append("candidateBSymbolName", panel.candidateBSymbolName);
    formData.append("candidateBPhoto", panel.candidateBPhoto);
    formData.append("candidateBSymbolImage", panel.candidateBSymbolImage);

    // Adhyaksh
    formData.append("candidateAdhyakshName", panel.candidateAdhyakshName);
    formData.append(
      "candidateAdhyakshSerialNo",
      String(panel.candidateAdhyakshSerialNo)
    );
    formData.append("candidateAdhyakshParty", panel.candidateAdhyakshParty);
    formData.append(
      "candidateAdhyakshSymbolName",
      panel.candidateAdhyakshSymbolName
    );
    formData.append("candidateAdhyakshPhoto", panel.candidateAdhyakshPhoto);
    formData.append(
      "candidateAdhyakshSymbolImage",
      panel.candidateAdhyakshSymbolImage
    );

    // Optional poster
    if (panel.candidatePoster) {
      formData.append("candidatePoster", panel.candidatePoster);
    }

    const response = await api.post<ApiResponse<PanelResponse>>(
      "/api/panel/create",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Create panel API error:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Axios error occurred while creating panel",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
};

// -------------------------
// Get Panel by ID
// -------------------------
export const getPanelById = async (
  id: string
): Promise<SinglePanelResponse> => {
  try {
    const response = await api.get<SinglePanelResponse>(`/api/panel/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get panel by ID error:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch panel",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
};

// -------------------------
// Update Panel Votes
// -------------------------
export const updatePanelVotes = async (
  id: string,
  type: "A" | "B" | "ADHYAKSH",
  votes: number
): Promise<ApiResponse<PanelResponse>> => {
  try {
    // NEW DYNAMIC URL based on your updated backend route
    const url = `/api/panel/vote/${id}/${type}`;

    const response = await api.patch<ApiResponse<PanelResponse>>(url, {
      votes, // backend expects: { votes: number }
    });

    return response.data;
  } catch (error) {
    console.error("Update panel votes error:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update votes",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
};
