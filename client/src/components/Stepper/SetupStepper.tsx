import styled from 'styled-components'
import { Typography } from 'src/components/MUI/Typography'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Box from '@mui/material/Box'
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import Check from '@mui/icons-material/Check'

interface ISetupStepper {
  steps: string[]
  activeStep: number
}

const Connector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 24px)',
    right: 'calc(50% + 24px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#4CD137',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#4CD137',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderRadius: 1,
  },
}))

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ ownerState }) => ({
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#4CD137',
    }),
    '& .QontoStepIcon-completedIcon': {
      color: 'white',
      zIndex: 1,
      fontSize: 12,
      width: 32,
      height: 32,
      borderRadius: '100%',
      backgroundColor: '#4CD137',
    },
    '& .QontoStepIcon-circle': {
      boxSizing: 'border-box',
      border: '4px solid #4CD137',
      width: 32,
      height: 32,
      borderRadius: '100%',
      backgroundColor: '#eaeaf0',
    },
  }),
)

function StepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  )
}

export const SetupStepper = (props: ISetupStepper) => {
  const { steps, activeStep } = props
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<Connector />}
      >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel StepIconComponent={StepIcon}>
              <Typography>{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
