const { Events } = require('discord.js');
const { createVoiceChannel } = require('@functions/utils/createVoiceChannel');
const {
	deleteEmptyTempChannels,
} = require('@functions/utils/deleteEmptyTempChannels');
const {
	settingsTempChannel,
} = require('@functions/menus/setUpSettingsTempChannels');
const { getColor } = require('@functions/utils/getColor');
const { getLocalizedText } = require('@functions/locale/getLocale');
const mustache = require('mustache');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const { member } = oldState || newState;
		const { guild } = member;
		const guildId = guild.id;
		const username = member.user.username;
		const localizedText = await getLocalizedText(member);

		const joinToCreateSchema = member.client.models.get('joinToCreate');
		const joinToCreateData = await joinToCreateSchema.findOne({
			guildId,
		});

		const temporaryChannels = member.client.models.get('temporaryChannels');

		if (!joinToCreateData) return;

		const interactionChannelId = joinToCreateData.channelId;

		await deleteEmptyTempChannels(member.guild);

		if (interactionChannelId === newState.channelId) {
			const parentCategory = newState.channel?.parent;
			const channelName = mustache.render(
				localizedText.events.joinToCreate.channelName,
				{ username }
			);

			const existingChannel = await temporaryChannels.findOne({
				guildId,
				channelId: newState.channelId,
			});

			if (!existingChannel) {
				const createdVoiceChannel = await createVoiceChannel(
					member.guild,
					member,
					channelName,
					0,
					parentCategory
				);

				if (createdVoiceChannel && newState) {
					newState.setChannel(createdVoiceChannel);

					await temporaryChannels.findOneAndUpdate(
						{ guildId, channelId: createdVoiceChannel.id },
						{ $set: { creatorId: member.id, channelName } },
						{ upsert: true }
					);

					const defaultBotColor = getColor('default');

					await createdVoiceChannel.send({
						embeds: [
							{
								color: defaultBotColor,
								title: localizedText.events.joinToCreate.tempVoiceChannelTitle,
							},
						],
						components: [await settingsTempChannel(member)],
					});
				}
			}
		}
	},
};
