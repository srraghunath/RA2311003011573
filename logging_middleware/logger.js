let authToken = "";

export const setToken = (token) => {
  authToken = token;
};

export const Log = async (stack, level, packageType, message) => {
  const validStacks = ["backend", "frontend"];
  if (!validStacks.includes(stack)) return;

  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  
  const backendOnlyPackages = ["cache", "db", "handler", "repository"];
  const frontendOnlyPackages = ["component", "page", "style", "hook"];
  const commonPackages = ["api", "auth", "state"];

  let validPackages = [...commonPackages];
  if (stack === "frontend") validPackages = validPackages.concat(frontendOnlyPackages);
  if (stack === "backend") validPackages = validPackages.concat(backendOnlyPackages);

  if (!validLevels.includes(level)) return;
  if (!validPackages.includes(packageType)) return;

  const payload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: packageType.toLowerCase(),
    message: message.toLowerCase()
  };

  try {
    await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // Silent fail allowed
  }
};
