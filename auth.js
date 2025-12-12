function isElite() {
  return currentUserProfile?.tier === "elite";
}

function requireElite(featureName = "This feature") {
  if (!isElite()) {
    alert(`${featureName} is for Elite members only.`);
    return false;
  }
  return true;
}
