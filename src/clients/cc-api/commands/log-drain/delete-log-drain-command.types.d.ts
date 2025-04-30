export type DeleteLogDrainCommandInput = ({ applicationId: string } | { addonId: string }) & {
  drainId: string;
};
