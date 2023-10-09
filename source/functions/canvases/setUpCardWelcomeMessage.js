const { AttachmentBuilder } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas');
const { fonts, memberCard, colors } = require('@config/botConfig.json');
const memberCardBackground = require('@config/memberBackground.json');

async function cardWelcomeMessage(member) {
	const { user } = member;
	const { username } = user;
	const avatarURL = user.displayAvatarURL({ extension: 'jpg' });
	const fontSize = 43;
	const canvasColor = colors.canvasWhite;

	const canvas = createCanvas(1024, 450);
	const context = canvas.getContext('2d');
	const background = await loadImage(memberCardBackground.welcome);
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	const welcomeMessage = `Welcome ${username}!`;
	const { width, height } = canvas;
	const welcomeMessageX = width / 2;
	const welcomeMessageY = height - 90;

	registerFont(fonts.luckiestGuyRegular.path, {
		family: fonts.luckiestGuyRegular.family,
	});

	context.textAlign = 'center';
	context.fillStyle = canvasColor;
	context.font = `${fontSize}px ${fonts.luckiestGuyRegular.family}`;
	context.fillText(welcomeMessage, welcomeMessageX, welcomeMessageY);

	context.beginPath();
	context.lineWidth = 10;
	context.strokeStyle = colors.canvasWhite;
	context.arc(width / 2, height - 270, 100, 0, Math.PI * 2, true);
	context.stroke();
	context.clip();

	const avatarImage = await loadImage(avatarURL);
	context.drawImage(avatarImage, width / 2 - 100, height - 370, 200, 200);

	const leaveMessageAttachment = new AttachmentBuilder(
		canvas.toBuffer('image/png'),
		memberCard.welcome
	);
	return leaveMessageAttachment;
}

module.exports = { cardWelcomeMessage };
