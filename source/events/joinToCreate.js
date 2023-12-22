const { Events } = require('discord.js');
const { createVoiceChannel } = require('@functions/utils/createVoiceChannel');
const joinToCreateSchema = require('@source/models/joinToCreate');
const temporaryChannelsSchema = require('@source/models/temporaryChannels');
const {
	deleteEmptyTempChannels,
} = require('@functions/utils/deleteEmptyTempChannels');
const {
	settingsTempChannel,
} = require('@functions/menus/setUpSettingsTempChannels');
const { getColor } = require('@functions/utils/getColor');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const { member } = oldState || newState;
		const { guild } = member;
		const guildId = guild.id;

		const joinToCreateData = await joinToCreateSchema.findOne({
			guildId,
		});

		if (!joinToCreateData) return;

		const { channelId: interactionChannelId } = joinToCreateData;
		const existingTempChannels = await temporaryChannelsSchema.find({
			guildId: oldState.member.guild.id,
		});

		await deleteEmptyTempChannels(member.guild, existingTempChannels);

		if (interactionChannelId === newState.channelId) {
			const parentCategory = newState.channel?.parent;
			const channelName = `🔉| ${member.user.username} channel`;

			const createdVoiceChannel = await createVoiceChannel(
				member.guild,
				member,
				channelName,
				0,
				parentCategory
			);

			if (createdVoiceChannel && newState) {
				newState.setChannel(createdVoiceChannel);

				setTimeout(async () => {
					await temporaryChannelsSchema.create({
						guildId,
						channelId: createdVoiceChannel.id,
						creatorId: member.id,
						channelName,
					});
				}, 500);

				const defaultBotColor = getColor('default');

				await createdVoiceChannel.send({
					embeds: [
						{ color: defaultBotColor, title: 'Temporary Voice Channel' },
					],
					components: [settingsTempChannel()],
				});
			}
		}
	},
};
