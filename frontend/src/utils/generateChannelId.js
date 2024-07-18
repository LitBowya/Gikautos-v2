export const generateChannelId = (userName1, userName2) => {
  // Sort the usernames alphabetically and join them with an underscore
  return [userName1, userName2].sort().join("_");
};
