const { AttachmentBuilder } = require("discord.js");
const { registerFont, createCanvas, loadImage } = require("canvas");
const { fonts, memberCard, colors } = require("../../../config/botConfig.json");
const memberCardBackground = require("../../../config/memberBackground.json");

async function cardLeaveMessage(member) {
  const { user } = member;
  const { username } = user;
  const avatarURL = user.displayAvatarURL({ extension: "jpg" });
  const fontSize = 43;
  const canvasColor = colors.canvasWhite;

  const canvas = createCanvas(1024, 450);
  const context = canvas.getContext("2d");
  const background = await loadImage(memberCardBackground.leave);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  const text = `Goodbye ${username}!`;
  const { width, height } = canvas;
  const textX = width / 2;
  const textY = height - 90;

  registerFont(fonts.luckiestGuyRegular.path, {
    family: fonts.luckiestGuyRegular.family,
  });

  context.textAlign = "center";
  context.fillStyle = canvasColor;
  context.font = `${fontSize}px ${fonts.luckiestGuyRegular.family}`;
  context.fillText(text, textX, textY);

  context.beginPath();
  context.lineWidth = 10;
  context.strokeStyle = colors.canvasWhite;
  context.arc(width / 2, height - 270, 100, 0, Math.PI * 2, true);
  context.stroke();
  context.clip();

  const imageAvatar = await loadImage(avatarURL);
  context.drawImage(imageAvatar, width / 2 - 100, height - 370, 200, 200);

  const imageAttachment = new AttachmentBuilder(
    canvas.toBuffer("image/png"),
    memberCard.leave
  );

  return imageAttachment;
}

module.exports = { cardLeaveMessage };
