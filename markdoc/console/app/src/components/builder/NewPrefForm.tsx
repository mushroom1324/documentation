import React from 'react';
import { CreatedPref } from './types';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DbData } from '../../db/types';

function PrefIdSelector(props: {
  allowlist: DbData['allowlist'];
  onCompleted: () => void;
  pref: CreatedPref;
}) {
  const prefOptions = Object.keys(props.allowlist.prefsById).map((prefId) => {
    const pref = props.allowlist.prefsById[prefId];
    const label = `${pref.display_name} (\`${pref.id}\`) ${pref.description || ''}`;
    return { label, value: pref.id };
  });

  const [draftPref, setDraftPref] = React.useState<CreatedPref>(props.pref);
  const handlePrefChange = (
    _event: React.SyntheticEvent,
    selection: { label: string; value: string } | null
  ) => {
    const prefId = selection?.value || '';
    if (prefId === draftPref.id) {
      return;
    }
    setDraftPref({ ...draftPref, id: prefId });
  };

  return (
    <div>
      {JSON.stringify(draftPref)}
      <p>What high-level customer characteristic is being chosen?</p>
      <Autocomplete
        disablePortal
        options={prefOptions}
        sx={{ width: '100%', marginBottom: '30px ' }}
        renderInput={(params) => <TextField {...params} />}
        onChange={handlePrefChange}
      />
      <Accordion>
        <AccordionSummary
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

function PrefBuilder(props: { pref: CreatedPref; allowlist: DbData['allowlist'] }) {
  const { pref, allowlist } = props;
  const steps = ['Choose the pref', 'Choose the options'];

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step}
            </StepLabel>
            <StepContent>
              {activeStep === 0 && (
                <PrefIdSelector
                  pref={pref}
                  onCompleted={handleNext}
                  allowlist={allowlist}
                />
              )}
              <Box sx={{ mb: 2 }}>
                <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                  {index === steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
                <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default function NewPrefForm(props: {
  pref: CreatedPref;
  allowlist: DbData['allowlist'];
}) {
  return (
    <div style={{ borderTop: '1px solid black', marginTop: '30px' }}>
      <h2>Add a new page preference</h2>
      <PrefBuilder pref={props.pref} allowlist={props.allowlist} />
    </div>
  );
}
