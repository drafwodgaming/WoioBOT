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
const { getLocalizedText } = require('@source/functions/locale/getLocale');
const mustache = require('mustache');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');
module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const { member } = oldState || newState;
		const { guild } = member;
		const guildId = guild.id;
		const username = member.user.username;
		const localizedText = await getLocalizedText(member);

		const joinToCreateData = await joinToCreateSchema.findOne({
			guildId,
		});

		if (!joinToCreateData) return;

		const { channelId: interactionChannelId } = joinToCreateData;

		await deleteEmptyTempChannels(member.guild);

		if (interactionChannelId === newState.channelId) {
			const parentCategory = newState.channel?.parent;
			const channelName = mustache.render(
				localizedText.events.joinToCreate.channelName,
				{ username }
			);

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
					await updateRecordField(
						temporaryChannelsSchema,
						{ guildId, channelId: createdVoiceChannel.id },
						{ creatorId: member.id, channelName }
					);
				}, 500);

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
	},
};
