import Discord from 'discord.js'
import DiscordVoice, { VoiceConnectionStatus, createAudioPlayer, joinVoiceChannel, entersState, createAudioResource, getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice'
import { SlashCommandBuilder } from '@discordjs/builders';
import youtubedl from 'youtube-dl';
var currentAudio: DiscordVoice.PlayerSubscription;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Plays, alters, or stops an audio resource')
        .setDefaultPermission(false)
        .addSubcommand(option => option.setName('play').setDescription('Plays an audio resource').addStringOption(option => option.setName('search').setDescription('The YouTube link to play or keyword(s) to search for').setRequired(true)))
        .addSubcommand(option => option.setName('manipulate').setDescription('Brings up manipulation tools')),
    async execute(interaction: Discord.CommandInteraction) {
        var audioPlayer = createAudioPlayer({});
        const play = interaction.options.getString('search')
        interaction.reply({embeds: [global.Functions.BasicEmbed(("normal"), "Working...")]}).then(async (m) => {
            if (play != null) {
                const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('resume')
                        .setLabel('Resume')
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId('pause')
                        .setLabel('Pause')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId('stop')
                        .setLabel('Stop')
                        .setStyle('DANGER')
                )

                await interaction.editReply({content: "Choose an action:", components: [row], embeds: []})

                interaction.channel.createMessageComponentCollector({time: 15000}).on('collect', async (interaction2) => {
                    if (interaction2.customId == "stop") {
                        const currentChannel = getVoiceConnection(interaction.guild.id)
                        if (currentChannel == undefined) {
                            interaction2.update({embeds: [global.Functions.BasicEmbed(("error"), "No audio playing.")]})
                            return;
                        }
                        currentChannel.destroy()
                        currentChannel.disconnect()
                        currentAudio = undefined
                        interaction2.update({embeds: [global.Functions.BasicEmbed(("success"), "Stopped audio.")]})
                        return;
                    }
                    else if (interaction2.customId == "pause") {
                        if (currentAudio == undefined) {
                            interaction2.update({embeds: [global.Functions.BasicEmbed(("error"), "No audio playing.")]})
                            return;
                        }
                        if (currentAudio.player.state.status == AudioPlayerStatus.Paused) {
                            interaction2.update({embeds: [global.Functions.BasicEmbed(("error"), "Audio is already paused!")]})
                            return;
                        }
                        currentAudio.player.pause()
                        interaction2.update({embeds: [global.Functions.BasicEmbed(("success"), "Paused audio.")]})
                        return;
                    }
                    else if (interaction2.customId == "resume") {
                        if (currentAudio == undefined) {
                            interaction2.update({embeds: [global.Functions.BasicEmbed(("error"), "No audio playing.")]})
                            return;
                        }
                        if (currentAudio.player.state.status == AudioPlayerStatus.Playing) {
                            interaction2.update({embeds: [global.Functions.BasicEmbed(("error"), "Audio is already playing!")]})
                            return;
                        }
                        currentAudio.player.unpause()
                        interaction2.update({embeds: [global.Functions.BasicEmbed(("success"), "Resumed audio.")]})
                        return;
                    }
                })
            }
            else {
                var inChannel = false
                var pattern = new RegExp('^(https?:\\/\\/)?'+'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+'((\\d{1,3}\\.){3}\\d{1,3}))'+'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+'(\\?[;&a-z\\d%_.~+=-]*)?'+'(\\#[-a-z\\d_]*)?$','i')
                var link = "None"
                if (!!pattern.test(play) == true && play.includes("youtube")) {
                    link = play
                }
                interaction.guild.channels.cache.filter(channel => channel.type === "GUILD_VOICE").each(async c => {
                    if ((c as Discord.VoiceChannel).members.find(user => user.id === interaction.user.id)) {
                        inChannel = true
                        if ((c as Discord.VoiceChannel).full == false) {
                            interaction.editReply({embeds: [global.Functions.BasicEmbed(("normal"), "Getting audio...")]})
                            var name = ""
                            var search = link
                            if (search == "None") search = `ytsearch:${play}`;
                            youtubedl.getInfo(search, async function (err: Error, info: any) {
                                link = `https://youtube.com/watch?v=${info.id}`
                                name = info.title
                                await interaction.editReply({embeds: [global.Functions.BasicEmbed(("normal"), "Joining voice channel...")]});
                                const connection = joinVoiceChannel({channelId: c.id, guildId: c.guild.id, adapterCreator: c.guild.voiceAdapterCreator})
                                await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
                                const stream = youtubedl(link, [], {})
                                currentAudio = connection.subscribe(audioPlayer);
                                var resource = createAudioResource(stream, {inlineVolume: true});
                                resource.volume.setVolume(0.5);
                                audioPlayer.play(resource);
                                interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), `Now playing [${name}](${link}).`)]})
                                stream.on('complete', function (info: string) {
                                    currentAudio.connection.destroy()
                                    getVoiceConnection(interaction.guild.id).disconnect()
                                    currentAudio = undefined
                                })
                                audioPlayer.on('error', (error) => {

                                })
                            });
                        }
                        else {
                            return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "The voice channel you are in is full.")]})
                        }
                    }
                })
                if (inChannel == false) {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Please join a voice channel.")]})
                }
            }
        })
    }
}