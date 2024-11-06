import React from 'react';
import { CreatedPref } from './types';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
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
  /*
  const prefOptions = [
    { label: 'host' },
    { label: 'programming lang' },
    { label: 'os' },
    { label: 'database' }
  ];
  */

  const prefOptions = Object.keys(props.allowlist.prefsById).map((prefId) => {
    const pref = props.allowlist.prefsById[prefId];
    return { label: pref.display_name, value: pref.id };
  });

  return (
    <div>
      <p>What high-level customer characteristic is being chosen?</p>
      <Autocomplete
        disablePortal
        options={prefOptions}
        sx={{ width: 300, marginBottom: '30px ' }}
        renderInput={(params) => <TextField {...params} />}
      />
      <p>
        For example, you would choose <code>host</code> from the list above if the user is
        selecting ...
      </p>
      <ul>
        <li>whether they're running the Agent on AWS or GCP</li>
        <li>whether their instance of Postgres is hosted on AWS or Azure</li>
        <li>which cloud host to configure for cost management features</li>
      </ul>
      <p>
        Each of the above choices is distinct, but each one chooses the user's{' '}
        <code>host</code>.
      </p>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          How is this information used?
        </AccordionSummary>
        <AccordionDetails>
          <p>
            The high-level customer characteristic (aka the <strong>pref ID</strong>)
            helps the customer's choices travel between pages. If they choose AWS as their
            host on one page, we also apply this selection to different choices on other
            pages when appropriate, so the customer enjoys a customized experience without
            needing to configure each page individually.
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
  const steps = ['Choose the pref', 'Name the option set', 'Add options'];

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
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* The contents of each step */}
          {activeStep === 0 && (
            <PrefIdSelector pref={pref} onCompleted={handleNext} allowlist={allowlist} />
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
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
