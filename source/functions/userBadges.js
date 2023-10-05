const emojis = require("../../config/emojis.json");

function addBadges(badgeNames) {
  if (!badgeNames.length) return ["no badges"];
  const badgeMap = {
    ActiveDeveloper: emojis.activeDeveloper,
    BugHunterLevel1: emojis.bugHunerLevel1,
    BugHunterLevel2: emojis.bugHunterLevel2,
    CertifiedModerator: emojis.certifiedModerator,
    HypeSquadOnlineHouse1: emojis.hypeSquadOnlineHouse1,
    HypeSquadOnlineHouse2: emojis.hypeSquadOnlineHouse2,
    HypeSquadOnlineHouse3: emojis.hypeSquadOnlineHouse3,
    Hypesquad: emojis.hypesquad,
    Partner: emojis.partner,
    PremiumEarlySupporter: emojis.premiumEarlySupporter,
    Staff: emojis.staff,
    VerifiedDeveloper: emojis.verifiedDeveloper,
    VerifiedBot: emojis.verifiedBot,
  };

  return badgeNames.map((badgeName) => badgeMap[badgeName]);
}

module.exports = { addBadges };
