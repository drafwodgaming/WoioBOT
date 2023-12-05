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
const temporaryChannelsSchema = require('@source/models/temporaryChannels');
const { i18n } = require('@config/i18nConfig');
const {
	handleLockUnlock,
} = require('@source/functions/utils/handleLockUnlock');

module.exports = {
	data: { name: menus.settingTempChannel },
	async execute(interaction) {
		const guildId = interaction.guild.id;
		const memberId = interaction.user.id;

		const existingChannel = await temporaryChannelsSchema.findOne({
			guildId,
			creatorId: memberId,
		});

		if (!existingChannel) {
			await interaction.deferUpdate();
			await interaction.followUp({
				content: i18n.__('components.menus.tempChannel.noCreate'),
				ephemeral: true,
			});
			await interaction.editReply({
				components: [settingsTempChannel()],
			});
		} else if (interaction.isStringSelectMenu()) {
			const selectedValue = interaction.values[0];

			switch (selectedValue) {
				case menus.values.tempChannelName:
					await interaction.showModal(createTempChannelName());
					break;
				case menus.values.tempChannelLimit:
					await interaction.showModal(createTempChannelLimit());
					break;
				case menus.values.tempChannelLock:
					await handleLockUnlock(interaction, false);
					break;
				case menus.values.tempChannelUnlock:
					await handleLockUnlock(interaction, true);
					break;
			}

			await interaction.editReply({ components: [settingsTempChannel()] });
		}
	},
};
