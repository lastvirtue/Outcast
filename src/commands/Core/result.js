import { SlashCommandBuilder } from 'discord.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
  data: new SlashCommandBuilder()
    .setName('result')
    .setDescription('Rank a user by giving them a role')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to rank')
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The role to give')
        .setRequired(true)
    )
    .setDMPermission(false),

  category: 'Core',

  async execute(interaction, config, client) {
    await InteractionHelper.safeDefer(interaction);

    const targetUser = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');

    const member = await interaction.guild.members
      .fetch(targetUser.id)
      .catch(() => null);

    if (!member) {
      await InteractionHelper.safeEditReply(interaction, {
        content: 'User could not be found in this server.'
      });
      return;
    }

    try {
      await member.roles.add(role);

      await InteractionHelper.safeEditReply(interaction, {
        content: `${member} has been ranked to **${role.name}**`
      });

      logger.info(
        `Result command: ${targetUser.id} was given ${role.name} by ${interaction.user.id}`
      );
    } catch (error) {
      logger.error('Result command failed', error);

      await InteractionHelper.safeEditReply(interaction, {
        content: 'I could not give that role to the user.'
      });
    }
  }
};        content: '❌ Could not find that user in this server.'
      });
      return;
    }

    try {
      await member.roles.add(role);

      await InteractionHelper.safeEditReply(interaction, {
        content: `✅ ${member} has been ranked to **${role.name}**`
      });

      logger.info(
        `Result command: ${targetUser.id} was given ${role.name} by ${interaction.user.id}`
      );
    } catch (error) {
      logger.error('Result command failed', error);

      await InteractionHelper.safeEditReply(interaction, {
        content: '❌ I could not give that role to the user.'
      });
    }
  }
};
