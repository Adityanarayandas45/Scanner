"use client";

import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper,
  LinearProgress,
  Typography,
} from "@mui/material";
import "@/app/assets/form.css";

const questions: string[] = [
  "What is your full name?",
  "What is your highest qualification?",
  "What field of study did you specialize in?",
  "Which institution did you attend?",
  "Are you currently employed?",
  "What is your current job title?",
  "How many years of professional experience do you have?",
  "What are your key skills or areas of expertise?",
  "What are your short-term career goals?",
  "What type of role are you looking for?"
]

const StepperForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<string[]>(
    Array(questions.length).fill("")
  );
  const progressPercent = aiSummary
  ? 100
  : Math.round((activeStep / questions.length) * 100);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const updatedData = [...formData];
    updatedData[activeStep] = e.target.value;
    setFormData(updatedData);

    if (e.target.value.trim() !== "") {
      setError("");
    }
  };

  const handleNext = (): void => {
    if (!formData[activeStep].trim()) {
      setError("This field is required");
      return;
    }
    setError("");
    if (activeStep < questions.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = (): void => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
    setError("");
  };

  const handleSubmit = async (): Promise<void> => {
    const hasEmptyField = formData.some((a) => !a.trim());

    if (hasEmptyField) {
      alert("Please complete all questions before submitting.");
      return;
    }

    const finalData = questions.map((question, index) => ({
      question,
      answer: formData[index],
    }));

    try {
      setLoading(true);

      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: finalData }),
      });

      const data = await response.json();

      setAiSummary(data.summary);

    } catch (error) {
      alert("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="survey-center-wrapper">
      <Paper elevation={5} className="survey-card p-4">


        <Box sx={{ width: "100%", mb: 3 }}>
          <Stepper 
            activeStep={aiSummary ? questions.length : activeStep}
            sx={{ transition: "all 0.4s ease" }}
          >
            {questions.map((_, index) => (
              <Step
                key={index}
                completed={aiSummary ? true : index < activeStep}
              >
                <StepLabel>Q{index + 1}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 8,
                borderRadius: 5,
                width: "100%",
              }}
            />

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                textAlign: "left",
              }}
            >
              {progressPercent}%
            </Typography>
          </Box>
        </Box>
        {aiSummary ? (

          <Paper elevation={4} className="summary-card p-4">
            <h3 className="mb-3">Professional Summary</h3>

            <p style={{ lineHeight: "1.6" }}>
              {aiSummary}
            </p>

            <Button
              variant="contained"
              className="mt-3"
              onClick={() => {
                setAiSummary(null);
                setActiveStep(0);
                setFormData(Array(questions.length).fill(""));
              }}
            >
              Start Again
            </Button>
          </Paper>

        ) : (

          <>
            <Typography variant="h6" mb={2}>
              {questions[activeStep]}
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              value={formData[activeStep]}
              onChange={handleChange}
              placeholder="Your answer..."
              error={Boolean(error)}
              helperText={error}
            />

            <Box
              display="flex"
              justifyContent="space-between"
              mt={3}
            >
              <Button
                variant="text"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Prev
              </Button>

              {activeStep === questions.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </>

        )}
      </Paper>
    </div>
  );
};

export default StepperForm;