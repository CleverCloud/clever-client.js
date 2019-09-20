export function getStatus (app, deployments, instances) {

  const lastDeploymentState = (deployments != null && deployments[0] != null) ? deployments[0].state : null;
  const upInstancesCount = (instances || []).filter(({ state }) => state === 'UP').length;

  if (app.state === 'SHOULD_BE_DOWN') {
    return 'stopped';
  }

  if (app.state === 'WANTS_TO_BE_UP') {
    if (lastDeploymentState === 'WIP') {
      return 'starting';
    }
    if (lastDeploymentState === 'FAIL') {
      return 'start-failed';
    }
  }

  if (app.state === 'SHOULD_BE_UP') {
    if (lastDeploymentState === 'WIP') {
      if (app.homogeneous === true) {
        return 'restarting-with-downtime';
      }
      if (app.homogeneous === false) {
        if (upInstancesCount > 0) {
          return 'restarting';
        }
      }
    }
    else if (lastDeploymentState === 'FAIL') {
      if (upInstancesCount > 0) {
        return 'restart-failed';
      }
    }
    else {
      if (upInstancesCount > 0) {
        return 'running';
      }
    }
  }

  return 'unknown';
}
