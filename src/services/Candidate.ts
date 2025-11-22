import axios from "axios";
import api from "../lib/axios";

export interface CreateCandidateDto {
  candidateName: string;
  symbolName: string;
  constituency: string;
  serialNo: number;
  party: string;
  multipleVotes: boolean;
  wardNo: string;
  candidatePhoto: File; // file from input
  candidatePoster?: File | null;
  symbolImage: File; // file from input
}

export interface CandidateResponse {
  _id: string;
  candidateName: string;
  symbolName: string;
  constituency: string;
  votes?: number;
  electionDate?: string;
  serialNo: string;
  party: string;
  multipleVotes: boolean;
  wardNo: string;
  candidatePhoto: string; // URL
  symbolImage: string; // URL
  candidatePoster: string; // URL
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export type CandidateListResponse = ApiResponse<CandidateResponse[]>;
export type SingleCandidateResponse = ApiResponse<CandidateResponse>;

export const createCandidate = async (
  candidate: CreateCandidateDto
): Promise<ApiResponse<CandidateResponse>> => {
  try {
    const formData = new FormData();
    formData.append("candidateName", candidate.candidateName);
    formData.append("symbolName", candidate.symbolName);
    formData.append("constituency", candidate.constituency);
    formData.append("serialNo", String(candidate.serialNo));
    formData.append("party", candidate.party);
    formData.append(
      "multipleVotes",
      candidate.multipleVotes ? "true" : "false"
    );

    formData.append("wardNo", candidate.wardNo);
    formData.append("candidatePhoto", candidate.candidatePhoto);
    if (candidate.candidatePoster) {
      formData.append("candidatePoster", candidate.candidatePoster);
    }
    formData.append("symbolImage", candidate.symbolImage);

    const response = await api.post<ApiResponse<CandidateResponse>>(
      "/api/candidates/create",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Create candidate API error:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Axios error occurred",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
};

export const getAllCandidates = async (): Promise<CandidateListResponse> => {
  try {
    const response = await api.get<CandidateListResponse>("/api/candidates");
    return response.data;
  } catch (error) {
    console.error("Get all candidates error:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch candidates",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
};

export const getCandidateById = async (
  id: string
): Promise<SingleCandidateResponse> => {
  try {
    const response = await api.get<SingleCandidateResponse>(
      `/api/candidates/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Get candidate by ID error:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch candidate",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
};

export const updateCandidateVotes = async (
  id: string,
  votes: number
): Promise<ApiResponse<CandidateResponse>> => {
  try {
    const response = await api.patch<ApiResponse<CandidateResponse>>(
      `/api/candidates/vote/${id}`,
      { votes }
    );

    return response.data;
  } catch (error) {
    console.error("Update candidate votes error:", error);

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

export const deleteCandidate = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>(
      `/api/candidates/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Delete candidate error:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete candidate",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
};
