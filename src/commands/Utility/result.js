import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName("result")
    .setDescription("Give a rank role to a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user getting the rank")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The rank role to give")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getMember("user");
    const role = interaction.options.getRole("role");

    if (!user || !role) {
      return InteractionHelper.safeEditReply(interaction, {
        content: "❌ User or role not found."
      });
    }

    try {
      await user.roles.add(role);

      const embed = createEmbed({
        title: "TSBAH Leaderboard Bot",
      })
      .setDescription(
        `🏆 **Ranking Updated**\n\n` +
        `👤 User: ${user}\n` +
        `🎖️ Rank: **${role.name}**`
      )
      .setThumbnail(user.user.displayAvatarURL({ size: 256 }));

      await InteractionHelper.safeReply(interaction, {
        embeds: [embed]
      });

      logger.info(`Result command used`, {
        executor: interaction.user.id,
        target: user.id,
        role: role.id
      });

    } catch (error) {
      logger.error("Result command failed", error);

      await InteractionHelper.safeEditReply(interaction, {
        content: "❌ I couldn't give that role."
      });
    }
  },
};
