import React, { useState } from 'react';
import { CreatedPref } from './types';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DbData } from '../../db/types';

function PrefIdSelector(props: {
  allowlist: DbData['allowlist'];
  onCompleted: (pref: CreatedPref) => void;
  pref: CreatedPref;
}) {
  const prefOptions = Object.keys(props.allowlist.prefsById).map((prefId) => {
    const pref = props.allowlist.prefsById[prefId];
    const label = `${pref.display_name} (\`${pref.id}\`)${pref.description && ':'} ${
      pref.description || ''
    }`;
    return { label, value: pref.id };
  });

  const [localPref, setLocalPref] = useState<CreatedPref>(props.pref);
  const handlePrefChange = (
    _event: React.SyntheticEvent,
    selection: { label: string; value: string } | null
  ) => {
    const prefId = selection?.value || '';
    if (prefId === localPref.id) {
      return;
    }
    const updatedLocalPref = { ...localPref, id: prefId };
    setLocalPref(updatedLocalPref);
    props.onCompleted(updatedLocalPref);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <p>What customer characteristic is being chosen?</p>
      <Autocomplete
        disablePortal
        options={prefOptions}
        sx={{ width: '100%', marginBottom: '30px ' }}
        renderInput={(params) => <TextField {...params} />}
        onChange={handlePrefChange}
      />
      <Accordion>
        <AccordionSummary
          sx={{ fontSize: '0.9em' }}
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="help-me-choose-content"
          id="help-me-choose"
        >
          Help me choose
        </AccordionSummary>
        <AccordionDetails>
          <p>
            The pref ID is a category used to group similar choices together, so the
            customer's preference can travel between those choices, and the customer does
            not have to repeat themselves. For example, all three of the choices below
            would use the
            <code>host</code> pref ID:
          </p>
          <ul>
            <li>whether they're running the Agent on AWS or GCP</li>
            <li>whether their instance of Postgres is hosted on AWS or Azure</li>
            <li>which cloud host to configure for cost management features</li>
          </ul>
          <p>
            While each of the above choices is distinctly unique, all of them represent
            the choice of a <code>host</code>, so that is the pref ID used.
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          sx={{ fontSize: '0.9em' }}
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="info-usage-content"
          id="info-usage"
        >
          How is this information used?
        </AccordionSummary>
        <AccordionDetails>
          <p>
            The pref ID is a category used to group similar choices together, so the
            customer's preference can travel between those choices, and the customer does
            not have to repeat themselves.
          </p>
          <p>
            If they choose AWS as their host on one page, we also apply this selection to
            different choices on other pages when appropriate, so the customer enjoys a
            customized experience without needing to configure each page individually.
          </p>
          <p>
            The pref ID also appears in the URL, such as{' '}
            <code>docs.datadoghq.com/agent/setup?host=aws</code>.
          </p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

interface Step {
  label: string;
  completed: boolean;
}

function PrefBuilder(props: {
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
  );
}

export default function NewPrefForm(props: {
  pref: CreatedPref;
  allowlist: DbData['allowlist'];
}) {
  const [localPref, setLocalPref] = useState<CreatedPref>(props.pref);

  return (
    <div style={{ borderTop: '1px solid black', marginTop: '30px' }}>
      <h2>Add a choice to the page</h2>
      <PrefBuilder pref={props.pref} allowlist={props.allowlist} />
    </div>
  );
}
