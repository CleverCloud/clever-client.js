export const STATUSES = {
  STOPPED: 'stopped',
  STARTING: 'starting',
  START_FAILED: 'start-failed',
  RESTARTING_WITH_DOWNTIME: 'restarting-with-downtime',
  RESTARTING: 'restarting',
  RESTART_FAILED: 'restart-failed',
  RUNNING: 'running',
  UNKNOWN: 'unknown',
};

export function getStatus (app, deployments, instances) {

  const lastDeploymentState = (deployments != null && deployments[0] != null) ? deployments[0].state : null;
  const upInstancesCount = (instances || []).filter(({ state }) => state === 'UP').length;

  if (app.state === 'SHOULD_BE_DOWN') {
    return STATUSES.STOPPED;
  }

  if (app.state === 'WANTS_TO_BE_UP') {
    if (lastDeploymentState === 'WIP') {
      return STATUSES.STARTING;
    }
    if (lastDeploymentState === 'FAIL') {
      return STATUSES.START_FAILED;
    }
  }

  if (app.state === 'SHOULD_BE_UP') {
    if (lastDeploymentState === 'WIP') {
      if (app.homogeneous === true) {
        return STATUSES.RESTARTING_WITH_DOWNTIME;
      }
      if (app.homogeneous === false) {
        if (upInstancesCount > 0) {
          return STATUSES.RESTARTING;
        }
      }
    }
    else if (lastDeploymentState === 'FAIL') {
      if (upInstancesCount > 0) {
        return STATUSES.RESTART_FAILED;
      }
    }
    else {
      if (upInstancesCount > 0) {
        return STATUSES.RUNNING;
      }
    }
  }

  return STATUSES.UNKNOWN;
}
