const botConfig = require('@config/botConfig.json');
const express = require('express');
const axios = require('axios');
const path = require('path');

async function discordOauth2(client) {
	const oauth = client.models.get('discordOauth2');

	const app = express();

	app.get('/api/auth/discord/redirect', async (req, res) => {
		const { code } = req.query;

		if (code) {
			const formData = new URLSearchParams({
				client_id: botConfig.clientIdDev,
				client_secret: botConfig.clientSecretDev,
				grant_type: botConfig.grantType.authorizationCode,
				code: code.toString(),
				redirect_uri: botConfig.redirectUrl,
			});

			const output = await axios.post(botConfig.discordOauthToken, formData, {
				headers: { 'Content-Type': botConfig.contentType },
			});

			if (output.data) {
				const access = output.data.access_token;

				const userInfo = await axios.get(botConfig.getUserInfo, {
					headers: { Authorization: `Bearer ${access}` },
				});

				const formData1 = new URLSearchParams({
					client_id: botConfig.clientIdDev,
					client_secret: botConfig.clientSecretDev,
					grant_type: botConfig.grantType.refreshToken,
					refresh_token: output.data.refresh_token,
				});

				const refresh = await axios.post(
					botConfig.discordOauthToken,
					formData1,
					{ headers: { 'Content-Type': botConfig.contentType } }
				);
				const refreshToken = refresh.data.refresh_token;

				const { id } = userInfo.data;
				let user = await oauth.findOne({
					discordId: id,
				});
				console.log(refreshToken);

				user = !user
					? await new oauth({ discordId: id, refreshToken }).save()
					: ((user.refreshToken = refreshToken), await user.save());
			}
		}
		const filePath = path.join(__dirname, '../../../site/index.html');
		res.sendFile(filePath);
	});

	app.listen(1500, () => {
		console.log('Runnin on 5000 port');
	});
}

module.exports = { discordOauth2 };
