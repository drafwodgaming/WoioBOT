const { menus } = require('@config/componentsId.json');
const {
	createTempChannelName,
} = require('@functions/modals/setUpTempChannelName');
const {
	createTempChannelLimit,
} = require('@functions/modals/setUpTempChannelLimit');
const {
	settingsTempChannel,
} = require('@functions/menus/setUpSettingsTempChannels');
const {
	handleLockUnlock,
} = require('@source/functions/utils/handleLockUnlock');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

module.exports = {
	data: { name: menus.settingTempChannel },
	async execute(interaction) {
		const guildId = interaction.guild.id;
		const memberId = interaction.user.id;
		const localizedText = await getLocalizedText(interaction);
		const temporaryChannelsSchema =
			interaction.client.models.get('temporaryChannels');

		const existingChannel = await temporaryChannelsSchema.findOne({
			guildId,
			creatorId: memberId,
		});

		if (!existingChannel) {
			await interaction.deferUpdate();
			await interaction.followUp({
				content: localizedText.components.menus.tempChannel.noCreate,
				ephemeral: true,
			});
			await interaction.editReply({
				components: [await settingsTempChannel(interaction)],
			});
		} else if (interaction.isStringSelectMenu()) {
			const selectedValue = interaction.values[0];

			switch (selectedValue) {
				case menus.values.tempChannelName:
					await interaction.showModal(await createTempChannelName(interaction));
					break;
				case menus.values.tempChannelLimit:
					await interaction.showModal(
						await createTempChannelLimit(interaction)
					);
					break;
				case menus.values.tempChannelLock:
					await handleLockUnlock(interaction, false);
					break;
				case menus.values.tempChannelUnlock:
					await handleLockUnlock(interaction, true);
					break;
			}

			await interaction.editReply({
				components: [await settingsTempChannel(interaction)],
			});
		}
	},
};
