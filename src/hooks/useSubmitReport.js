import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/Firebase.js";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";
import { UserContext } from "../context/AuthContext.jsx";
import { ToastStrings } from "../constants/ToastStrings.js";
import { ReportModel } from "../Models/ReportModel.js";

export const useSubmitReport = () => {
  const toast = useToast();

  const { user } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitReport = async (detail, postID, report) => {
    setError(null);
    console.log(detail, postID, report);

    try {
      setIsSubmitting(true);

      const reportModel = new ReportModel(user?.uid, detail, postID, report);
      await addDoc(collection(db, "Reports"), { ...reportModel });

      toast({
        title: "Report Submitted successfully!",
        status: "success",
        duration: ToastStrings.duration,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error Submitting Report:", error);
      setError(
        "An error occurred while Submitting the Report. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitReport, isSubmitting, error };
};
