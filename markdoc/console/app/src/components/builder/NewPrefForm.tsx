import React, { useState } from 'react';
import { CreatedPref } from './types';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { DbData } from '../../db/types';
import PrefIdSelector from './PrefIdSelector';

interface Step {
  label: string;
  completed: boolean;
}

export default function NewPrefForm(props: {
  pref: CreatedPref;
  allowlist: DbData['allowlist'];
  // onPrefChange: (pref: CreatedPref) => void;
}) {
  const { pref, allowlist } = props;

  const [localPref, setLocalPref] = useState<CreatedPref>(pref);

  const [steps, setSteps] = useState<Step[]>([
    { label: 'Choose the pref', completed: false },
    { label: 'Choose the options', completed: false }
  ]);

  const [activeStep, setActiveStep] = React.useState(0);

  const markStepCompleted = (stepIndex: number) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].completed = true;
    setSteps(updatedSteps);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div style={{ borderTop: '1px solid black', marginTop: '30px' }}>
      <h2>Add a choice to the page</h2>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {activeStep === 0 && (
                  <PrefIdSelector
                    pref={pref}
                    onCompleted={(pref: CreatedPref) => {
                      markStepCompleted(0);
                      setLocalPref(pref);
                    }}
                    allowlist={allowlist}
                  />
                )}
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    disabled={!step.completed}
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  {activeStep !== 0 && (
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        <div style={{ marginTop: '100px', padding: '20px', border: '2px solid red' }}>
          <p>Local pref: {JSON.stringify(localPref, null, 2)}</p>
        </div>
      </Box>
    </div>
  );
}
